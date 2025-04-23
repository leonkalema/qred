// src/controllers/userController.ts
import { Request, Response } from 'express';
import User from '../models/user';
import { ValidationError } from 'sequelize';

// Create a new user
export const createUser = async (req: Request, res: Response) => {
  try {
    const { company_id, email, password_hash } = req.body;
    
    if (!email || !password_hash || !company_id) {
      return res.status(400).json({ message: 'Email, password hash, and company ID are required' });
    }

    const user = await User.create({
      company_id,
      email,
      password_hash
    });
    
    return res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    
    if (error instanceof ValidationError) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors.map(err => err.message) 
      });
    }
    
    return res.status(500).json({ message: 'Server error creating user' });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    console.log('Fetching all users...');

    const users = await User.findAll({
      where: {},
      raw: true
    });
    
    console.log(`Retrieved ${users.length} users`);
    
    return res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ message: 'Server error fetching users', error: String(error) });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    return res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ message: 'Server error fetching user' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { email, password_hash, last_login } = req.body;
    
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    await user.update({
      email,
      password_hash,
      last_login
    });
    
    return res.status(200).json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    
    if (error instanceof ValidationError) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors.map(err => err.message) 
      });
    }
    
    return res.status(500).json({ message: 'Server error updating user' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    await user.destroy();
    
    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ message: 'Server error deleting user' });
  }
};

export const getUsersByCompany = async (req: Request, res: Response) => {
  try {
    const companyId = req.params.companyId;
    
    const users = await User.findAll({
      where: { company_id: companyId },
      raw: true
    });
    
    return res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching company users:', error);
    return res.status(500).json({ message: 'Server error fetching company users' });
  }
};