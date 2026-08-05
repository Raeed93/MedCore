import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

/**
 * Auth middleware.
 *
 * Verifies the httpOnly `auth_token` cookie and attaches the decoded payload
 * to `req.user`. Routes downstream read identity from `req.user` and NEVER
 * from the request body or params — that is the whole point. A client-supplied
 * ID is an assertion, not a fact.
 */

export interface AuthPayload {
  patientId: number;
  email: string;
  name: string;
}

// Augment Express's Request type so `req.user` is typed everywhere.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

function getSecret(): string {
  const secret = process.env.JWT_SECRET;

  // Fail loudly rather than silently signing with a known default. A fallback
  // secret in production means anyone who has read this repo can mint valid
  // tokens for any user.
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET must be set in production');
    }
    console.warn('⚠️  JWT_SECRET not set — using insecure development fallback');
    return 'fallback-secret-change-me';
  }
  return secret;
}

/**
 * jwt.verify() has overloads that TypeScript can resolve to
 * `Jwt & JwtPayload & void`, which does not overlap with our payload type and
 * so fails a direct cast (TS2352). Going through `unknown` is the documented
 * way to assert across that gap.
 */
function decode(token: string): AuthPayload {
  return jwt.verify(token, getSecret()) as unknown as AuthPayload;
}

/**
 * Rejects the request unless a valid session cookie is present.
 * Use on every route that reads or writes user data.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.auth_token;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }

  try {
    req.user = decode(token);
    return next();
  } catch {
    // Do not distinguish expired from malformed to the caller — that
    // difference is only useful to someone probing the endpoint.
    return res.status(401).json({ success: false, message: 'Invalid or expired session' });
  }
}

/**
 * Attaches `req.user` when a valid cookie exists, but allows the request
 * through either way.
 *
 * Use ONLY where anonymous access is genuinely intended and the route does not
 * touch user-scoped data. If a route needs to know who the caller is, it needs
 * requireAuth — "optional" auth that falls back to a client-supplied ID is not
 * authentication at all.
 */
export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.auth_token;
  if (token) {
    try {
      req.user = decode(token);
    } catch {
      // Leave req.user undefined. Never fall back to req.body.
    }
  }
  return next();
}