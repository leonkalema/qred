/**
 * Card controller functionality
 */
import { Request, Response } from 'express';
import Card from '../models/card';
import { ValidationError } from 'sequelize';

/**
 * Add a new card to the system 
 */
async function createCard(req: Request, res: Response) {
  const { account_id, pan_token, last_four_digits, expiry, cvv_hash, spending_limit, status } = req.body;
  
  // Basic param validation
  const missingFields = [];
  if (!account_id) missingFields.push('account_id');
  if (!pan_token) missingFields.push('pan_token');
  if (!last_four_digits) missingFields.push('last_four_digits');
  if (!expiry) missingFields.push('expiry');
  if (!cvv_hash) missingFields.push('cvv_hash');
  if (!status) missingFields.push('status');
  
  if (missingFields.length > 0) {
    return res.status(400).json({ 
      error: 'Missing required fields', 
      fields: missingFields
    });
  }

  try {
    // Try to insert the card
    const newCard = await Card.create({
      account_id,
      pan_token,
      last_four_digits,
      expiry,
      cvv_hash,
      spending_limit,
      status
    });
    
    // Success!
    return res.status(201).json(newCard);
  } catch (err) {
    console.log('Card creation failed:', err);
    
    // Handle validation errors
    if (err instanceof ValidationError) {
      const validationIssues = err.errors.map(e => e.message);
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: validationIssues
      });
    }
    
    // Something else went wrong
    return res.status(500).json({ error: 'Could not create card' });
  }
}

// Get a list of all cards in the system
export async function getAllCards(req: Request, res: Response) {
  // Log for monitoring
  console.log('Card list requested');

  try {
    // Fetch all cards from the database
    const cardList = await Card.findAll({
      where: {},
      raw: true
    });
    
    // Debug info
    console.log(`Found ${cardList.length} cards in database`);
    
    return res.status(200).json(cardList);
  } catch (err) {
    // Something went wrong with the database
    console.error(`Database error: ${err}`);
    return res.status(500).json({ 
      error: 'Failed to fetch cards',
      details: process.env.NODE_ENV === 'development' ? err.toString() : undefined
    });
  }
}

// Look up a specific card by ID
export const getCardById = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  if (!id) {
    return res.status(400).json({ error: 'Card ID is required' });
  }
  
  try {
    // Look for the card in the database
    const cardData = await Card.findByPk(id);
    
    // Not found?
    if (!cardData) {
      return res.status(404).json({ error: 'Card not found' });
    }
    
    // Return the card data
    return res.status(200).json(cardData);
  } catch (err) {
    // Log the error and send a generic response
    console.error('Card lookup error:', err);
    return res.status(500).json({ error: 'Failed to retrieve card' });
  }
};

/**
 * Update an existing card's details
 */
export async function updateCard(req: Request, res: Response) {
  const id = req.params.id;
  const updates = req.body;
  
  // Only allow these fields to be updated for security
  const allowedUpdates = ['spending_limit', 'status'];
  const filteredUpdates = {};
  
  // Filter out fields that shouldn't be updated
  for (const field of allowedUpdates) {
    if (updates[field] !== undefined) {
      filteredUpdates[field] = updates[field];
    }
  }
  
  try {
    // Find the card first
    const cardToUpdate = await Card.findByPk(id);
    
    if (!cardToUpdate) {
      return res.status(404).json({
        success: false,
        error: 'No such card exists'
      });
    }
    
    // Apply the updates
    await cardToUpdate.update(filteredUpdates);
    
    // Send back the updated card
    return res.status(200).json({
      success: true,
      data: cardToUpdate
    });
  } catch (err) {
    // Handle validation failures
    if (err instanceof ValidationError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid data provided',
        details: err.errors.map(e => ({ field: e.path, issue: e.message }))
      });
    }
    
    // Handle other errors
    console.error('Card update failed:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to update card'
    });
  }
}

// Remove a card from the system
export const deleteCard = async (req: Request, res: Response) => {
  const cardId = req.params.id;
  
  // Make sure we have an ID
  if (!cardId || cardId.trim() === '') {
    return res.status(400).json({
      error: 'Valid card ID is required'
    });
  }
  
  try {
    // Look up the card
    const card = await Card.findByPk(cardId);
    
    // Can't delete what doesn't exist
    if (!card) {
      return res.status(404).json({
        error: 'Card not found'
      });
    }
    
    // Delete it
    await card.destroy();
    
    // Success!
    return res.status(204).send();
  } catch (err) {
    console.log(`Card deletion error: ${err.message}`);
    return res.status(500).json({
      error: 'Failed to delete card'
    });
  }
};

/**
 * Get all cards belonging to a specific account
 */
export function getCardsByAccount(req: Request, res: Response) {
  // Extract the account ID from the URL
  const accountId = req.params.accountId;
  
  // Perform the lookup asynchronously
  (async () => {
    try {
      // Find matching cards
      const accountCards = await Card.findAll({
        where: { account_id: accountId },
        raw: true
      });
      
      // Return what we found
      return res.status(200).json(accountCards);
    } catch (err) {
      // Log detailed error for monitoring
      console.error(`Failed to get cards for account ${accountId}:`, err);
      
      // Send client-friendly error
      return res.status(500).json({ 
        error: 'Could not retrieve cards for this account' 
      });
    }
  })();
}

// Export the createCard function explicitly
export { createCard };