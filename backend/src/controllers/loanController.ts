// src/controllers/loanController.ts
import { Request, Response } from 'express';
import Loan from '../models/loan';
import { ValidationError } from 'sequelize';

// Create a new loan
export const createLoan = async (req: Request, res: Response) => {
  try {
    const { company_id, principal, interest_rate, term_months, outstanding_balance, status, approver_id } = req.body;
    
    if (!company_id || !principal || !interest_rate || !term_months || !status) {
      return res.status(400).json({ 
        message: 'Company ID, principal, interest rate, term months, and status are required' 
      });
    }

    const loan = await Loan.create({
      company_id,
      principal,
      interest_rate,
      term_months,
      outstanding_balance: outstanding_balance || principal, // Default to principal if not provided
      status,
      approver_id
    });
    
    return res.status(201).json(loan);
  } catch (error) {
    console.error('Error creating loan:', error);
    
    if (error instanceof ValidationError) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors.map(err => err.message) 
      });
    }
    
    return res.status(500).json({ message: 'Server error creating loan' });
  }
};

export const getAllLoans = async (req: Request, res: Response) => {
  try {
    console.log('Fetching all loans...');

    const loans = await Loan.findAll({
      where: {},
      raw: true
    });
    
    console.log(`Retrieved ${loans.length} loans`);
    
    return res.status(200).json(loans);
  } catch (error) {
    console.error('Error fetching loans:', error);
    return res.status(500).json({ message: 'Server error fetching loans', error: String(error) });
  }
};

export const getLoanById = async (req: Request, res: Response) => {
  try {
    const loanId = req.params.id;
    
    const loan = await Loan.findByPk(loanId);
    
    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }
    
    return res.status(200).json(loan);
  } catch (error) {
    console.error('Error fetching loan:', error);
    return res.status(500).json({ message: 'Server error fetching loan' });
  }
};

export const updateLoan = async (req: Request, res: Response) => {
  try {
    const loanId = req.params.id;
    const { principal, interest_rate, term_months, outstanding_balance, status, approver_id } = req.body;
    
    const loan = await Loan.findByPk(loanId);
    
    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }
    
    await loan.update({
      principal,
      interest_rate,
      term_months,
      outstanding_balance,
      status,
      approver_id
    });
    
    return res.status(200).json(loan);
  } catch (error) {
    console.error('Error updating loan:', error);
    
    if (error instanceof ValidationError) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors.map(err => err.message) 
      });
    }
    
    return res.status(500).json({ message: 'Server error updating loan' });
  }
};

export const deleteLoan = async (req: Request, res: Response) => {
  try {
    const loanId = req.params.id;
    
    const loan = await Loan.findByPk(loanId);
    
    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }
    
    await loan.destroy();
    
    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting loan:', error);
    return res.status(500).json({ message: 'Server error deleting loan' });
  }
};

export const getLoansByCompany = async (req: Request, res: Response) => {
  try {
    const companyId = req.params.companyId;
    
    const loans = await Loan.findAll({
      where: { company_id: companyId },
      raw: true
    });
    
    return res.status(200).json(loans);
  } catch (error) {
    console.error('Error fetching company loans:', error);
    return res.status(500).json({ message: 'Server error fetching company loans' });
  }
};