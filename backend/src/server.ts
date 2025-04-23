// src/server.ts - A clean, fresh Express server implementation
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import Company from './models/company';

// Load environment variables
dotenv.config();

// Create Express application
const app: Application = express();
const PORT = process.env.PORT || 3000;

// Database connection
const databaseUrl = process.env.DATABASE_URL || 'postgres://localhost:5432/qred_db';
const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  logging: console.log
});

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test DB connection
const testConnection = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

// ROUTES

// Root route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Qred API is running!' });
});

// Company CRUD routes

// Create a new company
app.post('/api/companies', async (req: Request, res: Response) => {
  try {
    const { name, tax_id, country_code, business_type, address, credit_limit } = req.body;
    
    // Basic validation
    if (!name) {
      return res.status(400).json({ message: 'Company name is required' });
    }

    const company = await Company.create({
      name,
      tax_id,
      country_code,
      business_type,
      address,
      credit_limit
    });
    
    return res.status(201).json(company);
  } catch (error) {
    console.error('Error creating company:', error);
    return res.status(500).json({ message: 'Server error creating company', error: String(error) });
  }
});

// Get all companies
app.get('/api/companies', async (req: Request, res: Response) => {
  try {
    const companies = await Company.findAll();
    return res.status(200).json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    return res.status(500).json({ message: 'Server error fetching companies', error: String(error) });
  }
});

// Get company by ID
app.get('/api/companies/:id', async (req: Request, res: Response) => {
  try {
    const companyId = req.params.id;
    
    const company = await Company.findByPk(companyId);
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    return res.status(200).json(company);
  } catch (error) {
    console.error('Error fetching company:', error);
    return res.status(500).json({ message: 'Server error fetching company', error: String(error) });
  }
});

// Update company by ID
app.put('/api/companies/:id', async (req: Request, res: Response) => {
  try {
    const companyId = req.params.id;
    const { name, tax_id, country_code, business_type, address, credit_limit } = req.body;
    
    const company = await Company.findByPk(companyId);
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    // Update fields
    await company.update({
      name,
      tax_id,
      country_code,
      business_type,
      address,
      credit_limit
    });
    
    return res.status(200).json(company);
  } catch (error) {
    console.error('Error updating company:', error);
    return res.status(500).json({ message: 'Server error updating company', error: String(error) });
  }
});

// Delete company by ID
app.delete('/api/companies/:id', async (req: Request, res: Response) => {
  try {
    const companyId = req.params.id;
    
    const company = await Company.findByPk(companyId);
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    await company.destroy();
    
    return res.status(204).send(); // No content response
  } catch (error) {
    console.error('Error deleting company:', error);
    return res.status(500).json({ message: 'Server error deleting company', error: String(error) });
  }
});

// Start the server
app.listen(PORT, async () => {
  await testConnection();
  console.log(`Server is running on port ${PORT}`);
});

export default app;
