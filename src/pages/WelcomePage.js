import React from 'react';
import { useNavigate } from 'react-router-dom';

function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Welcome to Cattle Feed Management
        </h1>
        <p className="text-gray-600 mb-8">
          Your one-stop solution for managing cattle feed supply and demand
        </p>
        <button
          onClick={() => navigate('/login')}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

export default WelcomePage;