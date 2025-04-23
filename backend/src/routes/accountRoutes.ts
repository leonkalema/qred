// src/routes/accountRoutes.ts
import { Router, Request, Response } from 'express';
import { 
  createAccount, 
  getAllAccounts, 
  getAccountById, 
  updateAccount, 
  deleteAccount,
  getAccountsByCompany
} from '../controllers/accountController';

const router = Router();

// Account routes
router.post('/accounts', (req: Request, res: Response) => createAccount(req, res));
router.get('/accounts', (req: Request, res: Response) => getAllAccounts(req, res));
router.get('/accounts/:id', (req: Request, res: Response) => getAccountById(req, res));
router.put('/accounts/:id', (req: Request, res: Response) => updateAccount(req, res));
router.delete('/accounts/:id', (req: Request, res: Response) => deleteAccount(req, res));

// Get accounts by company ID
router.get('/companies/:companyId/accounts', (req: Request, res: Response) => getAccountsByCompany(req, res));

export default router;