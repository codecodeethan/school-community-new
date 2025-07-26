'use client'

import React from 'react'
import { useThemeStore } from '../../Stores/themeStore'

interface SidebarFooterProps {
  isOpen: boolean
}

const SidebarFooter: React.FC<SidebarFooterProps> = ({ isOpen }) => {
  const { isDarkMode } = useThemeStore()

  return (
    <div className={`p-4 border-t transition-colors duration-300 ${
      isDarkMode ? 'border-gray-700' : 'border-gray-200'
    } ${isOpen ? 'block' : 'hidden'}`}>
      <div className={`text-xs text-center transition-colors duration-300 ${
        isDarkMode ? 'text-gray-400' : 'text-gray-500'
      }`}>
        © 2024 School Community
      </div>
    </div>
  )
}

export default SidebarFooter 