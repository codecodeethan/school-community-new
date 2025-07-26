'use client'

import React from 'react'
import { useThemeStore } from '../../Stores/themeStore'

interface SidebarHeaderProps {
  isOpen: boolean
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ isOpen }) => {
  const { isDarkMode } = useThemeStore()

  return (
    <div className={`p-4 border-b transition-colors duration-300 ${
      isDarkMode ? 'border-gray-700' : 'border-gray-200'
    }`}>
      <h2 className={`font-bold transition-colors duration-300 ${
        isDarkMode ? 'text-gray-100' : 'text-gray-800'
      } ${isOpen ? 'text-lg' : 'text-sm'}`}>
        {isOpen ? 'SCHOOL COMMUNITY' : 'SC'}
      </h2>
    </div>
  )
}

export default SidebarHeader 