import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../App'; // To get the token

// Import our new components
import Sidebar from '../components/Sidebar';
import ProductGrid from '../components/ProductGrid';

// A simple debounce function to prevent spamming the API on every keystroke
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

function StorePage() {
  const { token } = useApp();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Get the mode from the URL
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'retail';

  // State for all our filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Debounce the search term to avoid API spam
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // This function builds the query URL and fetches products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    
    // Build the query string
    const params = new URLSearchParams();
    if (debouncedSearchTerm) {
      params.append('search', debouncedSearchTerm);
    }
    if (minPrice) {
      params.append('min_price', minPrice);
    }
    if (maxPrice) {
      params.append('max_price', maxPrice);
    }
    categories.forEach(category => {
      params.append('category', category);
    });

    try {
      const response = await fetch(`http://localhost:8000/api/products?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}` 
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
      // Handle error display
    } finally {
      setLoading(false);
    }
  }, [token, debouncedSearchTerm, categories, minPrice, maxPrice]);

  // Fetch products whenever the filters change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handler for category checkbox changes
  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    setCategories(prev => 
      checked ? [...prev, value] : prev.filter(c => c !== value)
    );
  };

  return (
    <div className="flex flex-col md:flex-row max-w-7xl mx-auto p-4 gap-6">
      {/* 1. The Sidebar */}
      <Sidebar
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        onCategoryChange={handleCategoryChange}
        minPrice={minPrice}
        onMinPriceChange={(e) => setMinPrice(e.target.value)}
        maxPrice={maxPrice}
        onMaxPriceChange={(e) => setMaxPrice(e.target.value)}
      />
      
      {/* 2. The Main Content Area */}
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 capitalize">
          {mode} Cattle Feed Products
        </h1>
        <ProductGrid loading={loading} products={products} />
      </div>
    </div>
  );
}

export default StorePage;