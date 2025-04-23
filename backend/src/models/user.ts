import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database'; 
import Company from './company';

// Base interface for User attributes
interface UserAttributes {
  id: string;
  company_id: string;
  email: string;
  password_hash: string;
  last_login?: Date;
  created_at?: Date;
}

// Define which attributes are optional during creation
interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'last_login' | 'created_at'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public company_id!: string;
  public email!: string;
  public password_hash!: string;
  public last_login?: Date;
  public created_at?: Date;
}

User.init({
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
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  timestamps: false
});

// Define association with Company
User.belongsTo(Company, { foreignKey: 'company_id' });
Company.hasMany(User, { foreignKey: 'company_id' });

export default User;