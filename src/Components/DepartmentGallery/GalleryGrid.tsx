"use client"

import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useThemeStore } from "@/Stores/themeStore";
import { EventPhoto } from '@/Utils/DepartmentGalleryUtils';
import { GalleryItem } from './GalleryItem';

interface GalleryGridProps {
  events: EventPhoto[];
  openDropdown: number | null;
  onDropdownToggle: (eventId: number) => void;
  onEdit: (eventId: number) => void;
  onDelete: (eventId: number) => void;
}

export const GalleryGrid: React.FC<GalleryGridProps> = ({
  events,
  openDropdown,
  onDropdownToggle,
  onEdit,
  onDelete
}) => {
  const { isDarkMode } = useThemeStore();

  if (events.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className={`text-center py-12 rounded-xl transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <p className={`text-lg transition-colors duration-300 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          No events found for the selected filters.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <AnimatePresence>
        {events.map((event) => (
          <GalleryItem
            key={event.id}
            event={event}
            isOpen={openDropdown === event.id}
            onToggle={() => onDropdownToggle(event.id)}
            onEdit={() => onEdit(event.id)}
            onDelete={() => onDelete(event.id)}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}; 