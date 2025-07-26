'use client'

import React from 'react'
import { Menu, X } from 'lucide-react'
import { useThemeStore } from '../../Stores/themeStore'

interface ToggleButtonProps {
  isOpen: boolean
  onToggle: () => void
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ isOpen, onToggle }) => {
  const { isDarkMode } = useThemeStore()

  return (
    <button
      onClick={onToggle}
      className={`absolute -right-12 top-4 p-2 border rounded-full shadow-md transition-colors duration-200 z-10 ${
        isDarkMode 
          ? 'bg-gray-800 border-gray-600 hover:bg-gray-700' 
          : 'bg-white border-gray-200 hover:bg-gray-50'
      }`}
    >
      {isOpen ? (
        <X className={`w-5 h-5 transition-colors duration-300 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`} />
      ) : (
        <Menu className={`w-5 h-5 transition-colors duration-300 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`} />
      )}
    </button>
  )
}

export default ToggleButton 