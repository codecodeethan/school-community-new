import React from 'react';
import { motion } from 'framer-motion';
import { generatePaginationPages } from '@/Utils/GeneralAnnouncementsUtils';

interface PaginationProps {
  isDarkMode: boolean;
  pagination: any;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  isDarkMode,
  pagination,
  currentPage,
  setCurrentPage
}) => {
  if (!pagination || pagination.totalPages <= 1) return null;

  const pages = generatePaginationPages(pagination.currentPage, pagination.totalPages);

  return (
    <>
      {/* 페이지네이션 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center mt-8"
      >
        <nav className="flex items-center space-x-2">
          {/* 이전 페이지 버튼 */}
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={!pagination.hasPrevPage}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-300 ${
              pagination.hasPrevPage
                ? isDarkMode
                  ? 'text-gray-300 bg-gray-700 hover:bg-gray-600'
                  : 'text-gray-700 bg-white hover:bg-gray-50'
                : isDarkMode
                  ? 'text-gray-500 bg-gray-800 cursor-not-allowed'
                  : 'text-gray-400 bg-gray-100 cursor-not-allowed'
            } border ${
              isDarkMode ? 'border-gray-600' : 'border-gray-300'
            }`}
          >
            Previous
          </button>

          {/* 페이지 번호들 */}
          {pages.map((pageNum) => {
            const isActive = pageNum === pagination.currentPage;
            
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-300 ${
                  isActive
                    ? 'text-white bg-red-500 border-red-500'
                    : isDarkMode
                      ? 'text-gray-300 bg-gray-700 hover:bg-gray-600 border-gray-600'
                      : 'text-gray-700 bg-white hover:bg-gray-50 border-gray-300'
                } border`}
              >
                {pageNum}
              </button>
            );
          })}

          {/* 다음 페이지 버튼 */}
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={!pagination.hasNextPage}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-300 ${
              pagination.hasNextPage
                ? isDarkMode
                  ? 'text-gray-300 bg-gray-700 hover:bg-gray-600'
                  : 'text-gray-700 bg-white hover:bg-gray-50'
                : isDarkMode
                  ? 'text-gray-500 bg-gray-800 cursor-not-allowed'
                  : 'text-gray-400 bg-gray-100 cursor-not-allowed'
            } border ${
              isDarkMode ? 'border-gray-600' : 'border-gray-300'
            }`}
          >
            Next
          </button>
        </nav>
      </motion.div>

      {/* 페이지 정보 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`text-center mt-4 text-sm transition-colors duration-300 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`}
      >
        Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to{' '}
        {Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)} of{' '}
        {pagination.totalCount} announcements
      </motion.div>
    </>
  );
}; 