// src/controllers/accountController.ts
import { Request, Response } from 'express';
import Account from '../models/account';
import { ValidationError } from 'sequelize';

// Create a new account
export const createAccount = async (req: Request, res: Response) => {
  try {
    const { company_id, type, balance, currency } = req.body;
    
    if (!company_id || !type) {
      return res.status(400).json({ message: 'Company ID and account type are required' });
    }

    const account = await Account.create({
      company_id,
      type,
      balance,
      currency
    });
    
    return res.status(201).json(account);
  } catch (error) {
    console.error('Error creating account:', error);
    
    if (error instanceof ValidationError) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors.map(err => err.message) 
      });
    }
    
    return res.status(500).json({ message: 'Server error creating account' });
  }
};

export const getAllAccounts = async (req: Request, res: Response) => {
  try {
    console.log('Fetching all accounts...');

    const accounts = await Account.findAll({
      where: {},
      raw: true
    });
    
    console.log(`Retrieved ${accounts.length} accounts`);
    
    return res.status(200).json(accounts);
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return res.status(500).json({ message: 'Server error fetching accounts', error: String(error) });
  }
};

export const getAccountById = async (req: Request, res: Response) => {
  try {
    const accountId = req.params.id;
    
    const account = await Account.findByPk(accountId);
    
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }
    
    return res.status(200).json(account);
  } catch (error) {
    console.error('Error fetching account:', error);
    return res.status(500).json({ message: 'Server error fetching account' });
  }
};

export const updateAccount = async (req: Request, res: Response) => {
  try {
    const accountId = req.params.id;
    const { type, balance, currency } = req.body;
    
    const account = await Account.findByPk(accountId);
    
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }
    
    await account.update({
      type,
      balance,
      currency
    });
    
    return res.status(200).json(account);
  } catch (error) {
    console.error('Error updating account:', error);
    
    if (error instanceof ValidationError) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors.map(err => err.message) 
      });
    }
    
    return res.status(500).json({ message: 'Server error updating account' });
  }
};

export const deleteAccount = async (req: Request, res: Response) => {
  try {
    const accountId = req.params.id;
    
    const account = await Account.findByPk(accountId);
    
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }
    
    await account.destroy();
    
    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting account:', error);
    return res.status(500).json({ message: 'Server error deleting account' });
  }
};

export const getAccountsByCompany = async (req: Request, res: Response) => {
  try {
    const companyId = req.params.companyId;
    
    const accounts = await Account.findAll({
      where: { company_id: companyId },
      raw: true
    });
    
    return res.status(200).json(accounts);
  } catch (error) {
    console.error('Error fetching company accounts:', error);
    return res.status(500).json({ message: 'Server error fetching company accounts' });
  }
};