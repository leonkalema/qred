import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { testConnection } from './config/database';

// Routes
import companyRoutes from './routes/companyRoutes';
import userRoutes from './routes/userRoutes';
import accountRoutes from './routes/accountRoutes';
import loanRoutes from './routes/loanRoutes';
import cardRoutes from './routes/cardRoutes';
import transactionRoutes from './routes/transactionRoutes';
import debugRoutes from './routes/debugRoutes';

// Middleware
import { errorHandler } from './middleware/errorHandler';

// Load config from .env file
dotenv.config();

// Starting up...
console.log('🚀 Initializing server...');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Set up security and parsing middleware
app.use(cors());  // Allow cross-origin requests
app.use(helmet()); // Security headers
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Set up API routes
app.use('/api', companyRoutes);
app.use('/api', userRoutes);
app.use('/api', accountRoutes);
app.use('/api', loanRoutes);
app.use('/api', cardRoutes);
app.use('/api', transactionRoutes);

// Development routes
if (process.env.NODE_ENV !== 'production') {
  console.log('🧪 Debug routes enabled');
  app.use('/debug', debugRoutes);
}

// Root health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok',
    message: 'Qred API is running',
    version: '1.0.0'
  });
});

// Global error handler
app.use(errorHandler);

// Start the server
app.listen(PORT, async () => {
  // Check database connection
  await testConnection();
  
  // We're up and running!
  console.log(`✨ Server listening on port ${PORT}`);
});

// Export for testing
export default app;