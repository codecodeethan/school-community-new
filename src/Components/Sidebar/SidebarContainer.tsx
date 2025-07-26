'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useThemeStore } from '../../Stores/themeStore'

interface SidebarContainerProps {
  children: React.ReactNode
  isOpen: boolean
}

const SidebarContainer: React.FC<SidebarContainerProps> = ({ children, isOpen }) => {
  const { isDarkMode } = useThemeStore()

  return (
    <motion.div
      initial={{ x: -256 }}
      animate={{ x: isOpen ? 0 : -256 }}
      transition={{ 
        type: "spring", 
        damping: 25, 
        stiffness: 200,
        duration: 0.3 
      }}
      className={`fixed top-12 left-0 h-full w-64 shadow-xl border-r z-50 transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gray-900 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}
    >
      {children}
    </motion.div>
  )
}

export default SidebarContainer 