import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import { Patient, MagicLink, JWTPayload } from '../types/auth.types';
import { sendMagicLinkEmail } from './email.service';

// Database connection
const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: parseInt(process.env.PGPORT || '5432'),
  database: process.env.POSTGRES_DB || 'medcore_ai',
  user: process.env.POSTGRES_USER || 'admin',
  password: process.env.POSTGRES_PASSWORD || 'password123',
});

/**
 * FUNCTION 1: Request Magic Link
 * 
 * What it does:
 * 1. Check if email exists in patients table
 * 2. If not, create new patient
 * 3. Generate random token
 * 4. Save token to magic_links table (expires in 15 min)
 * 5. Send email with magic link
 * 
 * @param email - User's email address
 */
export async function requestMagicLink(email: string): Promise<void> {
  try {
    // Step 1: Check if patient exists
    let patient = await pool.query<Patient>(
      'SELECT * FROM patients WHERE email = $1',
      [email]
    );

    let patientId: number;

    if (patient.rows.length === 0) {
      // Step 2: Create new patient if doesn't exist
      const newPatient = await pool.query<Patient>(
        'INSERT INTO patients (email, name) VALUES ($1, $2) RETURNING *',
        [email, email.split('@')[0]] // Use email prefix as default name
      );
      patientId = newPatient.rows[0].id;
      console.log(`✅ New patient created: ${email}`);
    } else {
      patientId = patient.rows[0].id;
      console.log(`✅ Existing patient found: ${email}`);
    }

    // Step 3: Generate random token
    const token = uuidv4(); // e.g., "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
    
    // Step 4: Calculate expiration (15 minutes from now)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    // Step 5: Save token to database
    await pool.query(
      `INSERT INTO magic_links (patient_id, token, expires_at) 
       VALUES ($1, $2, $3)`,
      [patientId, token, expiresAt]
    );

    console.log(`✅ Magic link token generated for patient ${patientId}`);

    // Step 6: Send email
    await sendMagicLinkEmail(email, token);

    console.log(`✅ Magic link sent to ${email}`);
  } catch (error) {
    console.error('❌ Error in requestMagicLink:', error);
    throw new Error('Failed to send magic link');
  }
}

/**
 * FUNCTION 2: Verify Magic Link Token
 * 
 * What it does:
 * 1. Find token in database
 * 2. Check if expired or already used
 * 3. Get patient data
 * 4. Mark token as used
 * 5. Create JWT
 * 
 * @param token - Magic link token from URL
 * @returns JWT token and patient data
 */
export async function verifyMagicLink(token: string): Promise<{
  jwt: string;
  patient: Patient;
}> {
  try {
    // Step 1: Find token in database
    const result = await pool.query<MagicLink>(
      `SELECT * FROM magic_links WHERE token = $1`,
      [token]
    );

    if (result.rows.length === 0) {
      throw new Error('Invalid token');
    }

    const magicLink = result.rows[0];

    // Step 2: Check if token is already used
    if (magicLink.used) {
      throw new Error('Token already used');
    }

    // Step 3: Check if token is expired
    const now = new Date();
    const expiresAt = new Date(magicLink.expires_at);

    if (now > expiresAt) {
      throw new Error('Token expired');
    }

    // Step 4: Get patient data
    const patientResult = await pool.query<Patient>(
      'SELECT * FROM patients WHERE id = $1',
      [magicLink.patient_id]
    );

    if (patientResult.rows.length === 0) {
      throw new Error('Patient not found');
    }

    const patient = patientResult.rows[0];

    // Step 5: Mark token as used
    await pool.query(
      'UPDATE magic_links SET used = true WHERE id = $1',
      [magicLink.id]
    );

    console.log(`✅ Magic link verified for patient ${patient.id}`);

    // Step 6: Create JWT
    const jwtPayload: JWTPayload = {
      patientId: patient.id,
      email: patient.email,
      name: patient.name || '',
    };

    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-change-me';
    const jwtToken = jwt.sign(jwtPayload, jwtSecret, {
      expiresIn: '7d', // JWT valid for 7 days
    });

    console.log(`✅ JWT created for patient ${patient.id}`);

    return {
      jwt: jwtToken,
      patient,
    };
  } catch (error) {
    console.error('❌ Error in verifyMagicLink:', error);
    throw error;
  }
}

/**
 * FUNCTION 3: Verify JWT Token
 * 
 * What it does:
 * 1. Decode JWT
 * 2. Verify signature
 * 3. Check expiration
 * 4. Return patient data
 * 
 * @param token - JWT token from cookie
 * @returns Patient data from JWT
 */
export async function verifyJWT(token: string): Promise<JWTPayload> {
  try {
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-change-me';
    const decoded = jwt.verify(token, jwtSecret) as JWTPayload;
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}