'use client'

import React from 'react'
import { useThemeStore } from '../../Stores/themeStore'

interface NavbarContainerProps {
  children: React.ReactNode
}

const NavbarContainer: React.FC<NavbarContainerProps> = ({ children }) => {
  const { isDarkMode } = useThemeStore()

  return (
    <nav className={`transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gray-900 shadow-md border-b border-gray-700' 
        : 'bg-white shadow-md border-b border-gray-200'
    }`}>
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">
          {children}
        </div>
      </div>
    </nav>
  )
}

export default NavbarContainer 