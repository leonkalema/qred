/**
 * Company model - represents a business entity
 */
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Company data structure
interface CompanyData {
  // Primary identifier
  id: string;
  
  // Basic information
  name: string;
  tax_id?: string;  // Tax ID/registration number
  country_code?: string;  // Two-letter country code
  
  // Business metadata
  business_type?: string;  // Legal form of the company
  address?: object;  // Structured address info
  credit_limit?: number;  // Max credit available
  
  // Record tracking
  created_at?: Date;  // When record was created
}

// Fields that can be omitted during record creation
type OptionalFields = 'id' | 'created_at';

// Fields needed when creating a new company
type CompanyInput = Optional<CompanyData, OptionalFields>;

/**
 * Company DB model
 */
class Company extends Model<CompanyData, CompanyInput> {
  // Required values
  declare id: string;
  declare name: string;
  
  // Optional fields
  declare tax_id?: string; 
  declare country_code?: string;
  declare business_type?: string;
  declare address?: object;
  declare credit_limit?: number;
  declare created_at?: Date;
}

// Define database schema
Company.init({
  // Unique identifier
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    comment: 'Unique identifier for the company'
  },
  
  // Company name - required
  name: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: true
    },
    comment: 'Legal company name'
  },
  
  // Tax ID - should be unique if provided
  tax_id: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: true,
    comment: 'Official tax ID or company registration number'
  },
  
  // Country - 2 letter code
  country_code: {
    type: DataTypes.CHAR(2),
    allowNull: true,
    validate: {
      // ISO country code validation
      isAlpha: true,
      len: [2, 2],
      isUppercase: true
    },
    comment: 'ISO 3166-1 alpha-2 country code'
  },
  
  // Business type/legal form
  business_type: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Legal form of the company (LLC, Inc, etc.)'
  },
  
  // JSON address data
  address: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Structured address information'
  },
  
  // Financial credit limit
  credit_limit: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
    comment: 'Maximum credit amount available to this company'
  },
  
  // Creation timestamp
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    comment: 'When the company record was created'
  }
}, {
  // Model configuration
  sequelize,
  modelName: 'Company',
  tableName: 'companies',
  timestamps: false,
  underscored: true
});

// Export for use in controllers and relations
export default Company;