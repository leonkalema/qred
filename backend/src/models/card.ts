import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database'; 
import Account from './account';

// Define all the fields that make up a card
interface CardFields {
  id: string;
  account_id: string;  // Link to account
  pan_token: string;   // Tokenized card number (PCI compliant)
  last_four_digits: string; 
  expiry: Date;
  cvv_hash: string;    // Hashed for security 
  spending_limit?: number; // Optional limit
  status: 'ACTIVE' | 'BLOCKED' | 'EXPIRED';  // Card status
  created_at?: Date;   // When the card was created
}

// Define which attributes can be null when creating a record
type CardCreationFields = Optional<CardFields, 'id' | 'spending_limit' | 'created_at'>;

class Card extends Model<CardFields, CardCreationFields> {
  // Primary key
  declare id: string; 
  
  // Required fields
  declare account_id: string;
  declare pan_token: string;
  declare last_four_digits: string;
  declare expiry: Date;
  declare cvv_hash: string;
  declare status: 'ACTIVE' | 'BLOCKED' | 'EXPIRED';
  
  // Optional fields
  declare spending_limit?: number;
  declare created_at?: Date;
}

// Define the DB schema
Card.init({
  // Use UUID for primary key
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  
  // Link to accounts table
  account_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'accounts',
      key: 'id'
    }
  },
  
  // Card details
  pan_token: {
    type: DataTypes.STRING(36),
    allowNull: false,
    unique: true
  },
  
  last_four_digits: {
    type: DataTypes.CHAR(4),
    allowNull: false
  },
  
  expiry: {
    type: DataTypes.DATE,
    allowNull: false
  },
  
  cvv_hash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  
  // Financial limits
  spending_limit: {
    type: DataTypes.DECIMAL,
    allowNull: true
  },
  
  // Card status
  status: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      isIn: [['ACTIVE', 'BLOCKED', 'EXPIRED']]
    }
  },
  
  // Timestamps
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  // Connection and table details
  sequelize,
  modelName: 'Card',
  tableName: 'cards',
  timestamps: false
});

// Define relationships
Card.belongsTo(Account, { foreignKey: 'account_id' });
Account.hasMany(Card, { foreignKey: 'account_id' });

// Export for use in controllers
export default Card;