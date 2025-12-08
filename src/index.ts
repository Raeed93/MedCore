import express, { Request, Response } from 'express';
import cors from 'cors';
import { Pool } from 'pg';

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const pool = new Pool({
    user: 'admin',
    host: 'localhost',
    database: 'hospital_ai',
    password: 'password123',
    port: 5432,
});

// Basic Route
app.get('/', (req: Request, res: Response) => {
    res.send('Hospital AI Backend is Running!');
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});