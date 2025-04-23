#!/bin/bash
# test-api.sh - Script to test CRUD operations for the Company API

BASE_URL="http://localhost:3000/api"
COMPANY_ID=""

# Text colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Testing Company CRUD Operations${NC}\n"

# Test direct company route first
echo -e "${YELLOW}0. Testing direct company route...${NC}"
curl -s http://localhost:3000/api/companies/direct
echo -e "\n"

# Test Create Company
echo -e "${YELLOW}1. Creating a new company...${NC}"
CREATE_RESPONSE=$(curl -s -X POST "$BASE_URL/direct-company" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Company XYZ",
    "tax_id": "123456789",
    "country_code": "SE"
  }')

echo "$CREATE_RESPONSE"
echo -e "\n"

# Try the debug route
echo -e "${YELLOW}2. Testing debug route...${NC}"
DEBUG_RESPONSE=$(curl -s -X POST "http://localhost:3000/debug/companies-test" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Debug Test Company",
    "tax_id": "987654321",
    "country_code": "SE"
  }')

echo "$DEBUG_RESPONSE"
echo -e "\n"

# Try the test route
echo -e "${YELLOW}3. Testing test-company route...${NC}"
TEST_RESPONSE=$(curl -s -X POST "http://localhost:3000/test-company" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Another Test Company",
    "tax_id": "555555",
    "country_code": "SE"
  }')

echo "$TEST_RESPONSE"
echo -e "\n"

echo -e "${YELLOW}CRUD testing complete!${NC}"
