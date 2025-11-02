import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom'; // <-- 1. Import useNavigate
import { useApp } from '../App';

function ProductCard({ product }) {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'retail';
  
  const { addToCart, loadingCart } = useApp();
  const navigate = useNavigate(); // <-- 2. Get the navigate function
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState('');

  const priceToShow = (mode === 'wholesale') ? product.wholesale_price : product.price;

  // 3. This function now handles BOTH modes
  const handleButtonAction = async () => {
    if (loadingCart || isAdding) return;
    
    if (mode === 'retail') {
      // --- RETAIL FLOW ---
      setIsAdding(true);
      setError('');
      try {
        await addToCart(product.id, 1, mode); 
      } catch (err) {
        setError(err.message);
        setTimeout(() => setError(''), 3000);
      } finally {
        setIsAdding(false);
      }
    } else {
      // --- WHOLESALE FLOW ---
      navigate(`/negotiate/${product.id}?mode=wholesale`);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition-shadow">
      {/* Placeholder for product image */}
      <div className="h-56 w-full bg-gray-200 flex items-center justify-center">
        <span className="text-gray-500">Product Image</span>
      </div>
      
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-gray-900 mb-2 truncate" title={product.name}>
          {product.name}
        </h3>
        
        {/* Price */}
        <div className="mb-4">
          <span className="text-2xl font-bold text-gray-800">
            ₹{priceToShow}
          </span>
          <span className="text-sm font-normal text-gray-500 ml-1">
            {product.unit}
          </span>
          {mode === 'wholesale' && (
            <span className="text-sm text-gray-400 line-through ml-2">
              ₹{product.price}
            </span>
          )}
        </div>

        <p className="text-gray-600 text-sm mb-4 flex-1">
          {product.description}
        </p>
        
        {/* Seller Info & Action */}
        <div className="border-t pt-4 mt-auto">
           <p className="text-sm text-gray-500 mb-4">
            Sold by: <span className="font-medium text-gray-700">{product.seller_name}</span>
           </p>
           
           <button 
             onClick={handleButtonAction} // <-- 4. Use the new handler function
             disabled={isAdding || loadingCart}
             className={`w-full text-white font-bold py-3 px-4 rounded-lg transition duration-300 ${
               mode === 'wholesale' 
                 ? 'bg-brand-orange hover:bg-orange-600' 
                 : 'bg-brand-green hover:bg-green-600'
             } disabled:opacity-50`}
           >
            {isAdding ? 'Adding...' : (mode === 'wholesale' ? 'Contact Seller' : '🛒 Add to Cart')}
           </button>
           
           {/* --- NEW: Error Display --- */}
           {error && (
            <p className="text-red-500 text-sm text-center mt-2">{error}</p>
           )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;