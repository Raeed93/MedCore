import * as Sentry from '@sentry/node';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import axios from 'axios';
import multer from 'multer';
import FormData from 'form-data';
import fs from 'fs';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes';
import { requireAuth } from './middleware/auth.middleware';
import './instrument';


Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.2,
  sendDefaultPii: false,
  beforeSend(event) {
    if (event.request) {
      delete event.request.data;
      delete event.request.cookies;
      delete event.request.headers;
    }
    return event;
  },
});

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// STARTUP CONFIG CHECKS
// ============================================
// Fail fast and loudly. A silent fallback in production is worse than a crash:
// the app keeps serving requests while being subtly wrong, which is exactly how
// the CORS_ORIGIN and POSTGRES_DB problems stayed hidden.

if (process.env.NODE_ENV === 'production') {
  const required = ['JWT_SECRET', 'CORS_ORIGIN', 'FRONTEND_URL', 'POSTGRES_PASSWORD'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }
}

// ============================================
// MIDDLEWARE
// ============================================

// CORS_ORIGIN accepts a comma-separated list so dev and prod no longer fight
// over a single value. Note this is an allowlist, not a wildcard — with
// credentials enabled, the spec forbids "Access-Control-Allow-Origin: *".
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Requests with no Origin header (curl, health checks, server-to-server)
    // are not browser requests, so CORS does not apply to them.
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);

    console.warn(`⚠️  Blocked CORS request from origin: ${origin}`);
    return callback(new Error('Origin not allowed'));
  },
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use('/auth', authRoutes);

// File upload configuration
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB per file
});

// ============================================
// DATABASE
// ============================================

const pool = new Pool({
  user: process.env.POSTGRES_USER || 'admin',
  host: process.env.PGHOST || 'db',
  database: process.env.POSTGRES_DB || 'medcore_ai',
  password: process.env.POSTGRES_PASSWORD || 'password123',
  port: 5432,
});

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://ai-service:8000';

// Only expose internal error details outside production.
const isDev = process.env.NODE_ENV !== 'production';
const detail = (error: unknown) =>
  isDev ? (error instanceof Error ? error.message : String(error)) : undefined;

// ============================================
// PUBLIC ROUTES
// ============================================
// Everything below this section requires authentication. These three do not:
// "/" and "/health" are monitoring targets (UptimeRobot polls /health), and
// /auth/* is how a caller obtains a token in the first place.

app.get('/', (_req: Request, res: Response) => {
  res.send('MedCore Backend is Running! 🏥');
});

app.get('/health', async (_req: Request, res: Response) => {
  try {
    await pool.query('SELECT 1');
    const aiHealth = await axios.get(`${AI_SERVICE_URL}/health`);

    res.json({
      status: 'healthy',
      database: 'connected',
      ai_service: aiHealth.data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Health check failed:', error);
    res.status(500).json({
      status: 'unhealthy',
      error: detail(error),
    });
  }
});

// ============================================
// ADMIN / DEBUG ROUTES
// ============================================

/**
 * Lists registered users.
 *
 * This was previously unauthenticated and ran `SELECT *`, which returned every
 * user's email, location, hospital and licence number to any caller. It is now
 * authenticated, column-limited, and disabled in production.
 *
 * There is no legitimate consumer-product use for "list all users" — nothing in
 * the client calls this. Delete it once you no longer need it for local
 * debugging. A debug route that survives to production is how the original bug
 * happened.
 */
app.get('/patients', requireAuth, async (_req: Request, res: Response) => {
  if (!isDev) {
    return res.status(404).json({ message: 'Not found' });
  }

  try {
    const result = await pool.query(
      'SELECT id, name, email, created_at FROM patients ORDER BY created_at DESC LIMIT 100'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('❌ GET /patients failed:', error);
    res.status(500).json({ error: 'Server error', message: detail(error) });
  }
});

// ============================================
// AI DIAGNOSIS ROUTES
// ============================================

/**
 * Generate a symptom assessment via the RAG service.
 *
 * Identity comes from the verified token only. The previous implementation fell
 * back to `req.body.patientId` when the token was missing or invalid, which
 * meant an unauthenticated caller could write records under any patient_id and
 * consume LLM inference for free.
 */
app.post('/diagnose', requireAuth, async (req: Request, res: Response) => {
  try {
    const patientId = req.user!.patientId;

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
        String(patientId),
        req.body.symptoms,
        JSON.stringify(response.data),
        new Date(),
      ]
    );

    res.json(response.data);
  } catch (error) {
    console.error('❌ POST /diagnose failed:', error);

    if (axios.isAxiosError(error)) {
      res.status(error.response?.status || 500).json({
        error: 'AI service error',
        message: error.response?.data?.detail || error.message,
      });
    } else {
      res.status(500).json({ error: 'Server error', message: detail(error) });
    }
  }
});

// Legacy passthrough to the AI service. Authenticated to stop anonymous callers
// burning inference quota. Remove once nothing depends on it.
app.post('/ask-ai', requireAuth, async (req: Request, res: Response) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/analyze`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('❌ POST /ask-ai failed:', error);
    res.status(500).json({ error: 'Error connecting to AI Service', message: detail(error) });
  }
});

// ============================================
// DOCUMENT MANAGEMENT ROUTES (RAG)
// ============================================

/**
 * Upload documents into the RAG corpus.
 *
 * NOTE the middleware order: requireAuth runs BEFORE upload.array(), so multer
 * never writes a file to disk for an unauthenticated caller.
 *
 * Authentication is the floor here, not the ceiling. Any registered user can
 * currently add documents that the RAG engine will retrieve and cite as medical
 * sources — corpus poisoning. Once the `role` column exists, gate this on
 * role = 'admin'.
 */
app.post(
  '/upload-documents',
  requireAuth,
  upload.array('documents', 10),
  async (req: Request, res: Response) => {
    const files = Array.isArray(req.files) ? req.files : [];

    try {
      if (files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
      }

      const formData = new FormData();
      for (const file of files) {
        formData.append('files', fs.createReadStream(file.path), {
          filename: file.originalname,
          contentType: file.mimetype,
        });
      }

      const response = await axios.post(
        `${AI_SERVICE_URL}/upload-documents`,
        formData,
        {
          headers: formData.getHeaders(),
          timeout: 300000, // 5 minutes for large files
        }
      );

      res.json(response.data);
    } catch (error) {
      console.error('❌ POST /upload-documents failed:', error);
      res.status(500).json({ error: 'Upload failed', message: detail(error) });
    } finally {
      // Previously this only ran on success, so a failed upload left temp files
      // behind indefinitely.
      for (const file of files) {
        fs.promises.unlink(file.path).catch(() => { /* already gone */ });
      }
    }
  }
);

app.get('/documents', requireAuth, async (_req: Request, res: Response) => {
  try {
    const response = await axios.get(`${AI_SERVICE_URL}/documents`);
    res.json(response.data);
  } catch (error) {
    console.error('❌ GET /documents failed:', error);
    res.status(500).json({ error: 'Failed to fetch documents', message: detail(error) });
  }
});

app.delete('/documents/:documentId', requireAuth, async (req: Request, res: Response) => {
  try {
    const { documentId } = req.params;
    const response = await axios.delete(
      `${AI_SERVICE_URL}/documents/${encodeURIComponent(documentId)}`
    );
    res.json(response.data);
  } catch (error) {
    console.error('❌ DELETE /documents failed:', error);
    res.status(500).json({ error: 'Failed to delete document', message: detail(error) });
  }
});

// ============================================
// DIAGNOSIS HISTORY ROUTES
// ============================================

// REMOVED: app.get('/diagnosis-history/:patientId', ...)
//
// That route took an identity from the URL and returned that identity's private
// symptom history, with no authentication — an Insecure Direct Object
// Reference. Anyone could read any user's health records by iterating integers.
//
// It is deleted rather than patched because the authenticated route below
// already does the job, and nothing in the client called it.

app.get('/diagnosis-history', requireAuth, async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT id, patient_id, symptoms, diagnosis_result, created_at
       FROM diagnosis_history
       WHERE patient_id = $1::text
       ORDER BY created_at DESC
       LIMIT 50`,
      [String(req.user!.patientId)]
    );

    const rows = result.rows.map(row => ({
      ...row,
      diagnosis_result: typeof row.diagnosis_result === 'string'
        ? JSON.parse(row.diagnosis_result)
        : row.diagnosis_result,
    }));

    res.json({ success: true, history: rows });
  } catch (error) {
    console.error('❌ GET /diagnosis-history failed:', error);
    res.status(500).json({ message: 'Server Error', detail: detail(error) });
  }
});


// ============================================
// START SERVER
// ============================================


app.get('/debug-sentry', () => {
  throw new Error('Sentry test error');
});

app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: 'Not found' });
});

Sentry.setupExpressErrorHandler(app);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err.message === 'Origin not allowed') {
    return res.status(403).json({ message: 'Origin not allowed' });
  }
  console.error('❌ Unhandled error:', err);
  res.status(500).json({ message: 'Server error', detail: detail(err) });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🤖 AI Service URL: ${AI_SERVICE_URL}`);
  console.log(`🔒 Allowed origins: ${allowedOrigins.join(', ')}`);
});
