import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database'; 
import Company from './company';

// Base interface for Account attributes
interface AccountAttributes {
  id: string;
  company_id: string;
  type: 'CHECKING' | 'LOAN' | 'CREDIT_LINE';
  balance: number;
  currency: string;
  created_at?: Date;
}

// Define which attributes are optional during creation
interface AccountCreationAttributes extends Optional<AccountAttributes, 'id' | 'balance' | 'currency' | 'created_at'> {}

class Account extends Model<AccountAttributes, AccountCreationAttributes> implements AccountAttributes {
  public id!: string;
  public company_id!: string;
  public type!: 'CHECKING' | 'LOAN' | 'CREDIT_LINE';
  public balance!: number;
  public currency!: string;
  public created_at?: Date;
}

Account.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  company_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'companies',
      key: 'id'
    }
  },
  type: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      isIn: [['CHECKING', 'LOAN', 'CREDIT_LINE']]
    }
  },
  balance: {
    type: DataTypes.DECIMAL,
    allowNull: false,
    defaultValue: 0.00
  },
  currency: {
    type: DataTypes.CHAR(3),
    allowNull: false,
    defaultValue: 'SEK'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'Account',
  tableName: 'accounts',
  timestamps: false
});

// Define association with Company
Account.belongsTo(Company, { foreignKey: 'company_id' });
Company.hasMany(Account, { foreignKey: 'company_id' });

export default Account;