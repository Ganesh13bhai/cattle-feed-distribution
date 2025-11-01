import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useApp } from '../App';

function CartPage() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'retail';
  
  const { cart, loadingCart, removeFromCart, updateQuantity, fetchCart } = useApp();
  const [error, setError] = useState('');

  // Re-fetch cart on page load to get correct prices for the current mode
  React.useEffect(() => {
    fetchCart(mode);
  }, [mode, fetchCart]);

  const handleQuantityChange = async (productId, newQuantity) => {
    setError('');
    if (newQuantity < 1) {
      await removeFromCart(productId, mode);
      return;
    }
    
    try {
      await updateQuantity(productId, newQuantity, mode);
    } catch (err) {
      setError(err.message);
    }
  };
  
  const handleRemove = async (productId) => {
    setError('');
    await removeFromCart(productId, mode);
  };

  if (loadingCart && !cart) {
    return <div className="text-center p-10">Loading cart...</div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-10 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/store" className="bg-brand-green text-white font-bold py-3 px-6 rounded-lg">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Shopping Cart</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="bg-white shadow-lg rounded-lg">
        <div className="hidden md:flex bg-gray-100 p-4 font-bold text-gray-600 rounded-t-lg">
          <div className="w-1/2">Product</div>
          <div className="w-1/4 text-center">Quantity</div>
          <div className="w-1/4 text-right">Total Price</div>
        </div>

        <div className="flex flex-col">
          {cart.items.map((item) => (
            <div key={item.product_id} className="flex flex-col md:flex-row items-center p-4 border-b">
              <div className="w-full md:w-1/2 flex items-center mb-4 md:mb-0">
                <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0 mr-4">
                  {/* Image placeholder */}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.seller_name}</p>
                  <p className="text-sm text-gray-600">₹{item.price.toFixed(2)} {item.unit}</p>
                </div>
              </div>
              
              <div className="w-full md:w-1/4 flex items-center justify-center mb-4 md:mb-0">
                <button 
                  onClick={() => handleQuantityChange(item.product_id, item.quantity - 1)}
                  className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full font-bold"
                  disabled={loadingCart}
                >
                  -
                </button>
                <span className="mx-4 font-bold text-lg">{item.quantity}</span>
                <button 
                  onClick={() => handleQuantityChange(item.product_id, item.quantity + 1)}
                  className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full font-bold"
                  disabled={loadingCart}
                >
                  +
                </button>
                <button
                  onClick={() => handleRemove(item.product_id)}
                  className="ml-4 text-red-500 hover:underline text-sm"
                  disabled={loadingCart}
                >
                  Remove
                </button>
              </div>

              <div className="w-full md:w-1/4 text-right">
                <span className="font-bold text-lg">₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 bg-gray-50 rounded-b-lg flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">
              Subtotal: <span className="text-brand-green">₹{cart.total_price.toFixed(2)}</span>
            </h3>
            <p className="text-gray-500">Taxes and shipping calculated at checkout.</p>
          </div>
          <button className="w-full md:w-auto bg-brand-green text-white font-bold py-3 px-8 rounded-lg text-lg">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartPage;