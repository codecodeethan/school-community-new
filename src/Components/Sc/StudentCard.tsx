"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Instagram, MapPin } from 'lucide-react';
import { Student } from '@/Constants/ScData';
import { useThemeStore } from '@/Stores/themeStore';



interface StudentCardProps {
  student: Student;
  index: number;
}

const StudentCard: React.FC<StudentCardProps> = ({ student, index }) => {
  const { isDarkMode } = useThemeStore();
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className="relative w-full h-80 cursor-pointer perspective-1000"
        onClick={handleCardClick}
      >
      <div
        className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        <div className={`absolute inset-0 w-full h-full rounded-2xl shadow-lg overflow-hidden ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="relative w-full h-full">
            <img
              src={student.image}
              alt={student.name}
              className="w-full h-full object-cover"
              style={{
                objectPosition: 'center 85%'
              }}
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-2xl font-bold mb-2">{student.name}</h3>
              {student.grade && (
                <p className="text-sm opacity-90 mb-1">{student.grade}</p>
              )}
              <p className="text-base opacity-90 mb-3">{student.role}</p>
            </div>
          </div>
        </div>

        <div className={`absolute inset-0 w-full h-full rounded-2xl shadow-lg ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } rotate-y-180 backface-hidden`}>
          <div className="p-6 h-full flex flex-col justify-between">
            <div>
              <h3 className={`text-2xl font-bold mb-3 ${
                isDarkMode ? 'text-gray-100' : 'text-gray-900'
              }`}>
                {student.name}
              </h3>
              {student.grade && (
                <p className={`text-sm mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {student.grade}
                </p>
              )}
              <p className={`text-base mb-4 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {student.role}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-red-500" />
                <span className={`text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {student.contact}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Instagram className="w-4 h-4 text-red-500" />
                <span className={`text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {student.instagram}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StudentCard; 