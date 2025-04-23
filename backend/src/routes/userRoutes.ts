// src/routes/userRoutes.ts
import { Router, Request, Response } from 'express';
import { 
  createUser, 
  getAllUsers, 
  getUserById, 
  updateUser, 
  deleteUser,
  getUsersByCompany
} from '../controllers/userController';

const router = Router();

// User routes
router.post('/users', (req: Request, res: Response) => createUser(req, res));
router.get('/users', (req: Request, res: Response) => getAllUsers(req, res));
router.get('/users/:id', (req: Request, res: Response) => getUserById(req, res));
router.put('/users/:id', (req: Request, res: Response) => updateUser(req, res));
router.delete('/users/:id', (req: Request, res: Response) => deleteUser(req, res));

// Get users by company ID
router.get('/companies/:companyId/users', (req: Request, res: Response) => getUsersByCompany(req, res));

export default router;