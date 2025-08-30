"use client";

import React, { useState } from "react";
import { useThemeStore } from '@/Stores/themeStore';
import { useAuth } from '@/Hooks/useAuth';
import { Toaster } from 'sonner';

const LoginPage = () => {
  const { isDarkMode } = useThemeStore();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      await login({ email, password });
    } catch (error) {
      // 에러는 useAuth 훅에서 처리되므로 여기서는 추가 처리 불필요
    }
  };

  return (
    <>
      <Toaster 
        position="bottom-right"
        richColors
        closeButton
      />
      <div className={`w-80 md:w-96 p-8 md:p-12 rounded-xl shadow-lg transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800 border border-gray-600' : 'bg-white'
      }`}>
        <h2 className={`font-bold text-2xl mb-6 text-center transition-colors duration-300 ${
          isDarkMode ? 'text-gray-100' : 'text-gray-900'
        }`}>
          Login
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className={`block mb-2 text-sm font-medium transition-colors duration-300 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={isLoading}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' 
                  : 'border-gray-300 text-gray-900'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className={`block mb-2 text-sm font-medium transition-colors duration-300 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={isLoading}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' 
                  : 'border-gray-300 text-gray-900'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              required
            />
            <div className="mt-2 text-right">
              <button
                type="button"
                disabled={isLoading}
                className="text-red-500 text-sm hover:text-red-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => alert('Forgot password functionality will be implemented here')}
              >
                Forgot your password?
              </button>
            </div>
          </div>
          {error && (
            <div className="text-red-500 mb-3 text-sm">{error}</div>
          )}
          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition-colors duration-200 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </div>
    </>
  );
};

export default LoginPage; 