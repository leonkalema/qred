import { useState, useEffect, useCallback } from 'react';

/**
 * Hook for simplifying API calls with state management
 */
function useApi(apiFunc, executeOnMount = false, initialParams = null) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Wrapped API caller
  const execute = useCallback(async (...params) => {
    // Reset states
    setError(null);
    setLoading(true);
    
    try {
      // Make the API call
      const result = await apiFunc(...params);
      setData(result);
      return result;
    } catch (e) {
      const errorMsg = e.message || "Something went wrong";
      setError(errorMsg);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [apiFunc]);

  // If immediate execution requested, run on mount
  useEffect(() => {
    if (executeOnMount) {
      execute(...(initialParams || []));
    }
    // Skip deps warning - we only want to run this on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    data,
    error,
    loading,
    execute,
    // Allow direct data updates from the component
    setData,
  };
}

export default useApi;
