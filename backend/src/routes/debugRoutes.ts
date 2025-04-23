/**
 * Debug/test endpoints for development use only
 * NOT FOR PRODUCTION USE
 */
import { Router, Request, Response } from 'express';
import sequelize from '../config/database';

// Create a router
const router = Router();

/**
 * Catch any promise errors in route handlers
 */
function safeRoute(handler) {
  return async (req: Request, res: Response) => {
    try {
      await handler(req, res);
    } catch (err) {
      // Log with request context
      console.error(`Error in ${req.method} ${req.path}:`, err);
      
      // Send a helpful response
      res.status(500).json({ 
        error: 'Something broke',
        message: err.message
      });
    }
  };
}

/**
 * Test database connection
 */
router.get('/db-status', safeRoute(async (req: Request, res: Response) => {
  // Try a simple database query
  const result = await sequelize.query('SELECT NOW() as current_time');
  
  // Return status info
  res.json({
    status: 'connected',
    database: sequelize.getDatabaseName(),
    serverTime: result[0][0].current_time,
    dialect: sequelize.getDialect()
  });
}));

/**
 * Debug endpoint for testing request data
 */
router.post('/echo', (req: Request, res: Response) => {
  // Just echo back what was sent
  res.json({
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body,
    query: req.query,
    params: req.params
  });
});

/**
 * Test company creation
 */
router.post('/test-company', safeRoute(async (req: Request, res: Response) => {
  // Log the incoming request
  console.log('Company test data:', req.body);
  
  // Send success response
  res.status(200).json({
    message: 'Test company endpoint working',
    receivedData: req.body,
    testMode: true
  });
}));

/**
 * Test error handling
 */
router.get('/trigger-error', (req: Request, res: Response) => {
  // Deliberately cause an error
  const err = new Error('This is a test error');
  err.stack = 'Fake stack trace';
  
  // Will be caught by error handler
  throw err;
});

// Export the router
export default router;