import { Request, Response } from 'express';
import Company from '../models/company';
import { ValidationError } from 'sequelize';

/** 
 * Register a new company in the system
 */
export async function createCompany(req: Request, res: Response) {
  // Extract company data from request body
  const { 
    name, 
    tax_id, 
    country_code, 
    business_type, 
    address, 
    credit_limit 
  } = req.body;
  
  // Name is mandatory
  if (!name || name.trim() === '') {
    return res.status(400).json({ 
      success: false,
      error: 'Company name cannot be empty' 
    });
  }

  try {
    // Create the company record
    const newCompany = await Company.create({
      name,
      tax_id,
      country_code,
      business_type,
      address,
      credit_limit
    });
    
    // Return the new company data
    return res.status(201).json({
      success: true,
      data: newCompany
    });
  } catch (err) {
    // Log the error for debugging
    console.log('Company registration failed:', err);
    
    // Handle validation errors
    if (err instanceof ValidationError) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid company data', 
        details: err.errors.map(e => e.message)
      });
    }
    
    // Generic error response
    return res.status(500).json({ 
      success: false,
      error: 'Could not register company'
    });
  }
}

/**
 * Get a list of all companies
 */
export function getAllCompanies(req: Request, res: Response) {
  // Let the client know we're working on it
  res.setHeader('X-Processing', 'true');
  
  // Process asynchronously
  (async () => {
    try {
      // Verify DB connection first
      try {
        await Company.sequelize?.authenticate();
        console.log('DB connection verified');
      } catch (dbErr) {
        throw new Error(`Database unavailable: ${dbErr.message}`);
      }
      
      // Fetch all companies
      const companies = await Company.findAll({
        raw: true // Just get plain objects
      });
      
      // Debug info
      if (process.env.NODE_ENV !== 'production') {
        console.log(`Found ${companies.length} companies`);
      }
      
      // Send the list back
      return res.status(200).json(companies);
    } catch (err) {
      // Something went wrong
      console.error('Company list fetch failed:', err);
      return res.status(500).json({ 
        error: 'Unable to retrieve companies',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  })();  
}

/** 
 * Find a specific company by ID
 */
export async function getCompanyById(req: Request, res: Response) {
  // Get the ID from the URL
  const id = req.params.id;
  
  // Make sure we have an ID
  if (!id) {
    return res.status(400).json({ 
      error: 'Company ID is required' 
    });
  }
  
  try {
    // Look up the company
    const company = await Company.findByPk(id);
    
    // If not found, return 404
    if (!company) {
      return res.status(404).json({ 
        error: 'No company found with this ID' 
      });
    }
    
    // Return the company data
    return res.status(200).json(company);
  } catch (err) {
    // Log and return error
    console.error(`Error retrieving company ${id}:`, err);
    return res.status(500).json({ 
      error: 'Failed to retrieve company' 
    });
  }
}

/**
 * Update an existing company's information
 */
export async function updateCompany(req: Request, res: Response) {
  const id = req.params.id;
  const updates = req.body;
  
  // Find the company first
  let company;
  try {
    company = await Company.findByPk(id);
    
    if (!company) {
      return res.status(404).json({ 
        error: 'Company not found' 
      });
    }
  } catch (err) {
    console.error('Error looking up company:', err);
    return res.status(500).json({ 
      error: 'Database error occurred' 
    });
  }
  
  // Now apply the updates
  try {
    // Apply changes
    const result = await company.update(updates);
    
    // Return updated data
    return res.status(200).json(result);
  } catch (err) {
    // Handle validation failures
    if (err instanceof ValidationError) {
      const problems = err.errors.map(e => ({
        field: e.path,
        issue: e.message
      }));
      
      return res.status(400).json({
        error: 'Invalid company data',
        problems
      });
    }
    
    // Other errors
    console.error('Company update failed:', err);
    return res.status(500).json({ 
      error: 'Failed to update company' 
    });
  }
}

/**
 * Remove a company from the system
 */
export async function deleteCompany(req: Request, res: Response) {
  // Get ID from URL
  const id = req.params.id;
  
  try {
    // Find the company first
    const company = await Company.findByPk(id);
    
    // Can't delete what doesn't exist
    if (!company) {
      return res.status(404).json({ 
        error: 'Company not found' 
      });
    }
    
    // Do the deletion
    await company.destroy();
    
    // 204 = Success, No Content
    return res.status(204).send();
  } catch (err) {
    // Something went wrong
    console.error(`Failed to delete company ${id}:`, err.message);
    return res.status(500).json({ 
      error: 'Could not delete company' 
    });
  }
}