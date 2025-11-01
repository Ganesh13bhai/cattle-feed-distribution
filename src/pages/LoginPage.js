import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App'; // Import our new hook

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('buyer');
  const [isLoginView, setIsLoginView] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useApp(); // Get the login function from context

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true); // <-- Loading starts

    try {
      if (isLoginView) {
        await handleLogin();
      } else {
        await handleSignUp();
      }
    } catch (err) {
      // Catch any unexpected errors from login/signup
      setError(err.message || "An unknown error occurred.");
    }

    setLoading(false); // <-- Loading *always* stops
  };

  const handleLogin = async () => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Login failed');
      }

      login(data.access_token);
      navigate('/mode');

    } catch (err) {
      setError(err.message);
      setLoading(false); // <-- FIX: Stop loading on error
    }
  };

  const handleSignUp = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username,
          password: password,
          role: role,
          full_name: fullName
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Sign up failed');
      }

      // After successful sign up, log them in automatically
      await handleLogin();

    } catch (err) {
      setError(err.message);
      setLoading(false); // <-- FIX: Stop loading on error
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-brand-green text-white flex items-center justify-center rounded-full font-bold text-3xl mx-auto mb-4">
            B
          </div>
          <h1 className="text-3xl font-bold text-gray-800">
            {isLoginView ? 'Welcome Back!' : 'Create Your Account'}
          </h1>
          <p className="text-gray-500">
            {isLoginView ? 'Login to continue' : 'Get started with BEP'}
          </p>
        </div>

        <form onSubmit={handleAuth}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {!isLoginView && (
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2" htmlFor="name">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="username">
              Email or Phone Number
            </label>
            <input
              type="text"
              id="username"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green"
              placeholder="example@mail.com or 1234567890"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {!isLoginView && (
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">I am a:</label>
              <div className="flex gap-4">
                <label className="flex-1">
                  <input
                    type="radio"
                    name="role"
                    value="buyer"
                    checked={role === 'buyer'}
                    onChange={() => setRole('buyer')}
                    className="sr-only"
                  />
                  <div className={`w-full text-center px-4 py-3 rounded-lg border-2 cursor-pointer ${role === 'buyer' ? 'bg-brand-green text-white border-brand-green' : 'text-gray-600 border-gray-300'}`}>
                    Buyer
                  </div>
                </label>
                <label className="flex-1">
                  <input
                    type="radio"
                    name="role"
                    value="seller"
                    checked={role === 'seller'}
                    onChange={() => setRole('seller')}
                    className="sr-only"
                  />
                  <div className={`w-full text-center px-4 py-3 rounded-lg border-2 cursor-pointer ${role === 'seller' ? 'bg-brand-orange text-white border-brand-orange' : 'text-gray-600 border-gray-300'}`}>
                    Seller
                  </div>
                </label>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-green text-white font-bold text-lg py-3 rounded-lg hover:bg-green-600 transition duration-300 disabled:opacity-50"
          >
            {loading ? 'Loading...' : (isLoginView ? 'Login' : 'Sign Up')}
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => {
              setIsLoginView(!isLoginView);
              setError('');
            }}
            className="text-brand-green hover:underline"
          >
            {isLoginView
              ? "Don't have an account? Sign Up"
              : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

