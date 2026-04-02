import os
import chromadb
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer
import requests
from typing import List, Dict, Any
import json
import time

class RAGEngine:
    """
    Retrieval-Augmented Generation Engine
    
    Handles:
    - Document embedding and storage in ChromaDB
    - Similarity search for relevant medical information
    - HuggingFace API calls to BioMistral
    """
    
    def __init__(self, hf_token: str, model_name: str = "meta-llama/Llama-3.1-8B-Instruct"):
        self.hf_token = hf_token
        self.model_name = model_name
        self.hf_api_url = "https://router.huggingface.co/v1/chat/completions"
        chroma_path = os.getenv("CHROMA_PERSIST_DIRECTORY", "./chroma_db")
        self.chroma_client = chromadb.PersistentClient(path=chroma_path)
        
        # Get or create collection for medical documents
        collection_name = os.getenv("CHROMA_COLLECTION_NAME", "medical_documents")
        self.collection = self.chroma_client.get_or_create_collection(
            name=collection_name,
            metadata={"description": "Medical knowledge base for RAG"}
        )
        
        # Initialize embedding model (converts text to vectors)
        embedding_model = os.getenv("EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
        print(f"Loading embedding model: {embedding_model}")
        self.embedder = SentenceTransformer(embedding_model)
        print(f"RAG Engine initialized. Documents in collection: {self.collection.count()}")
    
    def add_documents(self, chunks: List[Dict[str, Any]], metadata: Dict[str, Any]):
        """
        Add document chunks to the vector database
        
        Args:
            chunks: List of text chunks from a document
            metadata: Document metadata (filename, upload date, etc.)
        """
        if not chunks:
            return
        
        # Prepare data for ChromaDB
        documents = []
        metadatas = []
        ids = []
        
        for i, chunk in enumerate(chunks):
            chunk_id = f"{metadata['filename']}_{i}"
            documents.append(chunk['text'])
            metadatas.append({
                **metadata,
                "chunk_index": i,
                "page": chunk.get('page', 'unknown')
            })
            ids.append(chunk_id)
        
        # Generate embeddings
        embeddings = self.embedder.encode(documents).tolist()
        
        # Add to ChromaDB
        self.collection.add(
            documents=documents,
            embeddings=embeddings,
            metadatas=metadatas,
            ids=ids
        )
        
        print(f"Added {len(chunks)} chunks from {metadata['filename']} to vector DB")
    
    def retrieve_relevant_context(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """
        Search for relevant medical information based on patient symptoms
        
        Args:
            query: Patient symptoms and information
            top_k: Number of relevant chunks to retrieve
            
        Returns:
            List of relevant document chunks with metadata
        """
        # Generate query embedding
        query_embedding = self.embedder.encode([query])[0].tolist()
        
        # Search ChromaDB for similar documents
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k
        )
        
        # Format results
        relevant_docs = []
        if results['documents'] and results['documents'][0]:
            for i, doc in enumerate(results['documents'][0]):
                relevant_docs.append({
                    "text": doc,
                    "metadata": results['metadatas'][0][i] if results['metadatas'] else {},
                    "distance": results['distances'][0][i] if results['distances'] else None
                })
        
        return relevant_docs
    
    def generate_diagnosis(self, patient_data: Dict[str, Any], context_docs: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Generate diagnosis using HuggingFace API with RAG context
        
        Args:
            patient_data: Patient information from the form
            context_docs: Relevant medical document chunks
            
        Returns:
            Structured diagnosis response
        """
        # Build context from retrieved documents
        context_text = "\n\n".join([
            f"Source: {doc['metadata'].get('filename', 'Unknown')}\n{doc['text']}"
            for doc in context_docs
        ])
        
        # Build the prompt for BioMistral
        prompt = self._build_medical_prompt(patient_data, context_text)
        
        # Call HuggingFace Inference API
        diagnosis_text = self._call_huggingface_api(prompt)
        
        # Parse the response into structured format
        parsed_diagnosis = self._parse_diagnosis_response(diagnosis_text, context_docs)
        
        return parsed_diagnosis
    
    def _build_medical_prompt(self, patient_data: Dict[str, Any], context: str) -> str:
        """Build a structured prompt for the medical LLM"""
        
        prompt = f"""You are a medical AI assistant. Based on the provided medical literature and patient information, generate a differential diagnosis.

MEDICAL CONTEXT FROM LITERATURE:
{context}

PATIENT INFORMATION:
- Age: {patient_data.get('age')} years old
- Gender: {patient_data.get('gender')}
- Chief Complaint & Symptoms: {patient_data.get('symptoms')}
- Duration: {patient_data.get('duration')}
- Medical History: {patient_data.get('history')}

TASK:
Provide a comprehensive medical assessment in the following format:

1. PRIMARY DIAGNOSIS (most likely conditions):
   - List 1-3 most probable diagnoses

2. DIFFERENTIAL DIAGNOSIS (alternative possibilities):
   - List 3-5 conditions to consider

3. RECOMMENDED TESTS:
   - List specific diagnostic tests and scans needed

4. URGENCY LEVEL:
   - Rate as: low, medium, high, or critical

5. CLINICAL RECOMMENDATIONS:
   - Immediate actions needed
   - Treatment suggestions
   - Follow-up care

6. ADDITIONAL NOTES:
   - Important considerations
   - Warning signs to monitor

Base your assessment ONLY on the medical literature provided and standard clinical guidelines. Be specific and evidence-based.
"""
        return prompt
    
    def _call_huggingface_api(self, prompt: str, max_retries: int = 3) -> str:
        """
        Call HuggingFace Router API with retry logic (NEW OpenAI-compatible format)
        
        Args:
            prompt: The medical prompt
            max_retries: Number of retries if API is loading
            
        Returns:
            Generated text from Llama 3.1
        """
        headers = {
            "Authorization": f"Bearer {self.hf_token}",
            "Content-Type": "application/json"
        }

        # NEW API FORMAT - OpenAI-compatible chat completions
        payload = {
            "model": self.model_name,
            "messages": [
                {
                    "role": "system",
                    "content": "You are a medical AI assistant. Provide accurate, evidence-based medical information."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "max_tokens": 800,
            "temperature": 0.3,
            "top_p": 0.95
        }

        for attempt in range(max_retries):
            try:
                response = requests.post(
                    self.hf_api_url,
                    headers=headers,
                    json=payload,
                    timeout=120
                )

                if response.status_code == 200:
                    result = response.json()

                    # Extract content from new API format
                    if "choices" in result and len(result["choices"]) > 0:
                        return result["choices"][0]["message"]["content"]
                    else:
                        return str(result)

                elif response.status_code == 503:
                    # Model is loading, wait and retry
                    wait_time = 20 * (attempt + 1)
                    print(f"Model loading... Waiting {wait_time}s before retry {attempt + 1}/{max_retries}")
                    time.sleep(wait_time)
                    continue

                else:
                    print(f"HuggingFace API error: {response.status_code} - {response.text}")
                    return self._fallback_diagnosis()

            except Exception as e:
                print(f"Error calling HuggingFace API (attempt {attempt + 1}): {str(e)}")
                if attempt == max_retries - 1:
                    return self._fallback_diagnosis()
                time.sleep(10)

        return self._fallback_diagnosis()
    
    def _parse_diagnosis_response(self, diagnosis_text: str, sources: List[Dict]) -> Dict[str, Any]:
        """
        Parse the LLM's text response into structured JSON
        
        This is a simple parser - can be improved with more sophisticated NLP
        """
        # Extract sources used
        source_files = list(set([
            doc['metadata'].get('filename', 'Unknown')
            for doc in sources
        ]))
        
        # Simple parsing logic (you can improve this)
        lines = diagnosis_text.split('\n')
        
        primary_diagnosis = []
        differential_diagnosis = []
        recommended_tests = []
        urgency = "medium"
        recommendations = []
        notes = ""
        
        current_section = None
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
            
            # Detect sections
            if "PRIMARY DIAGNOSIS" in line.upper():
                current_section = "primary"
            elif "DIFFERENTIAL" in line.upper():
                current_section = "differential"
            elif "RECOMMENDED TEST" in line.upper() or "DIAGNOSTIC TEST" in line.upper():
                current_section = "tests"
            elif "URGENCY" in line.upper():
                current_section = "urgency"
            elif "RECOMMENDATION" in line.upper():
                current_section = "recommendations"
            elif "NOTES" in line.upper() or "ADDITIONAL" in line.upper():
                current_section = "notes"
            
            # Extract content
            elif line.startswith('-') or line.startswith('•') or line[0].isdigit():
                content = line.lstrip('-•0123456789. ').strip()
                if not content:
                    continue
                
                if current_section == "primary":
                    primary_diagnosis.append(content)
                elif current_section == "differential":
                    differential_diagnosis.append(content)
                elif current_section == "tests":
                    recommended_tests.append(content)
                elif current_section == "recommendations":
                    recommendations.append(content)
            
            elif current_section == "urgency":
                if "critical" in line.lower():
                    urgency = "critical"
                elif "high" in line.lower():
                    urgency = "high"
                elif "low" in line.lower():
                    urgency = "low"
                else:
                    urgency = "medium"
            
            elif current_section == "notes":
                notes += line + " "
        
        # Fallback to defaults if parsing failed
        if not primary_diagnosis:
            primary_diagnosis = ["Diagnosis pending - requires clinical evaluation"]
        if not differential_diagnosis:
            differential_diagnosis = ["Further assessment needed"]
        if not recommended_tests:
            recommended_tests = ["Complete physical examination", "Standard blood panel"]
        if not recommendations:
            recommendations = ["Schedule follow-up appointment", "Monitor symptoms"]
        
        return {
            "primaryDiagnosis": primary_diagnosis[:3],  # Limit to top 3
            "differentialDiagnosis": differential_diagnosis[:5],  # Limit to top 5
            "recommendedTests": recommended_tests[:6],
            "urgencyLevel": urgency,
            "recommendations": recommendations[:5],
            "notes": notes.strip() or "Based on AI analysis of medical literature.",
            "sources": source_files
        }
    
    def _fallback_diagnosis(self) -> str:
        """Fallback response when HuggingFace API fails"""
        return """
PRIMARY DIAGNOSIS:
- Clinical evaluation required

DIFFERENTIAL DIAGNOSIS:
- Multiple conditions possible
- Requires physical examination

RECOMMENDED TESTS:
- Complete blood count (CBC)
- Comprehensive metabolic panel
- Vital signs monitoring

URGENCY LEVEL: medium

CLINICAL RECOMMENDATIONS:
- Schedule in-person examination
- Monitor symptoms closely
- Seek immediate care if symptoms worsen

ADDITIONAL NOTES:
AI service temporarily unavailable. Please conduct standard clinical assessment.
        """
    
    def get_document_count(self) -> int:
        """Get total number of documents in the vector database"""
        return self.collection.count()
    
    def list_indexed_documents(self) -> List[Dict[str, Any]]:
        """List all indexed documents with metadata"""
        results = self.collection.get()
        
        # Group by filename
        docs_map = {}
        if results['metadatas']:
            for metadata in results['metadatas']:
                filename = metadata.get('filename', 'Unknown')
                if filename not in docs_map:
                    docs_map[filename] = {
                        "filename": filename,
                        "upload_date": metadata.get('upload_date', 'Unknown'),
                        "chunks": 0
                    }
                docs_map[filename]["chunks"] += 1
        
        return list(docs_map.values())
    
    def delete_document(self, document_id: str) -> bool:
        """Delete a document and all its chunks from the vector database"""
        try:
            # Get all chunks for this document
            results = self.collection.get(
                where={"filename": document_id}
            )
            
            if results['ids']:
                self.collection.delete(ids=results['ids'])
                print(f"Deleted {len(results['ids'])} chunks for document {document_id}")
                return True
            return False
        
        except Exception as e:
            print(f"Error deleting document: {str(e)}")
            return False