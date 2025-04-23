import axios from 'axios';

// Set up API client 
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));

// Default company ID to use
const COMPANY_ID = import.meta.env.VITE_COMPANY_ID || 'a4b9f29b-097c-4905-b6c3-d243e949df74';

// API methods
export const getUserData = async () => {
  // Try to get real data first
  try {
    const response = await apiClient.get(`/companies/${COMPANY_ID}`);
    return response.data;
  } catch (err) {
    // Log the issue but don't crash in development
    console.warn(`Couldn't fetch company data: ${err.message}`);
    
    // Fall back to demo data
    return {
      id: COMPANY_ID,
      name: 'Demo Company',
      cardInfo: {
        id: 'card123',
        remaining: 5400,
        limit: 10000,
        currency: 'kr'
      }
    };
  }
};

export const getCards = async (companyId, page = 1, limit = 10) => {
  const emptyResponse = {
    data: [],
    pagination: { total: 0, page, limit, pages: 0 }
  };
  
  try {
    // First try to get accounts
    const accountsResponse = await apiClient.get(`/companies/${companyId}/accounts`);
    
    // Nothing to do if no accounts
    if (!accountsResponse.data?.length) {
      return emptyResponse;
    }

    // Gather all cards from all accounts
    let allCards = [];
    
    // Get cards for each account in parallel
    const promises = accountsResponse.data.map(account => 
      apiClient.get(`/accounts/${account.id}/cards`)
        .then(res => res.data)
        .catch(err => {
          console.log(`Failed to get cards for account ${account.id}`);
          return [];
        })
    );
    
    const results = await Promise.all(promises);
    allCards = results.flat();

    // Handle pagination
    const start = (page - 1) * limit;
    const paginatedCards = allCards.slice(start, start + limit);
    
    return {
      data: paginatedCards,
      pagination: {
        total: allCards.length,
        page,
        limit,
        pages: Math.ceil(allCards.length / limit) || 1
      }
    };
  } catch (err) {
    // If anything went wrong, log and return empty
    console.warn(`Problem fetching cards: ${err.message}`);
    return emptyResponse;
  }
};

export const getTransactions = async (page = 1, limit = 3) => {
  // Mock data for development
  const mockTransactions = {
    data: [
      {
        id: 'tx-001',
        account_id: 'account-1',
        card_id: 'card-123',
        amount: 1500,
        type: 'PURCHASE',
        currency: 'SEK',
        merchant_name: 'Office Supplies AB',
        status: 'COMPLETED',
        timestamp: '2025-04-22T14:00:00Z'
      },
      {
        id: 'tx-002',
        account_id: 'account-1',
        card_id: 'card-123',
        amount: 899,
        type: 'PURCHASE',
        currency: 'SEK',
        merchant_name: 'Cloud Services Ltd',
        status: 'COMPLETED',
        timestamp: '2025-04-20T09:30:00Z'
      },
      {
        id: 'tx-003',
        account_id: 'account-1',
        card_id: 'card-123',
        amount: 450,
        type: 'PURCHASE',
        currency: 'SEK',
        merchant_name: 'Business Lunch Cafe',
        status: 'COMPLETED',
        timestamp: '2025-04-18T12:15:00Z'
      }
    ],
    pagination: {
      total: 3,
      page,
      limit,
      pages: 1
    }
  };

  // Check if we can get real data
  try {
    const response = await apiClient.get(`/companies/${COMPANY_ID}/transactions?page=${page}&limit=${limit}`);
    return response.data;
  } catch (err) {
    // Log the issue but don't crash the app
    console.warn(`Transactions API unavailable: ${err.message}`);
    
    // Use mock data in development
    if (import.meta.env.MODE === 'development') {
      return mockTransactions;
    }
    
    // Empty response for production
    return {
      data: [],
      pagination: { total: 0, page, limit, pages: 0 }
    };
  }
};

export const getCardTransactions = async (cardId, page = 1, limit = 10) => {
  // Quick sanity check
  if (!cardId) {
    console.error('Missing card ID in getCardTransactions');
    return { data: [], pagination: { total: 0, page, limit, pages: 0 } };
  }
  
  // Sample data for this card
  const mockData = [
    {
      id: 'tx-001',
      account_id: 'account-1',
      card_id: cardId,
      amount: 1500,
      type: 'PURCHASE',
      currency: 'SEK',
      merchant_name: 'Office Supplies AB',
      status: 'COMPLETED',
      timestamp: '2025-04-22T14:00:00Z'
    },
    {
      id: 'tx-002',
      account_id: 'account-1',
      card_id: cardId,
      amount: 899,
      type: 'PURCHASE',
      currency: 'SEK',
      merchant_name: 'Cloud Services Ltd',
      status: 'COMPLETED',
      timestamp: '2025-04-20T09:30:00Z'
    },
    {
      id: 'tx-003',
      account_id: 'account-1',
      card_id: cardId,
      amount: 450,
      type: 'PURCHASE',
      currency: 'SEK',
      merchant_name: 'Business Lunch Cafe',
      status: 'COMPLETED',
      timestamp: '2025-04-18T12:15:00Z'
    },
    {
      id: 'tx-004',
      account_id: 'account-1',
      card_id: cardId,
      amount: 2100,
      type: 'PURCHASE',
      currency: 'SEK',
      merchant_name: 'Office Equipment Co',
      status: 'COMPLETED',
      timestamp: '2025-04-16T11:45:00Z'
    },
    {
      id: 'tx-005',
      account_id: 'account-1',
      card_id: cardId,
      amount: 750,
      type: 'PURCHASE',
      currency: 'SEK',
      merchant_name: 'Marketing Services',
      status: 'COMPLETED',
      timestamp: '2025-04-14T16:20:00Z'
    }
  ];
  
  // Try direct API call first
  try {
    const response = await apiClient.get(`/cards/${cardId}/transactions?page=${page}&limit=${limit}`);
    return response.data;
  } catch (err) {
    console.log(`Card transactions API not responding: ${err.message}`);
    
    // Fallback 1: Try filtering from all transactions
    try {
      const allTxs = await getTransactions(1, 100);
      const cardTxs = allTxs.data.filter(tx => tx.card_id === cardId);
      
      // Paginate the filtered transactions
      const start = (page - 1) * limit;
      const paginatedTxs = cardTxs.slice(start, start + limit);
      
      return {
        data: paginatedTxs,
        pagination: {
          total: cardTxs.length,
          page, 
          limit,
          pages: Math.ceil(cardTxs.length / limit) || 1
        }
      };
    } catch (innerErr) {
      // Fallback 2: Use mock data 
      return {
        data: mockData,
        pagination: {
          total: mockData.length,
          page,
          limit,
          pages: Math.ceil(mockData.length / limit)
        }
      };
    }
  }
};

export const activateCard = async (cardId) => {
  if (!cardId) {
    return { 
      success: false,
      message: 'No card ID provided for activation'
    };
  }
  
  // Attempt API activation first
  try {
    const response = await apiClient.post(`/companies/${COMPANY_ID}/cards/${cardId}/activate`);
    return response.data;
  } catch (err) {
    // For development we'll simulate success
    if (import.meta.env.MODE === 'development') {
      console.log(`API not ready: ${err.message}`);
      
      // Send a fake success response
      return { 
        success: true, 
        message: 'Card activated successfully',
        simulatedResponse: true
      };
    }
    
    // In production we should return the actual error
    return { 
      success: false,
      message: 'Unable to activate card at this time'
    };
  }
};

export default {
  getUserData,
  getTransactions,
  activateCard,
  getCards,
  getCardTransactions
};
