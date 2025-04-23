import React, { useEffect, useState } from 'react';
import logo from '../assets/logo.svg';

/**
 * Provides responsive layout based on screen size
 * - Mobile: Simple container
 * - Desktop: Full webpage with sidebar
 */
function ResponsiveWrapper({ children }) {
  // Track if we're on a mobile device
  const [mobile, setMobile] = useState(false);

  // Set up responsive behavior
  useEffect(() => {
    // Check screen size
    function updateSize() {
      setMobile(window.innerWidth < 768);
    }
    
    // Set initial value
    updateSize();
    
    // Update when window resizes
    window.addEventListener('resize', updateSize);
    
    // Clean up when component unmounts
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  
  // Mobile layout
  if (mobile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto px-4 py-6">
          {children}
        </div>
      </div>
    );
  }
  
  // Desktop layout
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Desktop navigation */}
      <header className="bg-qred-primary text-white py-4">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center">
            <img src={logo} alt="Qred" className="h-8" />
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="hover:text-gray-300">Dashboard</a>
            <a href="#" className="hover:text-gray-300">Transactions</a>
            <a href="#" className="hover:text-gray-300">Cards</a>
            <a href="#" className="hover:text-gray-300">Support</a>
          </nav>
        </div>
      </header>
      
      {/* Content area with sidebar */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main content - mobile layout gets embedded here */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              {children}
            </div>
          </div>
          
          {/* Desktop sidebar */}
          <aside className="hidden md:block">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              
              <div className="space-y-3">
                <button className="w-full bg-qred-primary text-white py-2 px-4 rounded hover:bg-opacity-90">
                  View All Transactions
                </button>
                
                <button className="w-full bg-gray-700 text-white py-2 px-4 rounded hover:bg-opacity-90">
                  Request Credit Increase
                </button>
                
                <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-50">
                  Download Statement
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default ResponsiveWrapper;
