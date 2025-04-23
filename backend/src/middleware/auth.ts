import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Secret key from env or default (for dev only)
const JWT_SECRET = process.env.JWT_SECRET || '5ecr3t_k3y_f0r_d3v';

/**
 * Middleware to ensure a valid token exists
 */
export function authenticate(req: Request, res: Response, next: NextFunction) {
  // Check for the token
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN format
  
  // No token? Not authorized
  if (!token) {
    return res.status(401).json({ 
      error: 'Authentication required'
    });
  }
  
  // Try to verify the token
  try {
    // If valid, get the user payload
    const payload = jwt.verify(token, JWT_SECRET);
    
    // Add user info to the request for later use
    req.user = payload;
    
    // Continue to the next middleware/route handler
    next();
  } catch (err) {
    // Token has issues
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Session expired, please log in again'
      });
    }
    
    // Any other JWT error
    return res.status(403).json({ 
      error: 'Invalid authentication token'
    });
  }
}

/**
 * Middleware for admin-only routes
 * Must be used after authenticate middleware
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({
      error: 'Authentication required'
    });
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'Admin privileges required'
    });
  }
  
  // User is admin, proceed
  next();
}