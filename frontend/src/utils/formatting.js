/**
 * Format helpers for the Qred app
 */

/**
 * Format a number as currency
 */
export function formatCurrency(amount, currency = 'kr') {
  // Handle null/undefined values
  if (amount === null || amount === undefined) {
    return '-';
  }
  
  // Swedish formatting (space as thousands separator)
  return `${new Intl.NumberFormat('sv-SE').format(amount)} ${currency}`;
}

/**
 * Format a date in Swedish format
 */
export function formatDate(dateInput) {
  if (!dateInput) return '';
  
  let date;
  try {
    date = new Date(dateInput);
    
    // Verify we got a valid date
    if (date.toString() === 'Invalid Date') {
      return dateInput; // Return original if parsing failed
    }
    
    // Format as Swedish date format
    return date.toLocaleDateString('sv-SE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (e) {
    // If anything goes wrong, just show the original
    return dateInput;
  }
}

/**
 * Format a transaction for display
 */
export function formatTransactionDescription(transaction) {
  if (!transaction) return '';
  
  // Find merchant name from various possible fields
  let merchant = 'Unknown';
  
  if (transaction.merchant_name) {
    merchant = transaction.merchant_name;
  } else if (transaction.merchant) {
    merchant = transaction.merchant;
  } else if (transaction.name) {
    merchant = transaction.name;
  }
  
  // Get date from various possible timestamp fields
  const timestamp = transaction.timestamp || transaction.date || transaction.created_at;
  const date = formatDate(timestamp);
  
  return `${date} • ${merchant}`;
}
