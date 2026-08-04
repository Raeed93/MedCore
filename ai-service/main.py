from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv

# Import our custom RAG components
from rag_engine import RAGEngine
from document_processor import DocumentProcessor

# Load environment variables
load_dotenv()

app = FastAPI(title="MedCore AI Service")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your client URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize RAG Engine and Document Processor
groq_api_key = os.getenv("GROQ_API_KEY")
if not groq_api_key:
    raise RuntimeError("GROQ_API_KEY is not set. Check your .env file.")

rag_engine = RAGEngine(
    groq_api_key=groq_api_key,
    model_name=os.getenv("GROQ_MODEL", "llama3-70b-8192")
)
doc_processor = DocumentProcessor()

# ============================================
# PYDANTIC MODELS (Request/Response Schemas)
# ============================================

class PatientInput(BaseModel):
    """Input data from patient form"""
    patientId: str
    age: int
    gender: str
    symptoms: str
    duration: str
    history: str

class DiagnosisResponse(BaseModel):
    """AI-generated diagnosis response"""
    primaryDiagnosis: List[str]
    differentialDiagnosis: List[str]
    recommendedTests: List[str]
    urgencyLevel: str
    recommendations: List[str]
    notes: str
    sources: List[str]  # Which medical documents were used

# ============================================
# API ENDPOINTS
# Think of endpoints as different buttons you can press to make the AI service do different things.
# ============================================

# Just checks if the AI service is alive.
@app.get("/")
def read_root():
    """Health check endpoint"""
    return {
        "status": "AI Service is Running",
        "model": os.getenv("GROQ_MODEL", "llama3-70b-8192"),
        "rag_enabled": True,
        "documents_indexed": rag_engine.get_document_count()
    }

# is this endpoint where i upload my documents to the rag system
@app.post("/upload-documents", status_code=201)
async def upload_medical_documents(files: List[UploadFile] = File(...)):
    """
    Upload medical documents (PDFs, DOCX) to the RAG system.
    These will be indexed and used as knowledge base for diagnosis.
    
    Example: Clinical guidelines, medical textbooks, hospital protocols
    """
    try:
        uploaded_files = []
        
        for file in files:
            # Save file temporarily
            file_path = f"/tmp/{file.filename}"
            with open(file_path, "wb") as f:
                content = await file.read()
                f.write(content)
            
            # Process and index the document
            doc_info = doc_processor.process_document(file_path, file.filename)
            chunks = doc_processor.extract_chunks(file_path)
            
            # Add to vector database
            rag_engine.add_documents(chunks, doc_info)
            
            uploaded_files.append({
                "filename": file.filename,
                "pages": doc_info.get("pages", "N/A"),
                "chunks_created": len(chunks)
            })
            
            # Clean up temp file
            os.remove(file_path)
        
        return {
            "status": "success",
            "message": f"Successfully uploaded and indexed {len(files)} document(s)",
            "files": uploaded_files,
            "total_documents": rag_engine.get_document_count()
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing documents: {str(e)}")

# this endpoint takes my initial symptoms, searches the uploaded documents, sends patients data + relevant documents to BioMistral AI and gets back a diagnosis

@app.post("/diagnose-rag", response_model=DiagnosisResponse)
async def diagnose_with_rag(patient: PatientInput):
    """
    Generate diagnosis using RAG system.
    
    Process:
    1. Search medical documents for relevant information
    2. Send context + patient data to BioMistral via HuggingFace API
    3. Generate diagnosis with citations
    """
    try:
        # Build the query from patient information
        query = f"""
        Patient Information:
        - Age: {patient.age}
        - Gender: {patient.gender}
        - Symptoms: {patient.symptoms}
        - Duration: {patient.duration}
        - Medical History: {patient.history}
        
        Provide a differential diagnosis with recommended tests and urgency level.
        """
        
        # Get relevant context from medical documents
        relevant_docs = rag_engine.retrieve_relevant_context(query, top_k=5)
        
        # Generate diagnosis using HuggingFace API + RAG context
        diagnosis = rag_engine.generate_diagnosis(
            patient_data=patient.dict(),
            context_docs=relevant_docs
        )
        
        return diagnosis
    
    except Exception as e:
        print(f"Diagnosis generation failed: {e}")
        raise HTTPException(
            status_code=503,
            detail="The analysis service is temporarily unavailable. Please try again in a moment."
        )
@app.post("/analyze")
async def analyze_symptoms(input: PatientInput):
    """
    Legacy endpoint - kept for backward compatibility.
    Redirects to RAG-based diagnosis.
    """
    return await diagnose_with_rag(input)

# shows you all the medical documents listed in chromeDB
@app.get("/documents")
def list_documents():
    """List all indexed medical documents in the system"""
    try:
        docs = rag_engine.list_indexed_documents()
        return {
            "total_documents": len(docs),
            "documents": docs
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing documents: {str(e)}")

@app.delete("/documents/{document_id}")
def delete_document(document_id: str):
    """Delete a specific document from the RAG system"""
    try:
        success = rag_engine.delete_document(document_id)
        if success:
            return {"status": "success", "message": f"Document {document_id} deleted"}
        else:
            raise HTTPException(status_code=404, detail="Document not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting document: {str(e)}")

@app.get("/health")
def health_check():
    """Detailed health check with system status"""
    return {
        "service": "healthy",
        "groq_api_key_configured": bool(os.getenv("GROQ_API_KEY")),
        "chroma_db_status": "connected",
        "total_documents": rag_engine.get_document_count(),
        "model": os.getenv("GROQ_MODEL")
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)