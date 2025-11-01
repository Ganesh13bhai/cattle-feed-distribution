import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useApp } from '../App'; 

function Header() {
  const { logout, cart, user } = useApp(); // <-- NEW: Get user
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode');

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <nav className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        
        {/* Left Side: Logo and Mode */}
        <div className="flex items-center gap-4">
          <Link to="/mode" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-brand-green text-white flex items-center justify-center rounded-lg font-bold text-xl">
              B
            </div>
            <span className="text-2xl font-bold text-brand-green">BEP</span>
          </Link>
          {mode && (
            <span className={`py-1 px-4 rounded-full text-sm font-medium ${
              mode === 'wholesale' 
                ? 'bg-brand-orange text-white' 
                : 'bg-brand-green text-white'
            }`}>
              {mode} Mode
            </span>
          )}
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-4">
          <button className="bg-brand-green text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-green-600">
            🎤
          </button>
          
          <Link 
            to="/cart" 
            className="bg-brand-green text-white w-10 h-10 rounded-full flex items-center justify-center relative hover:bg-green-600"
          >
            🛒
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {cart ? cart.total_items : 0}
            </span>
          </Link>

          {/* --- NEW: Show real user name --- */}
          <div className="text-gray-600 hidden md:block">
            👤 {user ? user.full_name : 'Loading...'}
          </div>
          <button 
            onClick={logout} 
            className="text-sm text-gray-500 hover:text-red-600"
          >
            (Logout)
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Header;