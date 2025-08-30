"use client"

import React from 'react';
import { motion } from "framer-motion";
import { MoreHorizontal, Edit, Trash2, ExternalLink } from 'lucide-react';
import { useThemeStore } from "@/Stores/themeStore";
import { useAuthStore } from "@/Stores/authStore";
import { EventPhoto, canEditGallery } from '@/Utils/DepartmentGalleryUtils';

interface GalleryItemProps {
  event: EventPhoto;
  isOpen: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const GalleryItem: React.FC<GalleryItemProps> = ({
  event,
  isOpen,
  onToggle,
  onEdit,
  onDelete
}) => {
  const { isDarkMode } = useThemeStore();
  const { user } = useAuthStore();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className={`relative rounded-xl overflow-hidden transition-all duration-300 ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      } shadow-lg hover:shadow-xl`}
    >
      {/* 이미지 */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* 드롭다운 메뉴 */}
        {canEditGallery(user?.role) && (
          <div className="absolute top-4 right-4">
            <button
              onClick={onToggle}
              className={`p-2 rounded-lg transition-all duration-300 ${
                isDarkMode
                  ? 'bg-gray-800/80 hover:bg-gray-700/80 text-gray-300'
                  : 'bg-white/80 hover:bg-gray-100/80 text-gray-700'
              }`}
            >
              <MoreHorizontal size={16} />
            </button>
            
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`absolute right-0 mt-2 py-2 rounded-lg shadow-lg transition-colors duration-300 ${
                  isDarkMode ? 'bg-gray-700' : 'bg-white'
                } border ${
                  isDarkMode ? 'border-gray-600' : 'border-gray-200'
                }`}
              >
                <button
                  onClick={onEdit}
                  className={`flex items-center gap-2 px-4 py-2 w-full text-left transition-colors duration-300 ${
                    isDarkMode
                      ? 'hover:bg-gray-600 text-gray-300'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <Edit size={14} />
                  Edit
                </button>
                <button
                  onClick={onDelete}
                  className={`flex items-center gap-2 px-4 py-2 w-full text-left transition-colors duration-300 ${
                    isDarkMode
                      ? 'hover:bg-gray-600 text-red-400'
                      : 'hover:bg-gray-100 text-red-600'
                  }`}
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* 내용 */}
      <div className="p-6">
        <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${
          isDarkMode ? 'text-gray-100' : 'text-gray-900'
        }`}>
          {event.title}
        </h3>
        <p className={`text-sm mb-3 transition-colors duration-300 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {formatDate(event.date)}
        </p>
        <p className={`text-sm line-clamp-3 transition-colors duration-300 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          {event.description}
        </p>
        
        {event.googleDriveUrl && (
          <a
            href={event.googleDriveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 mt-4 text-sm font-medium transition-colors duration-300 ${
              isDarkMode
                ? 'text-red-400 hover:text-red-300'
                : 'text-red-600 hover:text-red-700'
            }`}
          >
            <ExternalLink size={14} />
            View Photos
          </a>
        )}
      </div>
    </motion.div>
  );
}; 