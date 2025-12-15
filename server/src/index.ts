import express, { Request, Response } from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import axios from 'axios'; // We will need this to talk to Python later

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const pool = new Pool({
    user: process.env.POSTGRES_USER || 'admin',
    host: process.env.PGHOST || 'db', // Docker service name
    database: process.env.POSTGRES_DB || 'medcore_ai',
    password: process.env.POSTGRES_PASSWORD || 'password123',
    port: 5432,
});

// Basic Route
app.get('/', (req: Request, res: Response) => {
    res.send('MedCore Backend is Running!');
});

// AI Test Route
app.post('/ask-ai', async (req: Request, res: Response) => {
    try {
        const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://ai-service:8000';
        const response = await axios.post(`${aiServiceUrl}/analyze`, req.body);
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error connecting to AI Service');
    }
});

// --- API ROUTES ---

// 1. GET Request: Fetch all patients from the DB
app.get('/patients', async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM patients ORDER BY created_at DESC');
        res.json(result.rows); // Send the data back to React
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// 2. POST Request: Add a new patient to the DB
app.post('/patients', async (req: Request, res: Response) => {
    try {
        const { name, age, condition } = req.body; // Get data sent from React
        const newPatient = await pool.query(
            'INSERT INTO patients (name, age, condition) VALUES ($1, $2, $3) RETURNING *',
            [name, age, condition]
        );
        res.json(newPatient.rows[0]); // Send back the new patient
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});