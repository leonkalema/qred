import React from 'react';
import { formatCurrency, formatDate } from '../utils/formatting';

/**
 * Individual transaction item component
 */
function TransactionItem({ transaction }) {
  if (!transaction) return null;
  
  // Extract and prepare data for display
  const amount = transaction.amount || 0;
  const merchant = transaction.merchant_name || transaction.merchant || 'Unknown';
  const date = formatDate(transaction.timestamp || transaction.date);
  const currency = transaction.currency || 'kr';
  
  // Calculate reward points (1 per 100 spent)
  let points = transaction.points;
  if (points === undefined) {
    points = Math.floor(amount / 100);
  }
  
  // Get transaction type
  const type = transaction.type || 'PURCHASE';
  
  // Type display mapping
  const typeLabels = {
    'PURCHASE': 'Purchase',
    'PAYMENT': 'Payment',
    'FEE': 'Fee',
    'REFUND': 'Refund',
    'ADJUSTMENT': 'Adjustment',
    'TRANSFER': 'Transfer'
  };
  
  // Display-friendly version of the type
  const typeLabel = typeLabels[type] || type;
  
  // Style based on transaction type
  let badgeStyle = 'bg-gray-100 text-gray-800';
  
  if (type === 'PURCHASE') {
    badgeStyle = 'bg-blue-100 text-blue-800';
  } else if (type === 'PAYMENT') {
    badgeStyle = 'bg-green-100 text-green-800';
  } else if (type === 'FEE') {
    badgeStyle = 'bg-orange-100 text-orange-800';
  } else if (type === 'REFUND') {
    badgeStyle = 'bg-purple-100 text-purple-800';
  }
  
  // Handle transaction item click
  function handleClick() {
    // TODO: Show transaction details modal/screen
    console.log('Transaction details:', transaction.id);
  }
  
  return (
    <div 
      onClick={handleClick}
      className="p-3 border-b border-gray-300 last:border-b-0 hover:bg-gray-100 cursor-pointer"
    >
      {/* Top row with merchant and amount */}
      <div className="flex justify-between items-start mb-1">
        <div className="font-medium text-gray-800">{merchant}</div>
        <div className="font-medium text-gray-800 ml-2">
          {formatCurrency(amount, currency)}
        </div>
      </div>
      
      {/* Bottom row with date, type and points */}
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="text-sm text-gray-600">{date}</div>
          <div className={`text-xs px-2 py-0.5 rounded-full ml-2 ${badgeStyle}`}>
            {typeLabel}
          </div>
        </div>
        
        {points > 0 && (
          <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {points} {points === 1 ? 'point' : 'points'}
          </div>
        )}
      </div>
    </div>
  );
}

export default TransactionItem;
