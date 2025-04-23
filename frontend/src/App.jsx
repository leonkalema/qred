import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import CardSection from './components/CardSection';
import SpendingSection from './components/SpendingSection';
import TransactionsSection from './components/TransactionsSection';
import ActionButtons from './components/ActionButtons';
import ResponsiveWrapper from './components/ResponsiveWrapper';
import { getUserData, getTransactions, getCards, getCardTransactions } from './services/api';

function App() {
  const [userData, setUserData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [cards, setCards] = useState([]);
  const [spendingInfo, setSpendingInfo] = useState({ remaining: 0, limit: 0, currency: 'kr' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    
    let companyData;
    try {
      companyData = await getUserData();
      setUserData(companyData);
    } catch (err) {
      console.error(`Failed to load company: ${err.message}`);
      setError("We couldn't load your company data right now. Please try again in a moment.");
      setLoading(false);
      return;
    }
    
    let activeCard = null;
    try {
      const companyId = companyData.id || import.meta.env.VITE_COMPANY_ID;
      const cardsData = await getCards(companyId);
      
      if (cardsData?.data) {
        setCards(cardsData.data);
        
        if (cardsData.data.length > 0) {
          activeCard = cardsData.data.find(c => c.status === 'ACTIVE') || cardsData.data[0];
        }
      }
    } catch (err) {
      console.warn(`Card data issue: ${err.message}`);
    }
    
    let txData = { data: [], pagination: { total: 0 } };
    try {
      if (activeCard?.id) {
        txData = await getCardTransactions(activeCard.id, 1, 5);
      } else {
        txData = await getTransactions(1, 5);
      }
      
      setTransactions(txData.data || []);
      setTotalTransactions(txData.pagination?.total || 0);
    } catch (err) {
      console.warn(`Transaction loading error: ${err.message}`);
    }
    
    try {
      if (activeCard) {
        const limit = Number(activeCard.spending_limit || 0);
        
        const purchases = txData.data?.filter(tx => 
          tx.status === 'COMPLETED' && tx.type === 'PURCHASE'
        ) || [];
        
        let spent = 0;
        for (const purchase of purchases) {
          spent += Number(purchase.amount || 0);
        }
        
        const remaining = Math.max(0, limit - spent);
        
        setSpendingInfo({
          remaining,
          limit,
          currency: activeCard.currency || 'kr'
        });
      } else if (companyData.spending || companyData.cardInfo) {
        const spending = companyData.spending || companyData.cardInfo;
        setSpendingInfo({
          remaining: spending.remaining || 0,
          limit: spending.limit || 0,
          currency: spending.currency || 'kr'
        });
      }
    } catch (err) {
      console.warn(`Spending calculation error: ${err.message}`);
    }
    
    setLoading(false);
  };
  
  const handleCardActivated = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <ResponsiveWrapper>
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-700">Just a moment...</p>
          </div>
        </div>
      </ResponsiveWrapper>
    );
  }

  if (error) {
    return (
      <ResponsiveWrapper>
        <div className="flex items-center justify-center py-16">
          <div className="text-center w-full max-w-md">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
              <p>{error}</p>
              <button 
                onClick={() => fetchData()}
                className="mt-3 bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </ResponsiveWrapper>
    );
  }

  return (
    <ResponsiveWrapper>
      <Header companyName={userData?.name || userData?.company?.name} />
      
      <CardSection 
        hasInvoice={userData?.invoices?.some(inv => inv.status === 'due' || inv.status === 'unpaid')} 
        invoiceData={userData?.invoices?.find(inv => inv.status === 'due' || inv.status === 'unpaid')}
        card={cards.length > 0 ? cards[0] : null}
        onCardActivated={handleCardActivated}
      />
      
      <SpendingSection 
        remaining={spendingInfo.remaining}
        limit={spendingInfo.limit}
        currency={spendingInfo.currency}
      />
      
      <TransactionsSection 
        transactions={transactions}
        totalCount={totalTransactions}
      />
      
      <ActionButtons 
        cardId={userData?.card?.id || userData?.cardInfo?.id} 
        onCardActivated={handleCardActivated}
      />
    </ResponsiveWrapper>
  );
}

export default App;