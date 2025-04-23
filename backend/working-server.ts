// working-server.ts - A simplified Express server with proper typing
import express, { Request, Response } from 'express';
import cors from 'cors';
import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

// Create the Express app
const app = express();
const PORT = 3001;

// Setup middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database setup
const sequelize = new Sequelize('postgres://localhost:5432/qred_db', {
  dialect: 'postgres',
  logging: console.log
});

// Company Model Definition
interface CompanyAttributes {
  id: string;
  name: string;
  tax_id?: string;
  country_code?: string;
}

interface CompanyCreationAttributes extends Optional<CompanyAttributes, 'id'> {}

class Company extends Model<CompanyAttributes, CompanyCreationAttributes> implements CompanyAttributes {
  public id!: string;
  public name!: string;
  public tax_id?: string;
  public country_code?: string;
}

// Initialize the model
Company.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tax_id: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true
  },
  country_code: {
    type: DataTypes.CHAR(2),
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Company',
  tableName: 'companies',
  timestamps: false
});

// API Routes
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'API is running!' });
});

// Create a company
app.post('/api/companies', async (req: Request, res: Response) => {
  try {
    const { name, tax_id, country_code } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Company name is required' });
    }
    
    const company = await Company.create({
      name,
      tax_id,
      country_code
    });
    
    return res.status(201).json(company);
  } catch (error) {
    console.error('Error creating company:', error);
    return res.status(500).json({ message: 'Server error', error: String(error) });
  }
});

// Get all companies
app.get('/api/companies', async (req: Request, res: Response) => {
  try {
    const companies = await Company.findAll();
    return res.status(200).json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    return res.status(500).json({ message: 'Server error', error: String(error) });
  }
});

// Start the server
const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Start Express server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer();
