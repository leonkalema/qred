// src/controllers/transactionController.ts
import { Request, Response } from 'express';
import Transaction from '../models/transaction';
import { ValidationError } from 'sequelize';

// Create a new transaction
export const createTransaction = async (req: Request, res: Response) => {
  try {
    const { account_id, card_id, loan_id, amount, type, currency, merchant_name, status } = req.body;
    
    if (!amount || !type || !status) {
      return res.status(400).json({ 
        message: 'Amount, type, and status are required' 
      });
    }

    // Validate that at least one of account_id, card_id, or loan_id is provided
    if (!account_id && !card_id && !loan_id) {
      return res.status(400).json({ 
        message: 'At least one of account_id, card_id, or loan_id must be provided' 
      });
    }

    const transaction = await Transaction.create({
      account_id,
      card_id,
      loan_id,
      amount,
      type,
      currency,
      merchant_name,
      status
    });
    
    return res.status(201).json(transaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    
    if (error instanceof ValidationError) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors.map(err => err.message) 
      });
    }
    
    return res.status(500).json({ message: 'Server error creating transaction' });
  }
};

export const getAllTransactions = async (req: Request, res: Response) => {
  try {
    console.log('Fetching all transactions...');

    const transactions = await Transaction.findAll({
      where: {},
      raw: true
    });
    
    console.log(`Retrieved ${transactions.length} transactions`);
    
    return res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return res.status(500).json({ message: 'Server error fetching transactions', error: String(error) });
  }
};

export const getTransactionById = async (req: Request, res: Response) => {
  try {
    const transactionId = req.params.id;
    
    const transaction = await Transaction.findByPk(transactionId);
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    return res.status(200).json(transaction);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    return res.status(500).json({ message: 'Server error fetching transaction' });
  }
};

export const updateTransaction = async (req: Request, res: Response) => {
  try {
    const transactionId = req.params.id;
    const { status } = req.body;
    
    const transaction = await Transaction.findByPk(transactionId);
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    // Only allow updating status for security and data integrity reasons
    await transaction.update({
      status
    });
    
    return res.status(200).json(transaction);
  } catch (error) {
    console.error('Error updating transaction:', error);
    
    if (error instanceof ValidationError) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors.map(err => err.message) 
      });
    }
    
    return res.status(500).json({ message: 'Server error updating transaction' });
  }
};

export const getTransactionsByAccount = async (req: Request, res: Response) => {
  try {
    const accountId = req.params.accountId;
    
    const transactions = await Transaction.findAll({
      where: { account_id: accountId },
      raw: true
    });
    
    return res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching account transactions:', error);
    return res.status(500).json({ message: 'Server error fetching account transactions' });
  }
};

export const getTransactionsByCard = async (req: Request, res: Response) => {
  try {
    const cardId = req.params.cardId;
    
    const transactions = await Transaction.findAll({
      where: { card_id: cardId },
      raw: true
    });
    
    return res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching card transactions:', error);
    return res.status(500).json({ message: 'Server error fetching card transactions' });
  }
};

export const getTransactionsByLoan = async (req: Request, res: Response) => {
  try {
    const loanId = req.params.loanId;
    
    const transactions = await Transaction.findAll({
      where: { loan_id: loanId },
      raw: true
    });
    
    return res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching loan transactions:', error);
    return res.status(500).json({ message: 'Server error fetching loan transactions' });
  }
};