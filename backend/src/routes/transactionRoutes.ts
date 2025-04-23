// src/routes/transactionRoutes.ts
import { Router, Request, Response } from 'express';
import { 
  createTransaction, 
  getAllTransactions, 
  getTransactionById, 
  updateTransaction,
  getTransactionsByAccount,
  getTransactionsByCard,
  getTransactionsByLoan
} from '../controllers/transactionController';

const router = Router();

// Transaction routes
router.post('/transactions', (req: Request, res: Response) => createTransaction(req, res));
router.get('/transactions', (req: Request, res: Response) => getAllTransactions(req, res));
router.get('/transactions/:id', (req: Request, res: Response) => getTransactionById(req, res));
router.put('/transactions/:id', (req: Request, res: Response) => updateTransaction(req, res));

// Get transactions by related entities
router.get('/accounts/:accountId/transactions', (req: Request, res: Response) => getTransactionsByAccount(req, res));
router.get('/cards/:cardId/transactions', (req: Request, res: Response) => getTransactionsByCard(req, res));
router.get('/loans/:loanId/transactions', (req: Request, res: Response) => getTransactionsByLoan(req, res));

export default router;