import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../App';

function NegotiationPage() {
  const { productId } = useParams();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode');
  
  const { token } = useApp();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 1. Mock chat messages
  const [messages, setMessages] = useState([
    { from: 'support', text: 'Hello! I am your AI-powered negotiation assistant. What price are you looking for?' }
  ]);
  const [newMessage, setNewMessage] = useState('');

  // 2. Fetch the single product's details
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8000/api/products/${productId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Product not found');
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId, token]);

  // 3. Mock chat send function
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Add user's message
    const userMessage = { from: 'user', text: newMessage };
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    
    // Mock a reply from the bot
    setTimeout(() => {
      const botReply = { from: 'support', text: 'That is an interesting offer. Let me check with the seller...' };
      setMessages(prev => [...prev, botReply]);
    }, 1500);
  };

  if (loading) {
    return <div className="text-center p-10">Loading product details...</div>;
  }
  
  if (error) {
    return <div className="text-center p-10 text-red-500">Error: {error}</div>;
  }

  if (!product) {
    return <div className="text-center p-10">Product not found.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 flex flex-col lg:flex-row gap-8">
      
      {/* --- Left Column: Product & Payment --- */}
      <div className="w-full lg:w-1/3">
        <Link 
          to={`/store?mode=${mode}`} 
          className="text-brand-green hover:underline mb-4 inline-block"
        >
          &larr; Back to Products
        </Link>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="h-64 w-full bg-gray-200 rounded-lg flex items-center justify-center mb-4">
            <span className="text-gray-500">Product Image</span>
          </div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-500 mb-2">{product.seller_name}</p>
          <div className="text-2xl font-bold text-brand-orange mb-4">
            ₹{product.wholesale_price}
            <span className="text-sm text-gray-400 line-through ml-2">
              ₹{product.price}
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-6">{product.description}</p>
          
          <h3 className="text-xl font-bold mb-3">Payment Options</h3>
          <div className="space-y-3">
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold">Pay with UPI</button>
            <button className="w-full bg-gray-800 text-white py-3 rounded-lg font-bold">Request 3-Month Credit</button>
            <button className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-bold">Pay via Bank Transfer (NEFT)</button>
          </div>
        </div>
      </div>

      {/* --- Right Column: Negotiation Chat --- */}
      <div className="w-full lg:w-2/3">
        <div className="bg-white h-full rounded-lg shadow-lg flex flex-col">
          <div className="bg-gray-100 p-4 rounded-t-lg border-b">
            <h2 className="text-2xl font-bold text-gray-800">Negotiation & Support</h2>
          </div>
          
          {/* Chat Window */}
          <div className="flex-1 p-6 space-y-4 overflow-y-auto" style={{height: '60vh'}}>
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-lg max-w-lg ${
                  msg.from === 'user' 
                    ? 'bg-brand-green text-white' 
                    : 'bg-gray-200 text-gray-800'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          
          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your offer or question..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green"
            />
            <button
              type="submit"
              className="bg-brand-green text-white font-bold py-3 px-6 rounded-lg"
            >
              Send
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}

export default NegotiationPage;
