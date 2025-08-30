import React from 'react';
import { motion } from 'framer-motion';

interface LoadingStateProps {
  isDarkMode: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ isDarkMode }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`text-center py-12 rounded-2xl ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}
    >
      <p className={`text-lg transition-colors duration-300 ${
        isDarkMode ? 'text-gray-300' : 'text-gray-600'
      }`}>
        Loading announcements...
      </p>
    </motion.div>
  );
}; 