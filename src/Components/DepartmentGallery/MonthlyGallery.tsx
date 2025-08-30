"use client"

import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useThemeStore } from "@/Stores/themeStore";
import { EventPhoto, months } from '@/Utils/DepartmentGalleryUtils';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface MonthlyGalleryProps {
  events: EventPhoto[];
  selectedYear: number;
  openDropdown: number | null;
  onDropdownToggle: (eventId: number) => void;
  onEdit: (eventId: number) => void;
  onDelete: (eventId: number) => void;
}

export const MonthlyGallery: React.FC<MonthlyGalleryProps> = ({
  events,
  selectedYear,
  openDropdown,
  onDropdownToggle,
  onEdit,
  onDelete
}) => {
  const { isDarkMode } = useThemeStore();

  const getEventsByMonth = (month: number) => {
    return events.filter(event => event.year === selectedYear && event.month === month);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="space-y-8"
    >
      {months.map((month, index) => {
        const monthEvents = getEventsByMonth(month.number);
        
        if (monthEvents.length === 0) return null;

        return (
          <div key={month.number} className="space-y-4">
            <h2 className={`text-2xl font-bold transition-colors duration-300 ${
              isDarkMode ? 'text-gray-100' : 'text-gray-900'
            }`}>
              {month.name} {selectedYear}
            </h2>
            
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={20}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                },
                768: {
                  slidesPerView: 3,
                },
                1024: {
                  slidesPerView: 4,
                },
              }}
              className={`transition-colors duration-300 ${
                isDarkMode ? 'swiper-dark' : 'swiper-light'
              }`}
            >
              {monthEvents.map((event) => (
                <SwiperSlide key={event.id}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl cursor-pointer relative ${
                      isDarkMode ? 'bg-gray-800' : 'bg-white'
                    }`}
                    onClick={() => {
                      // Google Drive URL이 있으면 새창에서 열기
                      if (event.googleDriveUrl) {
                        window.open(event.googleDriveUrl, '_blank', 'noopener,noreferrer');
                      }
                    }}
                  >
                    {/* 드롭다운 메뉴 */}
                    <div className="absolute top-2 right-2 z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDropdownToggle(event.id);
                        }}
                        className={`p-2 rounded-full transition-all duration-300 ${
                          isDarkMode
                            ? 'bg-gray-800/80 hover:bg-gray-700/80 text-gray-300'
                            : 'bg-white/80 hover:bg-gray-100/80 text-gray-700'
                        }`}
                      >
                        <MoreHorizontal size={16} />
                      </button>
                      
                      <AnimatePresence>
                        {openDropdown === event.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            transition={{ duration: 0.15 }}
                            className={`absolute right-0 mt-2 w-32 rounded-lg shadow-lg border ${
                              isDarkMode
                                ? 'bg-gray-700 border-gray-600'
                                : 'bg-white border-gray-200'
                            }`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="py-1">
                              <button
                                onClick={() => onEdit(event.id)}
                                className={`w-full px-4 py-2 text-sm flex items-center gap-2 transition-colors duration-300 ${
                                  isDarkMode
                                    ? 'text-gray-300 hover:bg-gray-600'
                                    : 'text-gray-700 hover:bg-gray-100'
                                }`}
                              >
                                <Edit size={14} />
                                Edit
                              </button>
                              <button
                                onClick={() => onDelete(event.id)}
                                className={`w-full px-4 py-2 text-sm flex items-center gap-2 transition-colors duration-300 ${
                                  isDarkMode
                                    ? 'text-red-400 hover:bg-gray-600'
                                    : 'text-red-600 hover:bg-gray-100'
                                }`}
                              >
                                <Trash2 size={14} />
                                Delete
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    
                    <div className="relative">
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-64 object-cover"
                      />
                      <div className={`absolute top-0 left-0 right-0 p-3`}>
                        <span className={`inline-block px-2 py-1 text-sm font-medium text-white bg-red-500 rounded-md shadow-lg`}>
                          {new Date(event.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className={`font-semibold mb-2 transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-100' : 'text-gray-900'
                      }`}>
                        {event.title}
                      </h3>
                      <p className={`text-sm transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {event.description}
                      </p>
                      {event.googleDriveUrl && (
                        <p className={`text-xs mt-2 transition-colors duration-300 ${
                          isDarkMode ? 'text-blue-400' : 'text-blue-600'
                        }`}>
                          Click to view photos →
                        </p>
                      )}
                    </div>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        );
      })}
    </motion.div>
  );
}; 