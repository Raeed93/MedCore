-- Existing patients table
CREATE TABLE IF NOT EXISTS patients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT,
    condition VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- New table: Diagnosis History (stores all AI-generated diagnoses)
CREATE TABLE IF NOT EXISTS diagnosis_history (
    id SERIAL PRIMARY KEY,
    patient_id VARCHAR(50) NOT NULL,
    symptoms TEXT NOT NULL,
    diagnosis_result JSONB NOT NULL,  -- Stores the full AI response as JSON
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_diagnosis_patient_id ON diagnosis_history(patient_id);
CREATE INDEX IF NOT EXISTS idx_diagnosis_created_at ON diagnosis_history(created_at);

-- Sample data
INSERT INTO patients (name, age, condition) 
VALUES ('John Doe', 45, 'Flu Symptoms');

-- Add a sample diagnosis (optional)
INSERT INTO diagnosis_history (patient_id, symptoms, diagnosis_result, created_at)
VALUES (
    'P-2024-001',
    'Fever, cough, fatigue for 3 days',
    '{"primaryDiagnosis": ["Viral Upper Respiratory Infection"], "urgencyLevel": "medium"}',
    CURRENT_TIMESTAMP
);