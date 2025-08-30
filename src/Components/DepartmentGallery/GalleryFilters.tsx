"use client"

import React from 'react';
import { motion } from "framer-motion";
import { useThemeStore } from "@/Stores/themeStore";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

interface GalleryFiltersProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
}

export const GalleryFilters: React.FC<GalleryFiltersProps> = ({
  selectedYear,
  onYearChange
}) => {
  const { isDarkMode } = useThemeStore();
  
  // 년도 옵션 (2020-2025)
  const yearOptions = [];
  for (let year = 2025; year >= 2020; year--) {
    yearOptions.push(year);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="mb-8"
    >
      <Swiper
        modules={[Navigation]}
        spaceBetween={16}
        slidesPerView={2}
        navigation
        breakpoints={{
          480: {
            slidesPerView: 3,
          },
          640: {
            slidesPerView: 4,
          },
          768: {
            slidesPerView: 5,
          },
          1024: {
            slidesPerView: 6,
          },
        }}
        className={`transition-colors duration-300 ${
          isDarkMode ? 'swiper-dark' : 'swiper-light'
        }`}
      >
        {yearOptions.map(year => (
          <SwiperSlide key={year}>
            <button
              onClick={() => onYearChange(year)}
              className={`w-full px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 ${
                selectedYear === year
                  ? isDarkMode
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'bg-red-500 text-white shadow-lg'
                  : isDarkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {year}
            </button>
          </SwiperSlide>
        ))}
      </Swiper>
    </motion.div>
  );
}; 