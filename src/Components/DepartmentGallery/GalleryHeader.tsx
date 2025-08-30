"use client"

import React from 'react';
import { motion } from "framer-motion";
import { Plus } from 'lucide-react';
import { useThemeStore } from "@/Stores/themeStore";
import { useAuthStore } from "@/Stores/authStore";
import { canCreateGallery } from '@/Utils/DepartmentGalleryUtils';

interface GalleryHeaderProps {
  onAddClick: () => void;
  title?: string;
  description?: string;
}

export const GalleryHeader: React.FC<GalleryHeaderProps> = ({ 
  onAddClick, 
  title = "Gallery",
  description = "Explore our events and activities"
}) => {
  const { isDarkMode } = useThemeStore();
  const { user } = useAuthStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-8"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
        <div>
          <h1 className={`text-3xl font-bold transition-colors duration-300 ${
            isDarkMode ? 'text-gray-100' : 'text-gray-900'
          }`}>
            {title}
          </h1>
          <p className={`text-lg mt-2 transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {description}
          </p>
        </div>
        
        {canCreateGallery(user?.role) && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAddClick}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 w-full lg:w-auto ${
              isDarkMode
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            <Plus size={20} />
            Add Event
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}; 