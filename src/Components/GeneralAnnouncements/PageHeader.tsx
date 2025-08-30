import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

interface PageHeaderProps {
  isDarkMode: boolean;
  canWritePost: boolean;
  onCreatePost: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  isDarkMode,
  canWritePost,
  onCreatePost
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold mb-2 transition-colors duration-300 ${
            isDarkMode ? 'text-gray-100' : 'text-gray-900'
          }`}>
            Announcements
          </h1>
          <p className={`text-lg transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Stay updated with the latest from our community
          </p>
        </div>
        
        {/* 글쓰기 버튼 - 관리자와 학생만 표시 */}
        {canWritePost && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCreatePost}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg ${
              isDarkMode 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            <Plus className="w-5 h-5" />
            New Post
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}; 