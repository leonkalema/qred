import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Make sure we have environment vars loaded
dotenv.config();

// DB connection string - get from env or use default
const dbConnString = process.env.DATABASE_URL || 'postgres://localhost:5432/qred_db';

// DB connection pool settings
const poolConfig = {
  max: 5,         // Max connections in pool
  min: 0,         // Min connections in pool
  acquire: 30000, // Max milliseconds to acquire connection
  idle: 10000     // Max idle time before releasing
};

// Only log queries in dev mode
const shouldLogQueries = process.env.NODE_ENV === 'development';

// Set up the database connection
const sequelize = new Sequelize(dbConnString, {
  dialect: 'postgres',
  logging: shouldLogQueries ? console.log : false,
  pool: poolConfig
});

/**
 * Test the database connection
 * Exits process on failure
 */
export async function testConnection() {
  try {
    // Try to connect and authenticate
    await sequelize.authenticate();
    
    // Success message
    console.log('✅ Database connection successful');
  } catch (err) {
    // Log detailed error
    console.error('❌ Database connection failed:', err);
    
    // Exit with error code
    process.exit(1);
  }
}

// Export the connection
export default sequelize;