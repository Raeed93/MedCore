📄 Understanding main.py - The AI Service API
Think of main.py as a restaurant menu. It lists all the things you can ask the AI service to do.

🎯 Part 1: PYDANTIC MODELS (Request/Response Schemas)
What are Pydantic Models?
Pydantic models are like forms with rules. They define:

What data you must send (required fields)
What type each field should be (string, number, list, etc.)
What data you'll get back (response structure)

Think of it like ordering food:

Menu (Pydantic Model) says: "Pizza must have size (string) and toppings (list)"
You order: "Large pizza with pepperoni and mushrooms"
Restaurant validates: ✅ "Large" is a valid size, ✅ toppings are a list
You receive: A structured pizza order receipt


Model 1: PatientInput
pythonclass PatientInput(BaseModel):
    """Input data from patient form"""
    patientId: str
    age: int
    gender: str
    symptoms: str
    duration: str
    history: str
What it does:
This defines what the React frontend must send when requesting a diagnosis.
Example JSON the frontend sends:
json{
  "patientId": "P-2024-001",
  "age": 45,
  "gender": "Male",
  "symptoms": "Persistent dry cough, fever 38.5°C",
  "duration": "2 weeks",
  "history": "Non-smoker, no chronic diseases"
}
Why we need this:

✅ Validation: FastAPI automatically checks if age is a number, not text
✅ Auto-documentation: FastAPI generates API docs showing required fields
✅ Type safety: Prevents bugs from wrong data types


Model 2: DiagnosisResponse
pythonclass DiagnosisResponse(BaseModel):
    """AI-generated diagnosis response"""
    primaryDiagnosis: List[str]
    differentialDiagnosis: List[str]
    recommendedTests: List[str]
    urgencyLevel: str
    recommendations: List[str]
    notes: str
    sources: List[str]  # Which medical documents were used
What it does:
This defines the structure of what the AI service sends back to the frontend.
Example JSON the AI returns:
json{
  "primaryDiagnosis": [
    "Viral Upper Respiratory Infection",
    "Early onset Pneumonia"
  ],
  "differentialDiagnosis": [
    "Influenza A",
    "Acute Bronchitis",
    "COVID-19"
  ],
  "recommendedTests": [
    "Chest X-Ray",
    "CBC Blood Panel",
    "PCR Swab"
  ],
  "urgencyLevel": "medium",
  "recommendations": [
    "Prescribe rest and hydration",
    "Monitor temperature daily"
  ],
  "notes": "Patient shows signs of dehydration",
  "sources": [
    "Clinical_Guidelines_Respiratory.pdf",
    "WHO_Pneumonia_Protocol.pdf"
  ]
}
Why we need this:

✅ React knows exactly what fields to expect
✅ Consistent response format
✅ TypeScript can validate the response


🎯 Part 2: API ENDPOINTS EXPLAINED
Think of endpoints as different buttons you can press to make the AI service do different things.

Endpoint 1: / - Health Check
python@app.get("/")
def read_root():
    return {
        "status": "AI Service is Running",
        "model": "meta-llama/Llama-3.1-8B-Instruct",
        "rag_enabled": True,
        "documents_indexed": rag_engine.get_document_count()
    }
What it does:
Just checks if the AI service is alive.
How to use it:
bashcurl http://localhost:8000/
Response:
json{
  "status": "AI Service is Running",
  "model": "meta-llama/Llama-3.1-8B-Instruct",
  "rag_enabled": true,
  "documents_indexed": 5
}
Real-world analogy:
Like knocking on a door to see if anyone's home.

Endpoint 2: /upload-documents - Upload Medical PDFs
python@app.post("/upload-documents", status_code=201)
async def upload_medical_documents(files: List[UploadFile] = File(...)):
```

**What it does:**
This is THE MOST IMPORTANT endpoint for RAG! It:
1. Accepts PDF/DOCX files
2. Extracts text from them
3. Splits text into chunks (like 1000-character pieces)
4. Creates **embeddings** (converts text to numbers/vectors)
5. Stores them in **ChromaDB** (vector database)

**How it works step-by-step:**
```
User uploads: "Clinical_Pneumonia_Guidelines.pdf" (50 pages)
         ↓
Step 1: Save file temporarily to /tmp/
         ↓
Step 2: Extract text from all 50 pages
         ↓
Step 3: Split into chunks:
        - Chunk 1: "Pneumonia is an infection..."
        - Chunk 2: "Symptoms include fever, cough..."
        - Chunk 3: "Recommended tests: Chest X-ray..."
        (Creates ~80 chunks from 50 pages)
         ↓
Step 4: Convert each chunk to embeddings (vectors):
        - "Pneumonia is an infection..." → [0.23, 0.91, -0.45, ...]
        - "Symptoms include fever..." → [0.67, -0.12, 0.88, ...]
         ↓
Step 5: Store in ChromaDB with metadata:
        {
          "text": "Pneumonia is an infection...",
          "filename": "Clinical_Pneumonia_Guidelines.pdf",
          "page": 5,
          "embedding": [0.23, 0.91, -0.45, ...]
        }
         ↓
Done! Now this knowledge is searchable!
How to use it:
bashcurl -X POST http://localhost:8000/upload-documents \
  -F "files=@./Pneumonia_Guidelines.pdf" \
  -F "files=@./Diabetes_Protocol.pdf"
Response:
json{
  "status": "success",
  "message": "Successfully uploaded and indexed 2 document(s)",
  "files": [
    {
      "filename": "Pneumonia_Guidelines.pdf",
      "pages": 50,
      "chunks_created": 80
    },
    {
      "filename": "Diabetes_Protocol.pdf",
      "pages": 30,
      "chunks_created": 45
    }
  ],
  "total_documents": 2
}
Real-world analogy:
Like putting books in a library and creating an index card system so you can find relevant sections later.

Endpoint 3: /diagnose-rag - Generate AI Diagnosis ⭐
python@app.post("/diagnose-rag", response_model=DiagnosisResponse)
async def diagnose_with_rag(patient: PatientInput):
```

**What it does:**
This is where the **magic happens**! It:
1. Takes patient symptoms
2. Searches your uploaded medical documents for relevant info
3. Sends patient data + relevant documents to BioMistral AI
4. Gets back a diagnosis
5. Returns structured results

**The RAG Process:**
```
User sends: {
  "age": 45,
  "symptoms": "Dry cough, fever 38.5°C, shortness of breath"
}
         ↓
Step 1: Build search query:
        "Age: 45, Symptoms: Dry cough, fever, shortness of breath..."
         ↓
Step 2: Search ChromaDB (vector database):
        Query embedding: [0.45, 0.23, -0.67, ...]
        
        Find similar chunks:
        ✅ "Pneumonia symptoms include dry cough..." (95% match)
        ✅ "Fever above 38°C indicates infection..." (92% match)
        ✅ "Shortness of breath requires chest X-ray..." (89% match)
        ❌ "Diabetes management protocol..." (12% match - ignored)
         ↓
Step 3: Build prompt for BioMistral:
        
        MEDICAL CONTEXT:
        From: Clinical_Pneumonia_Guidelines.pdf
        "Pneumonia symptoms include dry cough, fever..."
        
        From: WHO_Respiratory_Infections.pdf
        "Fever above 38°C indicates bacterial infection..."
        
        PATIENT INFO:
        Age: 45, Symptoms: Dry cough, fever, shortness of breath
        
        TASK:
        Provide differential diagnosis and recommended tests.
         ↓
Step 4: Send to HuggingFace BioMistral API
         ↓
Step 5: BioMistral analyzes and returns:
        "PRIMARY DIAGNOSIS: Pneumonia
         TESTS: Chest X-ray, CBC Blood Panel
         URGENCY: High"
         ↓
Step 6: Parse response into structured JSON
         ↓
Step 7: Return to frontend with sources cited
Response:
json{
  "primaryDiagnosis": ["Community-Acquired Pneumonia"],
  "differentialDiagnosis": ["Bronchitis", "COVID-19"],
  "recommendedTests": ["Chest X-ray", "CBC", "CRP"],
  "urgencyLevel": "high",
  "recommendations": ["Start antibiotics", "Monitor oxygen"],
  "notes": "Fever indicates bacterial infection",
  "sources": [
    "Clinical_Pneumonia_Guidelines.pdf",
    "WHO_Respiratory_Infections.pdf"
  ]
}
Real-world analogy:
Like a doctor who:

Hears your symptoms
Looks up relevant medical textbooks
Combines book knowledge with your case
Gives you a diagnosis with citations


Endpoint 4: /documents - List Uploaded Documents
python@app.get("/documents")
def list_documents():
What it does:
Shows you all the medical documents currently indexed in ChromaDB.
Response:
json{
  "total_documents": 3,
  "documents": [
    {
      "filename": "Pneumonia_Guidelines.pdf",
      "upload_date": "2024-02-15T10:30:00",
      "chunks": 80
    },
    {
      "filename": "Diabetes_Protocol.pdf",
      "upload_date": "2024-02-15T10:35:00",
      "chunks": 45
    }
  ]
}

Endpoint 5: /documents/{document_id} - Delete Document
python@app.delete("/documents/{document_id}")
def delete_document(document_id: str):
What it does:
Removes a document and all its chunks from ChromaDB.
Example:
bashcurl -X DELETE http://localhost:8000/documents/Pneumonia_Guidelines.pdf
```

---

## 🎯 Summary: The Flow
```
1. Upload Documents → Store in ChromaDB (knowledge base)
                              ↓
2. Patient fills form → Send to /diagnose-rag
                              ↓
3. Search ChromaDB → Find relevant medical info
                              ↓
4. Combine with patient data → Send to BioMistral
                              ↓
5. Get AI diagnosis → Return with sources cited