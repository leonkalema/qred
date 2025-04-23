// test-create-company.ts
import { testConnection } from './config/database';
import Company from './models/company';
import dotenv from 'dotenv';

dotenv.config();

async function createTestCompany() {
  try {
    // Test database connection
    await testConnection();
    
    // Create a test company
    const company = await Company.create({
      name: 'Test Company ABC',
      tax_id: 'TEST123456',
      country_code: 'SE',
      business_type: 'Technology',
      address: {
        street: '123 Test Street',
        city: 'Stockholm',
        zip: '12345',
        country: 'Sweden'
      },
      credit_limit: 100000
    });
    
    console.log('Test company created successfully:');
    console.log(JSON.stringify(company, null, 2));
    
    // Try to fetch all companies to verify
    const companies = await Company.findAll();
    console.log(`\nTotal companies found: ${companies.length}`);
    console.log('All companies:');
    console.log(JSON.stringify(companies, null, 2));
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating test company:', error);
    process.exit(1);
  }
}

createTestCompany();
