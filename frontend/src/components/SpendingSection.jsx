import React from 'react';
import { formatCurrency } from '../utils/formatting';

/**
 * The spending section displays a progress bar of
 * spending limit vs. remaining amount
 */
function SpendingSection({ remaining = 0, limit = 0, currency = 'kr' }) {
  // Navigate to spending details screen
  function viewSpendingDetails() {
    // TODO: Implement spending details navigation
    console.log('View spending details');
  }
  
  // Calculate how much has been spent as a percentage
  let spentPercent = 0;
  if (limit > 0) {
    const spent = limit - remaining;
    spentPercent = Math.min(100, Math.max(0, (spent / limit) * 100));
  }
  
  return (
    <div 
      onClick={viewSpendingDetails}
      className="bg-gray-200 rounded-lg p-4 mb-4 cursor-pointer"
    >
      <h3 className="text-gray-600 text-sm font-medium mb-3">Remaining balance</h3>
      
      {/* Amount display with arrow */}
      <div className="flex justify-between items-center mb-2">
        <div className="text-lg font-medium">
          {formatCurrency(remaining, '').trim()}/{formatCurrency(limit, currency)}
        </div>
        
        {/* Navigation arrow */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={1.5} 
          stroke="currentColor" 
          className="w-5 h-5"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M8.25 4.5l7.5 7.5-7.5 7.5" 
          />
        </svg>
      </div>
      
      {/* Progress bar */}
      <div className="h-2 w-full bg-gray-300 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-600 rounded-full"
          style={{ width: `${spentPercent}%` }}
        ></div>
      </div>
      
      <div className="text-right text-xs text-gray-500 mt-2">
        Based on your monthly limit
      </div>
    </div>
  );
}

export default SpendingSection;
