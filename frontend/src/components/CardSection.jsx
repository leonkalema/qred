import React, { useState } from 'react';
import { activateCard } from '../services/api';

// Card and invoice section component
function CardSection({ hasInvoice, invoiceData, card, onCardActivated }) {
  // Track activation progress and results
  const [activating, setActivating] = useState(false);
  const [activationResult, setActivationResult] = useState(null);

  // Open card details modal/drawer 
  function showCardDetails() {
    // TODO: Add card details view
    console.log('Show card details');
  }
  
  // Navigate to invoice details
  function viewInvoiceDetails() {
    // TODO: Navigate to invoice screen
    console.log('Viewing invoice:', invoiceData?.id);
  }

  // Handle the card activation process
  async function activateCardHandler() {
    // Card ID is required
    if (!card?.id) {
      setActivationResult('error');
      return;
    }
    
    setActivating(true);
    
    try {
      // Call the activation endpoint
      const response = await activateCard(card.id);
      
      if (response.success) {
        // Success! Update parent and local state
        setActivationResult('success');
        onCardActivated?.();
      } else {
        // API reported an error
        setActivationResult('error');
      }
    } catch (err) {
      // Something went wrong with the request
      console.error('Activation failed:', err);
      setActivationResult('error');
    } finally {
      setActivating(false);
    }
  };
  
  // Card container UI with conditional invoice notification
  return (
    <div className="bg-gray-300 rounded-lg p-4 mb-4 relative">
      {/* Invoice notification pill */}
      {hasInvoice && (
        <div 
          onClick={viewInvoiceDetails}
          className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-4 py-2 rounded-full shadow flex items-center space-x-2 cursor-pointer"
        >
          <span className="font-medium">Invoice due</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </div>
      )}

      {/* Show either card details or activation UI */}
      {card?.status === 'ACTIVE' ? (
        // Active card - show details
        <div 
          onClick={showCardDetails}
          className="flex flex-col justify-center items-start cursor-pointer py-8"
        >
          <div className="flex w-full justify-between items-center mb-4">
            <span className="text-gray-800 font-semibold">Your Card Details</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </div>
          <div className="text-gray-700 mb-1">Card Number: **** **** **** {card.last_four_digits || '????'}</div>
          <div className="text-gray-700 mb-1">Expiry: {new Date(card.expiry).toLocaleDateString('en-US', { month: '2-digit', year: '2-digit' })}</div>
          <div className="text-gray-700">Card Status: Active</div>
        </div>
      ) : (
        // Inactive card - show activation UI
        <div className="flex flex-col justify-center items-center py-8">
          <span className="text-gray-600 mb-4">Your card needs activation</span>
          
          {/* Activation button with loading state */}
          <button 
            onClick={activateCardHandler}
            disabled={activating}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg flex justify-center items-center"
          >
            {activating ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Activating...
              </span>
            ) : 'Activate Card'}
          </button>
          
          {/* Success message */}
          {activationResult === 'success' && (
            <div className="text-green-600 text-center text-sm mt-2">
              Card activated successfully
            </div>
          )}
          
          {/* Error message */}
          {activationResult === 'error' && (
            <div className="text-red-600 text-center text-sm mt-2">
              Failed to activate card. Please try again.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CardSection;
