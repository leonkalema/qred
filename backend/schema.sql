-- 1. Companies (core entity)
CREATE TABLE companies (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  tax_id VARCHAR(50) UNIQUE,
  country_code CHAR(2),         
  business_type VARCHAR(50),     
  address JSONB,                 
  credit_limit DECIMAL,         
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Users (RBAC with permissions)
CREATE TABLE users (
  id UUID PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL, 
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Roles (fixed missing table)
CREATE TABLE roles (
  id UUID PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL  -- e.g., "Admin", "Accountant"
);

-- 4. User-Role mapping (missing earlier)
CREATE TABLE user_roles (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, role_id)
);

-- 5. Permissions (granular access)
CREATE TABLE permissions (
  id UUID PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL  
);

-- 6. Role-Permission mapping
CREATE TABLE role_permissions (
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

-- 7. Accounts (holds balances, linked to company)
CREATE TABLE accounts (
  id UUID PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  type VARCHAR(20) CHECK (type IN ('CHECKING', 'LOAN', 'CREDIT_LINE')),
  balance DECIMAL DEFAULT 0.00,
  currency CHAR(3) DEFAULT 'SEK',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Cards (PCI-compliant design)
CREATE TABLE cards (
  id UUID PRIMARY KEY,
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  pan_token VARCHAR(36) UNIQUE,  -- Tokenized Primary Account Number (PCI DSS)
  last_four_digits CHAR(4) NOT NULL,
  expiry DATE NOT NULL,
  cvv_hash VARCHAR(255) NOT NULL,  -- Hashed (not stored raw!)
  spending_limit DECIMAL,          -- Monthly limit per card
  status VARCHAR(20) CHECK (status IN ('ACTIVE', 'BLOCKED', 'EXPIRED')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Loans (Qred's core product)
CREATE TABLE loans (
  id UUID PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  principal DECIMAL NOT NULL,      -- Original loan amount
  interest_rate DECIMAL NOT NULL,
  term_months INT NOT NULL,        -- Loan duration (e.g., 12 months)
  outstanding_balance DECIMAL,     -- Remaining amount owed
  status VARCHAR(20) CHECK (status IN ('PENDING_APPROVAL', 'ACTIVE', 'DELINQUENT', 'PAID_OFF')),
  approver_id UUID REFERENCES users(id),  -- Manager who approved
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Payments (loan repayments)
CREATE TABLE payments (
  id UUID PRIMARY KEY,
  loan_id UUID NOT NULL REFERENCES loans(id) ON DELETE CASCADE,
  amount DECIMAL NOT NULL,
  due_date DATE NOT NULL,
  paid_at TIMESTAMPTZ,            -- NULL = overdue
  status VARCHAR(20) CHECK (status IN ('SCHEDULED', 'PAID', 'MISSED')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Transactions (card purchases/loan disbursements)
CREATE TABLE transactions (
  id UUID PRIMARY KEY,
  account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
  card_id UUID REFERENCES cards(id) ON DELETE SET NULL,  -- For card purchases
  loan_id UUID REFERENCES loans(id) ON DELETE SET NULL,  -- For loan disbursements
  amount DECIMAL NOT NULL,
  type VARCHAR(20) CHECK (type IN ('PURCHASE', 'FEE', 'LOAN_DISBURSEMENT', 'PAYMENT')),
  currency CHAR(3) DEFAULT 'SEK',
  merchant_name VARCHAR(255),      -- Vendor details
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  status VARCHAR(20) CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED'))
);

-- 12. Audit Logs (GDPR/ISO 27001 compliance)
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(50) NOT NULL,      -- e.g., "CARD_BLOCKED", "LOAN_APPROVED"
  entity_type VARCHAR(50),          -- e.g., "CARD", "LOAN"
  entity_id UUID,                   -- ID of the affected record (card/loan/etc.)
  old_value JSONB,                  -- Snapshot before change
  new_value JSONB,                  -- Snapshot after change
  timestamp TIMESTAMPTZ DEFAULT NOW()
);