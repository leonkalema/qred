/**
 * Company management routes
 */
import { Router } from 'express';
import * as companies from '../controllers/companyController';

// Create a router
const router = Router();

// Company resource endpoints
router.route('/companies')
  .post(companies.createCompany)   // Create new company
  .get(companies.getAllCompanies); // List all companies

// Company-specific operations
router.route('/companies/:id')
  .get(companies.getCompanyById)    // Get one company
  .put(companies.updateCompany)     // Update a company
  .delete(companies.deleteCompany); // Remove a company

// Export for use in main app
export default router;