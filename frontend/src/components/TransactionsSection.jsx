import React from 'react';
import TransactionItem from './TransactionItem';

// Shows the latest transactions with an option to view more
function TransactionsSection({ transactions = [], totalCount = 0 }) {
  // Navigate to the full transaction history page
  function goToTransactionHistory() {
    // TODO: Navigate to full transaction list page
    console.log('Navigating to transaction history');
  }
  
  // Generate a fallback key for items missing IDs
  function getItemKey(tx) {
    return tx.id || `tx-${tx.timestamp}-${tx.amount}`;
  }
  
  // Calculate how many more transactions exist beyond what we're showing
  const hiddenTransactions = Math.max(0, totalCount - transactions.length);
  
  return (
    <div className="mb-4">
      {/* Header with transaction count */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-gray-700 font-medium">Latest transactions</h3>
        {totalCount > 0 && (
          <span className="text-xs text-gray-500">{totalCount} total</span>
        )}
      </div>
      
      {/* Transaction list container */}
      <div className="bg-white rounded-lg overflow-hidden shadow">
        {transactions.length > 0 ? (
          // Map transactions to items
          transactions.map(tx => (
            <TransactionItem 
              key={getItemKey(tx)}
              transaction={tx} 
            />
          ))
        ) : (
          // Empty state
          <div className="p-6 text-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 mx-auto mb-2 text-gray-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
            </svg>
            <p>No transactions found</p>
            <p className="text-xs mt-1">Your recent purchases will appear here</p>
          </div>
        )}
      </div>
      
      {/* "View more" button - only shown when there are more transactions */}
      {hiddenTransactions > 0 && (
        <button 
          onClick={goToTransactionHistory}
          className="border border-gray-300 rounded-lg w-full py-3 mt-2 flex justify-between items-center px-4 hover:bg-gray-50"
        >
          <span className="text-sm">{hiddenTransactions} more transactions</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default TransactionsSection;
