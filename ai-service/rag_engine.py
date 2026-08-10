import os
import json
import chromadb
from sentence_transformers import SentenceTransformer
from typing import List, Dict, Any, Optional
from groq import Groq


class RAGEngine:
    """
    Retrieval-Augmented Generation Engine

    Handles:
    - Document embedding and storage in ChromaDB
    - Similarity search for relevant medical information
    - Groq API calls for generation
    """

    # Stale default removed: this previously defaulted to "llama3-70b-8192",
    # which Groq has decommissioned. A decommissioned model returns 400, and a
    # silent fallback on that error is what produced convincing-but-fabricated
    # clinical text once already. The real value comes from GROQ_MODEL in .env;
    # this default only matters if that is unset.
    def __init__(self, groq_api_key: str, model_name: str = "openai/gpt-oss-120b"):
        self.model_name = model_name

        # Initialize Groq client
        self.client = Groq(api_key=groq_api_key)

        # Initialize ChromaDB
        chroma_path = os.getenv("CHROMA_PERSIST_DIRECTORY", "./chroma_db")
        self.chroma_client = chromadb.PersistentClient(path=chroma_path)
        collection_name = os.getenv("CHROMA_COLLECTION_NAME", "medical_documents")
        self.collection = self.chroma_client.get_or_create_collection(
            name=collection_name,
            metadata={"description": "Medical knowledge base for RAG"}
        )

        # Relevance cutoff for retrieved chunks. Calibrated against production
        # (L2 distance, all-MiniLM-L6-v2, NIAMS corpus):
        #   in-corpus queries          0.74 – 1.12
        #   medical but out of corpus  1.48 – 1.68
        #   nonsense                   1.83 – 1.91
        # Set RAG_MAX_DISTANCE=999 to disable filtering entirely and restore the
        # previous behaviour without a code change.
        self.max_distance = float(os.getenv("RAG_MAX_DISTANCE", "1.25"))

        # Initialize embedding model
        embedding_model = os.getenv("EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
        print(f"Loading embedding model: {embedding_model}")
        self.embedder = SentenceTransformer(embedding_model)
        print(f"RAG Engine initialized. Documents: {self.collection.count()}")
        print(f"Relevance threshold (max L2 distance): {self.max_distance}")

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

        # Generate embeddings in batches to keep peak memory low — the
        # ai-service container is capped at 1500m in production.
        batch_size = 8
        embeddings = []
        for start in range(0, len(documents), batch_size):
            batch = documents[start:start + batch_size]
            embeddings.extend(self.embedder.encode(batch).tolist())
            print(f"  embedded {min(start + batch_size, len(documents))}/{len(documents)}")

        # Add to ChromaDB
        self.collection.add(
            documents=documents,
            embeddings=embeddings,
            metadatas=metadatas,
            ids=ids
        )

        print(f"Added {len(chunks)} chunks from {metadata['filename']} to vector DB")

    def retrieve_relevant_context(
        self,
        query: str,
        top_k: int = 5,
        max_distance: Optional[float] = None,
    ) -> List[Dict[str, Any]]:
        """
        Search for relevant medical information based on patient symptoms.

        ChromaDB returns the top_k nearest chunks regardless of how far away they
        actually are. With a small corpus that means an unrelated query still
        comes back with five confident-looking matches — a hamstring question
        retrieving pneumonia literature, for example. Anything beyond
        max_distance is therefore discarded here rather than handed to the LLM
        as context.

        Distances are L2 (ChromaDB default) and the scale is corpus-specific, so
        re-run calibrate_threshold.py after any significant change to the
        document set.

        Args:
            query: Patient symptoms and information
            top_k: Number of chunks to consider before filtering
            max_distance: Override the configured cutoff (None uses the default)

        Returns:
            List of relevant document chunks with metadata. May be empty.
        """
        if max_distance is None:
            max_distance = self.max_distance

        # Generate query embedding
        query_embedding = self.embedder.encode([query])[0].tolist()

        # Search ChromaDB for similar documents
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k
        )

        # Format and filter results
        relevant_docs = []
        rejected = 0

        if results['documents'] and results['documents'][0]:
            for i, doc in enumerate(results['documents'][0]):
                distance = results['distances'][0][i] if results['distances'] else None

                # A chunk with no distance is kept rather than silently dropped:
                # a missing score is a bug worth noticing, not a relevance signal.
                if distance is not None and distance > max_distance:
                    rejected += 1
                    continue

                relevant_docs.append({
                    "text": doc,
                    "metadata": results['metadatas'][0][i] if results['metadatas'] else {},
                    "distance": distance
                })

        print(f"Retrieval: {len(relevant_docs)} kept, {rejected} rejected (max_distance={max_distance})")
        if relevant_docs and relevant_docs[0]['distance'] is not None:
            print(f"  closest match: {relevant_docs[0]['distance']:.4f}")

        return relevant_docs

    def generate_diagnosis(self, patient_data: Dict[str, Any], context_docs: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Generate diagnosis using Groq API with RAG context

        Args:
            patient_data: Patient information from the form
            context_docs: Relevant medical document chunks

        Returns:
            Structured diagnosis response
        """
        # Nothing cleared the relevance threshold. Do NOT call the LLM here: with
        # no supporting literature it would answer from its own training, and the
        # output would be indistinguishable to the reader from a literature-backed
        # one. Saying plainly that we have nothing reliable is the correct answer.
        if not context_docs:
            print("No context above relevance threshold — returning no-information response")
            return self._no_context_response()

        # Build context from retrieved documents
        context_text = "\n\n".join([
            f"Source: {doc['metadata'].get('filename', 'Unknown')}\n{doc['text']}"
            for doc in context_docs
        ])

        # Build the prompt
        prompt = self._build_medical_prompt(patient_data, context_text)

        # Call Groq API
        diagnosis_text = self._call_groq_api(prompt)

        # Parse the response into structured format
        parsed_diagnosis = self._parse_diagnosis_response(diagnosis_text, context_docs)

        return parsed_diagnosis

    def _no_context_response(self) -> Dict[str, Any]:
        """
        Returned when nothing in the knowledge base is close enough to the query.

        Note the empty sources list. The failure this exists to prevent is citing
        a document that was retrieved but is not actually relevant — worse than
        citing nothing, because the citation makes an unsupported answer look
        sourced.
        """
        return {
            "primaryDiagnosis": [],
            "differentialDiagnosis": [],
            "recommendedTests": [],
            "urgencyLevel": "unknown",
            "recommendations": [
                "Describe these symptoms to a doctor, pharmacist, or nurse.",
                "Seek urgent care if symptoms are severe or worsening quickly.",
            ],
            "notes": (
                "The medical literature available to this tool does not cover the "
                "symptoms described, so no explanation can be given here. This is "
                "not a sign that the symptoms are unimportant — only that this tool "
                "has nothing reliable to say about them. Please speak to a "
                "healthcare professional."
            ),
            "sources": [],
            "noRelevantContext": True,
        }

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
Respond with ONLY a valid JSON object in exactly this shape. No markdown, no tables, no text outside the JSON:

{{
  "primaryDiagnosis": ["1-3 most probable conditions"],
  "differentialDiagnosis": ["3-5 alternative conditions to consider"],
  "recommendedTests": ["specific diagnostic tests or scans"],
  "urgencyLevel": "low, medium, high, or critical",
  "recommendations": ["immediate actions, treatment, follow-up care"],
  "notes": "important considerations and warning signs to monitor"
}}

Base your assessment ONLY on the medical literature provided. Be specific and evidence-based.
"""
        return prompt

    def _call_groq_api(self, prompt: str) -> str:
        """Call Groq API - fast, free, reliable"""
        try:
            response = self.client.chat.completions.create(
                model=self.model_name,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a medical AI assistant. Provide accurate, evidence-based medical information."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                max_tokens=1500,
                temperature=0.3,
                response_format={"type": "json_object"}
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Groq API error: {str(e)}")
            raise RuntimeError(f"LLM unavailable: {e}")

    def _parse_diagnosis_response(self, diagnosis_text: str, sources: List[Dict]) -> Dict[str, Any]:
        source_files = list(set(d['metadata'].get('filename', 'Unknown') for d in sources))
        try:
            data = json.loads(diagnosis_text)
        except json.JSONDecodeError as e:
            print(f"JSON parse failed: {e} | raw: {diagnosis_text[:300]}")
            raise RuntimeError("Malformed model response")

        return {
            "primaryDiagnosis": data.get("primaryDiagnosis", [])[:3],
            "differentialDiagnosis": data.get("differentialDiagnosis", [])[:5],
            "recommendedTests": data.get("recommendedTests", [])[:6],
            "urgencyLevel": data.get("urgencyLevel", "medium"),
            "recommendations": data.get("recommendations", [])[:5],
            "notes": data.get("notes", ""),
            "sources": source_files
        }

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