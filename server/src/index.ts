import express, { Request, Response } from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import axios from 'axios';
import multer from 'multer';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// File upload configuration
const upload = multer({ dest: 'uploads/' });

// Database Connection
const pool = new Pool({
    user: process.env.POSTGRES_USER || 'admin',
    host: process.env.PGHOST || 'db',
    database: process.env.POSTGRES_DB || 'medcore_ai',
    password: process.env.POSTGRES_PASSWORD || 'password123',
    port: 5432,
});

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://ai-service:8000';

// ============================================
// BASIC ROUTES
// ============================================

app.get('/', (req: Request, res: Response) => {
    res.send('MedCore Backend is Running! 🏥');
});

app.get('/health', async (req: Request, res: Response) => {
    try {
        // Check database connection
        await pool.query('SELECT 1');
        
        // Check AI service
        const aiHealth = await axios.get(`${AI_SERVICE_URL}/health`);
        
        res.json({
            status: 'healthy',
            database: 'connected',
            ai_service: aiHealth.data,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            status: 'unhealthy',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// ============================================
// PATIENT MANAGEMENT ROUTES
// ============================================

// Get all patients
app.get('/patients', async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM patients ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Add new patient
app.post('/patients', async (req: Request, res: Response) => {
    try {
        const { name, age, condition } = req.body;
        const newPatient = await pool.query(
            'INSERT INTO patients (name, age, condition) VALUES ($1, $2, $3) RETURNING *',
            [name, age, condition]
        );
        res.json(newPatient.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// ============================================
// AI DIAGNOSIS ROUTES
// ============================================

// Generate diagnosis using RAG
app.post('/diagnose', async (req: Request, res: Response) => {
    try {
        console.log('Diagnosis request received:', req.body);
        
        const response = await axios.post(
            `${AI_SERVICE_URL}/diagnose-rag`,
            req.body,
            {
                headers: { 'Content-Type': 'application/json' },
                timeout: 120000 // 2 minute timeout for AI processing
            }
        );
        
        // Save diagnosis to database
        const diagnosisData = {
            patient_id: req.body.patientId,
            symptoms: req.body.symptoms,
            diagnosis_result: JSON.stringify(response.data),
            created_at: new Date()
        };
        
        await pool.query(
            `INSERT INTO diagnosis_history 
            (patient_id, symptoms, diagnosis_result, created_at) 
            VALUES ($1, $2, $3, $4)`,
            [diagnosisData.patient_id, diagnosisData.symptoms, diagnosisData.diagnosis_result, diagnosisData.created_at]
        );
        
        res.json(response.data);
    } catch (error) {
        console.error('Error calling AI service:', error);
        
        if (axios.isAxiosError(error)) {
            res.status(error.response?.status || 500).json({
                error: 'AI service error',
                message: error.response?.data?.detail || error.message
            });
        } else {
            res.status(500).json({
                error: 'Server error',
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
});

// Legacy endpoint (backward compatibility)
app.post('/ask-ai', async (req: Request, res: Response) => {
    try {
        const response = await axios.post(`${AI_SERVICE_URL}/analyze`, req.body);
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error connecting to AI Service');
    }
});

// ============================================
// DOCUMENT MANAGEMENT ROUTES (RAG)
// ============================================

// Upload medical documents to RAG system
app.post('/upload-documents', upload.array('documents', 10), async (req: Request, res: Response) => {
    try {
        if (!req.files || !Array.isArray(req.files)) {
            return res.status(400).json({ error: 'No files uploaded' });
        }
        
        const formData = new FormData();
        
        // Append each file to FormData
        for (const file of req.files) {
            formData.append('files', fs.createReadStream(file.path), {
                filename: file.originalname,
                contentType: file.mimetype
            });
        }
        
        // Send to AI service
        const response = await axios.post(
            `${AI_SERVICE_URL}/upload-documents`,
            formData,
            {
                headers: formData.getHeaders(),
                timeout: 300000 // 5 minute timeout for large files
            }
        );
        
        // Clean up temporary files
        for (const file of req.files) {
            fs.unlinkSync(file.path);
        }
        
        res.json(response.data);
    } catch (error) {
        console.error('Error uploading documents:', error);
        res.status(500).json({
            error: 'Upload failed',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// List all indexed documents
app.get('/documents', async (req: Request, res: Response) => {
    try {
        const response = await axios.get(`${AI_SERVICE_URL}/documents`);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).json({
            error: 'Failed to fetch documents',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// Delete a document from RAG system
app.delete('/documents/:documentId', async (req: Request, res: Response) => {
    try {
        const { documentId } = req.params;
        const response = await axios.delete(`${AI_SERVICE_URL}/documents/${documentId}`);
        res.json(response.data);
    } catch (error) {
        console.error('Error deleting document:', error);
        res.status(500).json({
            error: 'Failed to delete document',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// ============================================
// DIAGNOSIS HISTORY ROUTES
// ============================================

// Get diagnosis history for a patient
app.get('/diagnosis-history/:patientId', async (req: Request, res: Response) => {
    try {
        const { patientId } = req.params;
        const result = await pool.query(
            'SELECT * FROM diagnosis_history WHERE patient_id = $1 ORDER BY created_at DESC',
            [patientId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Get all diagnosis history
app.get('/diagnosis-history', async (req: Request, res: Response) => {
    try {
        const result = await pool.query(
            'SELECT * FROM diagnosis_history ORDER BY created_at DESC LIMIT 100'
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// ============================================
// START SERVER
// ============================================

app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
    console.log(`🤖 AI Service URL: ${AI_SERVICE_URL}`);
});