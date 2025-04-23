import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database'; 
import Company from './company';
import User from './user';

// Base interface for Loan attributes
interface LoanAttributes {
  id: string;
  company_id: string;
  principal: number;
  interest_rate: number;
  term_months: number;
  outstanding_balance?: number;
  status: 'PENDING_APPROVAL' | 'ACTIVE' | 'DELINQUENT' | 'PAID_OFF';
  approver_id?: string;
  created_at?: Date;
}

// Define which attributes are optional during creation
interface LoanCreationAttributes extends Optional<LoanAttributes, 'id' | 'outstanding_balance' | 'approver_id' | 'created_at'> {}

class Loan extends Model<LoanAttributes, LoanCreationAttributes> implements LoanAttributes {
  public id!: string;
  public company_id!: string;
  public principal!: number;
  public interest_rate!: number;
  public term_months!: number;
  public outstanding_balance?: number;
  public status!: 'PENDING_APPROVAL' | 'ACTIVE' | 'DELINQUENT' | 'PAID_OFF';
  public approver_id?: string;
  public created_at?: Date;
}

Loan.init({
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
  principal: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  interest_rate: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  term_months: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  outstanding_balance: {
    type: DataTypes.DECIMAL,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      isIn: [['PENDING_APPROVAL', 'ACTIVE', 'DELINQUENT', 'PAID_OFF']]
    }
  },
  approver_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'Loan',
  tableName: 'loans',
  timestamps: false
});

// Define associations
Loan.belongsTo(Company, { foreignKey: 'company_id' });
Company.hasMany(Loan, { foreignKey: 'company_id' });

Loan.belongsTo(User, { foreignKey: 'approver_id', as: 'approver' });
User.hasMany(Loan, { foreignKey: 'approver_id', as: 'approvedLoans' });

export default Loan;