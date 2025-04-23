// src/routes/loanRoutes.ts
import { Router, Request, Response } from 'express';
import { 
  createLoan, 
  getAllLoans, 
  getLoanById, 
  updateLoan, 
  deleteLoan,
  getLoansByCompany
} from '../controllers/loanController';

const router = Router();

// Loan routes
router.post('/loans', (req: Request, res: Response) => createLoan(req, res));
router.get('/loans', (req: Request, res: Response) => getAllLoans(req, res));
router.get('/loans/:id', (req: Request, res: Response) => getLoanById(req, res));
router.put('/loans/:id', (req: Request, res: Response) => updateLoan(req, res));
router.delete('/loans/:id', (req: Request, res: Response) => deleteLoan(req, res));

// Get loans by company ID
router.get('/companies/:companyId/loans', (req: Request, res: Response) => getLoansByCompany(req, res));

export default router;