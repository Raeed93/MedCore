import express, { Request, Response } from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import axios from 'axios';
import multer from 'multer';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import cookieParser from 'cookie-parser';  
import authRoutes from './routes/auth.routes'; 
import jwt from 'jsonwebtoken';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',  // Frontend URL
  credentials: true,  // (allows cookies)
}));
app.use(express.json());
app.use(cookieParser());  
app.use('/auth', authRoutes); 

// File upload configuration
const upload = multer({ dest: 'uploads/' });

// Database Connection
const pool = new Pool({
    user: process.env.POSTGRES_USER || 'admin',
    host: process.env.PGHOST || 'db',
    database: process.env.POSTGRES_DB || 'medcore_ai',
    password: process.env.POSTGRES_PASSWORD,
    port: 5432,
});

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://ai-service:8000';

// ============================================
// BASIC ROUTES
// ============================================

app.get('/', (req: Request, res: Response) => {
    res.send('Pulse AI Backend is Running! 🏥');
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
    // Get authenticated user's real ID from cookie
    const token = req.cookies?.auth_token;
    let realPatientId = req.body.patientId; // fallback

    if (token) {
      try {
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET || 'fallback-secret-change-me'
        ) as { patientId: number };
        realPatientId = decoded.patientId; // use real integer ID
      } catch {
        // token invalid, continue with form value
      }
    }

    const response = await axios.post(
      `${AI_SERVICE_URL}/diagnose-rag`,
      req.body,
      { headers: { 'Content-Type': 'application/json' }, timeout: 120000 }
    );

    await pool.query(
      `INSERT INTO diagnosis_history 
       (patient_id, symptoms, diagnosis_result, created_at) 
       VALUES ($1, $2, $3, $4)`,
      [
        String(realPatientId),
        req.body.symptoms,
        JSON.stringify(response.data),
        new Date()
      ]
    );

    res.json(response.data);
    } catch (error) {
        console.error('Error calling AI service:', error);

        const status = axios.isAxiosError(error) ? (error.response?.status ?? 503) : 500;

        res.status(status).json({
            error: 'Diagnosis unavailable',
            message: status === 503
                ? 'The analysis service is temporarily unavailable. Please try again in a moment.'
                : 'Something went wrong generating the assessment. Please try again.'
        });
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
    const token = req.cookies?.auth_token;
    if (!token) return res.status(401).json({ message: 'Not authenticated' });

    const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-me';
    const decoded = jwt.verify(token, JWT_SECRET) as { patientId: number };

    const result = await pool.query(
    `SELECT id, patient_id, symptoms, diagnosis_result, created_at
    FROM diagnosis_history
    WHERE patient_id = $1::text
    ORDER BY created_at DESC
    LIMIT 50`,
    [String(decoded.patientId)]
    );

    // Parse the JSON stored in diagnosis_result
    const rows = result.rows.map(row => ({
      ...row,
      diagnosis_result: typeof row.diagnosis_result === 'string'
        ? JSON.parse(row.diagnosis_result)
        : row.diagnosis_result,
    }));

    res.json({ success: true, history: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🤖 AI Service URL: ${AI_SERVICE_URL}`);
});