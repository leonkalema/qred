// src/models/index.ts
// Export all models for easy importing elsewhere

import Company from './company';
import User from './user';
import Account from './account';
import Loan from './loan';
import Card from './card';
import Transaction from './transaction';

// Set up associations between models (already done in individual model files)

export {
  Company,
  User,
  Account,
  Loan,
  Card,
  Transaction
};

// This file allows importing all models from a single location
// Example: import { Company, User } from './models';