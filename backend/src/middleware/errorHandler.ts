/**
 * Global error handling middleware
 */
import { Request, Response, NextFunction } from 'express';
import { ValidationError, DatabaseError, UniqueConstraintError } from 'sequelize';

// Default handler for errors throughout the app
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  // Log all errors for debugging
  console.error(`Error in ${req.method} ${req.path}:`, err);
  
  // Different error types need different responses
  
  // Validation issues - 400 Bad Request
  if (err instanceof ValidationError) {
    // Map errors to field issues
    const fieldErrors = err.errors.map(e => ({
      field: e.path,
      problem: e.message
    }));
    
    return res.status(400).json({
      status: 'error',
      message: 'The data provided was invalid',
      issues: fieldErrors
    });
  }
  
  // Unique constraint violations - 409 Conflict
  if (err instanceof UniqueConstraintError) {
    // Let the client know which fields had problems
    const fields = err.errors.map(e => e.path);
    
    return res.status(409).json({
      status: 'error',
      message: 'An item with these details already exists',
      fields
    });
  }
  
  // Database errors - 500 Internal Server Error
  if (err instanceof DatabaseError) {
    // Don't expose DB info in production
    const message = process.env.NODE_ENV === 'production' 
      ? 'A database error occurred' 
      : err.message;
      
    return res.status(500).json({
      status: 'error',
      message
    });
  }
  
  // Generic error fallback
  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong',
    // Only include details in development
    details: process.env.NODE_ENV !== 'production' ? err.message : undefined
  });
}