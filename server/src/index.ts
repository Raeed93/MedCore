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

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});