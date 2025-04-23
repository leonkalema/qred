import React, { useState } from 'react';
import logo from '../assets/logo.svg';

/**
 * App header with logo, company selector, and menu
 */
function Header({ companyName = 'Company AB' }) {
  // Track menu open/closed state
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Toggle the dropdown menu
  function toggleMenu() {
    setMenuOpen(!menuOpen);
  }
  
  // Open company selector dialog
  function selectCompany() {
    // TODO: Implement company selector
    console.log('Open company selector');
  }
  
  return (
    <header className="mb-4">
      {/* Logo and menu button */}
      <div className="flex justify-between items-center py-4">
        {/* Logo */}
        <div className="p-2 bg-gray-200 rounded">
          <img src={logo} alt="Qred" className="h-6" />
        </div>
        
        {/* Menu button */}
        <button 
          onClick={toggleMenu}
          className="p-2 bg-gray-200 rounded"
        >
          Menu
        </button>
      </div>
      
      {/* Company selector and dropdown menu */}
      <div className="relative">
        {/* Company selector */}
        <button 
          className="bg-gray-200 rounded p-3 flex justify-between items-center w-full mb-4"
          onClick={selectCompany}
        >
          <span className="text-gray-700">{companyName}</span>
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
              d="M19.5 8.25l-7.5 7.5-7.5-7.5" 
            />
          </svg>
        </button>
        
        {/* Dropdown menu */}
        {menuOpen && (
          <nav className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
            <ul className="py-1">
              <li>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
              </li>
              <li>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
              </li>
              <li>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</a>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;
