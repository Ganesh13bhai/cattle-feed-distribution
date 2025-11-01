import React from 'react';
import { Link } from 'react-router-dom';

function ModeSelectionPage() {
  return (
    <div className="min-h-screen bg-gray-100 pt-20 md:pt-32 px-4">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">Choose Your Mode</h1>
        <p className="text-lg text-gray-600 mb-10">
          Select how you want to purchase cattle feed
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-center gap-8 max-w-4xl mx-auto">
        {/* Retail Card */}
        <Link
          to="/store?mode=retail" // <-- CHANGED: Was /welcome
          className="bg-white rounded-xl shadow-lg p-8 w-full md:w-1/2 block hover:shadow-2xl transition-shadow"
        >
          <div className="w-16 h-16 bg-brand-green text-white flex items-center justify-center rounded-full text-3xl mb-4">
            👤
          </div>
          <h3 className="text-2xl font-bold mb-3">Retail Mode</h3>
          <p className="text-gray-600 mb-5">
            Perfect for individual farmers and small livestock owners
          </p>
          <ul className="text-gray-700 space-y-2 mb-6 list-disc list-inside">
            <li>AI-powered feed recommendations</li>
            <li>Voice ordering support</li>
            <li>Doorstep delivery</li>
          </ul>
          <div className="block w-full text-center bg-brand-green text-white font-bold py-3 rounded-lg">
            Choose Retail
          </div>
        </Link>

        {/* Wholesale Card */}
        <Link
          to="/store?mode=wholesale" // <-- CHANGED: Was /welcome
          className="bg-white rounded-xl shadow-lg p-8 w-full md:w-1/2 block hover:shadow-2xl transition-shadow"
        >
          <div className="w-16 h-16 bg-brand-orange text-white flex items-center justify-center rounded-full text-3xl mb-4">
            🏪
          </div>
          <h3 className="text-2xl font-bold mb-3">Wholesale Mode</h3>
          <p className="text-gray-600 mb-5">
            For distributors, shops, and bulk buyers
          </p>
          <ul className="text-gray-700 space-y-2 mb-6 list-disc list-inside">
            <li>Bulk pricing and discounts</li>
            <li>AI-powered bargaining support</li>
            <li>3-month credit options</li>
          </ul>
          <div className="block w-full text-center bg-brand-orange text-white font-bold py-3 rounded-lg">
            Choose Wholesale
          </div>
        </Link>
      </div>
    </div>
  );
}

export default ModeSelectionPage;