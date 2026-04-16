import { Router, Request, Response } from 'express';
import { requestMagicLink, verifyMagicLink } from '../services/auth.service';

const router = Router();

/**
 * ENDPOINT 1: Send Magic Link
 * 
 * POST /auth/send-magic-link
 * Body: { "email": "doctor@hospital.com" }
 * 
 * What happens:
 * 1. Validate email format
 * 2. Call requestMagicLink() service
 * 3. Service generates token, saves to DB, sends email
 * 4. Return success message
 */
router.post('/send-magic-link', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
      });
    }

    console.log(`📧 Magic link requested for: ${email}`);

    await requestMagicLink(email);

    return res.status(200).json({
      success: true,
      message: 'Magic link sent! Check your email.',
    });

  } catch (error: any) {
    console.error('❌ Error in /send-magic-link:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to send magic link. Please try again.',
    });
  }
});

/**
 * ENDPOINT 2: Verify Token & Login
 * 
 * GET /auth/verify?token=abc123xyz
 * 
 * What happens:
 * 1. Extract token from query params
 * 2. Call verifyMagicLink() service
 * 3. Service validates token, creates JWT
 * 4. Set JWT as httpOnly cookie
 * 5. Return user data
 */
router.get('/verify', async (req: Request, res: Response) => {
  try {
    const { token } = req.query;

    // Validation: Check if token provided
    if (!token || typeof token !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Token is required',
      });
    }

    console.log(`🔐 Verifying token: ${token.substring(0, 8)}...`);

    // Call service to verify token and create JWT
    const { jwt, patient } = await verifyMagicLink(token);

    // Set JWT as httpOnly cookie (secure!)
    res.cookie('auth_token', jwt, {
      httpOnly: true,        // Cannot be accessed by JavaScript
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'lax',       // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });

    console.log(`✅ User logged in: ${patient.email}`);

    // Success response with user data
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: patient.id,
        email: patient.email,
        name: patient.name,
      },
    });

  } catch (error: any) {
    console.error('❌ Error in /verify:', error);

    // Send specific error messages
    const message = error.message || 'Token verification failed';
    return res.status(400).json({
      success: false,
      message,
    });
  }
});

/**
 * ENDPOINT 3: Logout
 * 
 * POST /auth/logout
 * 
 * What happens:
 * 1. Clear the auth_token cookie
 * 2. Return success message
 */
router.post('/logout', (req: Request, res: Response) => {
  // Clear the cookie
  res.clearCookie('auth_token');

  console.log('✅ User logged out');

  return res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

/**
 * ENDPOINT 4: Get Current User
 * 
 * GET /auth/me
 * 
 * What happens:
 * 1. Read JWT from cookie
 * 2. Verify JWT (we'll add middleware later)
 * 3. Return user data
 * 
 * This endpoint will be protected by middleware
 */
router.get('/me', async (req: Request, res: Response) => {
  // We'll implement this after creating the middleware
  // For now, just return a placeholder
  return res.status(200).json({
    success: true,
    message: 'This endpoint will return current user after middleware is added',
  });
});

export default router;