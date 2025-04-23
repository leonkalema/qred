import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database'; 
import Account from './account';
import Card from './card';
import Loan from './loan';

// Base interface for Transaction attributes
interface TransactionAttributes {
  id: string;
  account_id?: string;
  card_id?: string;
  loan_id?: string;
  amount: number;
  type: 'PURCHASE' | 'FEE' | 'LOAN_DISBURSEMENT' | 'PAYMENT';
  currency: string;
  merchant_name?: string;
  timestamp?: Date;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
}

// Define which attributes are optional during creation
interface TransactionCreationAttributes extends Optional<TransactionAttributes, 'id' | 'currency' | 'merchant_name' | 'timestamp'> {}

class Transaction extends Model<TransactionAttributes, TransactionCreationAttributes> implements TransactionAttributes {
  public id!: string;
  public account_id?: string;
  public card_id?: string;
  public loan_id?: string;
  public amount!: number;
  public type!: 'PURCHASE' | 'FEE' | 'LOAN_DISBURSEMENT' | 'PAYMENT';
  public currency!: string;
  public merchant_name?: string;
  public timestamp?: Date;
  public status!: 'PENDING' | 'COMPLETED' | 'FAILED';
}

Transaction.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  account_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'accounts',
      key: 'id'
    }
  },
  card_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'cards',
      key: 'id'
    }
  },
  loan_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'loans',
      key: 'id'
    }
  },
  amount: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      isIn: [['PURCHASE', 'FEE', 'LOAN_DISBURSEMENT', 'PAYMENT']]
    }
  },
  currency: {
    type: DataTypes.CHAR(3),
    allowNull: false,
    defaultValue: 'SEK'
  },
  merchant_name: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      isIn: [['PENDING', 'COMPLETED', 'FAILED']]
    }
  }
}, {
  sequelize,
  modelName: 'Transaction',
  tableName: 'transactions',
  timestamps: false
});

// Define associations
Transaction.belongsTo(Account, { foreignKey: 'account_id' });
Account.hasMany(Transaction, { foreignKey: 'account_id' });

Transaction.belongsTo(Card, { foreignKey: 'card_id' });
Card.hasMany(Transaction, { foreignKey: 'card_id' });

Transaction.belongsTo(Loan, { foreignKey: 'loan_id' });
Loan.hasMany(Transaction, { foreignKey: 'loan_id' });

export default Transaction;