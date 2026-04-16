-- Existing patients table
CREATE TABLE IF NOT EXISTS patients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
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
CREATE TABLE IF NOT EXISTS magic_links (       
    id SERIAL PRIMARY KEY,              
    patient_id INT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,             
    token VARCHAR(255) NOT NULL UNIQUE,        
    expires_at TIMESTAMP NOT NULL,             
    used BOOLEAN DEFAULT FALSE,                
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_diagnosis_patient_id ON diagnosis_history(patient_id);
CREATE INDEX IF NOT EXISTS idx_diagnosis_created_at ON diagnosis_history(created_at);
CREATE INDEX IF NOT EXISTS idx_magic_links_token ON magic_links(token);
CREATE INDEX IF NOT EXISTS idx_magic_links_expires ON magic_links(expires_at);
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