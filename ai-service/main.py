from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

# Define the data format we expect from Node.js
class PatientInput(BaseModel):
    symptoms: str

@app.get("/")
def read_root():
    return {"status": "AI Service is Running", "library": "PyTorch/HuggingFace Ready"}

@app.post("/analyze")
def analyze_symptoms(input: PatientInput):
    # HERE is where we will eventually load the HuggingFace model
    # For now, let's return a dummy AI response
    return {
        "diagnosis_suggestion": "Based on input: " + input.symptoms,
        "recommended_scan": "MRI - Head",
        "confidence_score": 0.95
    }