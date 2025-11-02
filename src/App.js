import React, { useState, createContext, useContext, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // <-- NEW: Import jwt-decode
import './App.css'; 

// Import our pages
import LoginPage from './pages/LoginPage';
import ModeSelectionPage from './pages/ModeSelectionPage';
import StorePage from './pages/StorePage';
import CartPage from './pages/CartPage';
import Header from './components/Header';
import NegotiationPage from './pages/NegotiationPage'; // <-- 1. ADD THIS IMPORT

// 1. Create an Authentication & Cart Context
const AppContext = createContext();

// 2. Create a custom hook to use the context
export const useApp = () => {
  return useContext(AppContext);
};

// 3. Create a provider component
const AppProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('accessToken'));
  const [user, setUser] = useState(null); // <-- NEW: User state
  const [cart, setCart] = useState(null);
  const [loadingCart, setLoadingCart] = useState(false);

  // --- Auth Functions ---
  const login = (newToken) => {
    const decodedUser = jwtDecode(newToken); // <-- NEW: Decode token
    localStorage.setItem('accessToken', newToken);
    setToken(newToken);
    setUser(decodedUser); // <-- NEW: Set user from token
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setToken(null);
    setUser(null); // <-- NEW: Clear user
    setCart(null);
  };

  // --- NEW: Cart Functions ---
  const fetchCart = useCallback(async (mode = 'retail') => {
    if (!token) return;
    setLoadingCart(true);
    try {
      const response = await fetch(`http://localhost:8000/api/cart?mode=${mode}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch cart');
      const cartData = await response.json();
      setCart(cartData);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoadingCart(false);
    }
  }, [token]);

  const addToCart = async (productId, quantity, mode = 'retail') => {
    if (!token) return;
    setLoadingCart(true);
    try {
      const response = await fetch(`http://localhost:8000/api/cart/add?mode=${mode}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product_id: productId, quantity: quantity }),
      });
      if (!response.ok) {
         const err = await response.json();
         throw new Error(err.detail || 'Failed to add item'); // <-- This will be caught by the component
      }
      const cartData = await response.json();
      setCart(cartData);
    } catch (error) {
      console.error(error.message);
      // --- FIX: Re-throw the error so the button can catch it ---
      throw error; 
    } finally {
      setLoadingCart(false);
    }
  };

  const removeFromCart = async (productId, mode = 'retail') => {
    if (!token) return;
    setLoadingCart(true);
    try {
      const response = await fetch(`http://localhost:8000/api/cart/item/${productId}?mode=${mode}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to remove item');
      const cartData = await response.json();
      setCart(cartData);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoadingCart(false);
    }
  };
  
  const updateQuantity = async (productId, newQuantity, mode = 'retail') => {
    if (!token) return;
    setLoadingCart(true);
    try {
      const response = await fetch(`http://localhost:8000/api/cart/item/${productId}?quantity=${newQuantity}&mode=${mode}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) {
         const err = await response.json();
         throw new Error(err.detail || 'Failed to update quantity');
      }
      const cartData = await response.json();
      setCart(cartData);
    } catch (error) {
      console.error(error.message);
      throw error; // <-- FIX: Re-throw error
    } finally {
      setLoadingCart(false);
    }
  };

  // --- End Cart Functions ---

  // On initial load, check for token and fetch cart/user
  useEffect(() => {
    if (token) {
      const decodedUser = jwtDecode(token); // <-- NEW
      setUser(decodedUser); // <-- NEW
      fetchCart();
    }
  }, [token, fetchCart]);


  const value = {
    token,
    user, // <-- NEW
    isLoggedIn: !!token,
    login,
    logout,
    cart,
    loadingCart,
    fetchCart,
    addToCart,
    removeFromCart,
    updateQuantity
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// 4. Create a component to protect our routes
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useApp();
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  return children;
};

// 5. The Main App
function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AppProvider>
  );
}

// We split AppContent so it can access the router and context
function AppContent() {
  const { isLoggedIn } = useApp();

  return (
    <div className="bg-gray-50 min-h-screen">
      {isLoggedIn && <Header onVoiceSearch={(text) => setSearchTerm(text)} />}
      <main className={isLoggedIn ? "pt-[68px]" : ""}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/mode" element={<ProtectedRoute><ModeSelectionPage /></ProtectedRoute>} />
          <Route path="/store" element={<ProtectedRoute><StorePage /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
          {/* --- 2. ADD THIS NEW ROUTE --- */}
          <Route 
            path="/negotiate/:productId" 
            element={<ProtectedRoute><NegotiationPage /></ProtectedRoute>} 
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;