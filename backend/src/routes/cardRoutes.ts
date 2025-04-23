// Card route definitions
import { Router } from 'express';
import * as cardCtrl from '../controllers/cardController';

// Create the router
const router = Router();

// Define routes for card operations

// Card management - CRUD operations
router.post('/cards', cardCtrl.createCard);         // Create a new card 
router.get('/cards', cardCtrl.getAllCards);         // List all cards
router.get('/cards/:id', cardCtrl.getCardById);     // Get specific card
router.put('/cards/:id', cardCtrl.updateCard);      // Update card
router.delete('/cards/:id', cardCtrl.deleteCard);   // Remove a card

// Special routes
router.get('/accounts/:accountId/cards', cardCtrl.getCardsByAccount);  // Get cards by account

export default router;