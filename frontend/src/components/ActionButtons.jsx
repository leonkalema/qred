import React, { useState } from 'react';
import { activateCard } from '../services/api';

// Action buttons for card activation and support contact
function ActionButtons({ cardId, onCardActivated }) {
  // Track activation state and result
  const [activating, setActivating] = useState(false);
  const [result, setResult] = useState(null); 
  
  // Handle card activation flow
  async function handleActivation() {
    // We need a card ID to activate
    if (!cardId) {
      setResult('error');
      return;
    }
    
    setActivating(true);
    
    try {
      // Call the API to activate
      const response = await activateCard(cardId);
      
      // Check if it worked
      if (response.success) {
        setResult('success');
        onCardActivated?.(); // Notify parent
      } else {
        setResult('error');
      }
    } catch (err) {
      // Something went wrong
      console.log(`Activation error: ${err}`);
      setResult('error');
    } finally {
      setActivating(false);
    }
  }
  
  // Open support channel 
  function contactSupport() {
    // Open email client for now
    window.location.href = 'mailto:support@qred.com?subject=Help with my card';
  }
  
  return (
    <div className="space-y-3 mt-6">
      {/* Card activation button */}
      <button 
        onClick={handleActivation}
        disabled={activating}
        className="button-primary flex justify-center items-center"
      >
        {activating ? (
          <span className="flex items-center">
            {/* Loading spinner */}
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : 'Activate Card'}
      </button>
      
      {/* Support contact button */}
      <button 
        onClick={contactSupport}
        className="button-secondary"
      >
        Contact Support
      </button>
      
      {/* Success message */}
      {result === 'success' && (
        <div className="text-green-600 text-center text-sm mt-2">
          Card successfully activated!
        </div>
      )}
      
      {/* Error message */}
      {result === 'error' && (
        <div className="text-red-600 text-center text-sm mt-2">
          Unable to activate card. Please try again or contact support.
        </div>
      )}
    </div>
  );
}

export default ActionButtons;
