import React from 'react';
import { useThemeStore } from '@/Stores/themeStore';

const Footer = () => {
  const { isDarkMode } = useThemeStore();

  return (
    <footer className={`w-full py-4 text-center text-xs transition-colors duration-300 ${
      isDarkMode 
        ? 'text-gray-400 bg-gray-900 border-t border-gray-700' 
        : 'text-gray-500 bg-white border-t border-gray-200'
    }`}>
      &copy; {new Date().getFullYear()} School Community. All rights reserved.
    </footer>
  );
};

export default Footer; 