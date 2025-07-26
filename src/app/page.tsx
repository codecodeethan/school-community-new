'use client'

import { Navbar } from '@/Components/Navbar'
import { Sidebar } from '@/Components/Sidebar'
import { useThemeStore } from '@/Stores/themeStore'
import React from 'react'

const page = () => {
  const { isDarkMode } = useThemeStore()

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
    }`}>
      <Navbar />
      <Sidebar />
      <main className='pt-12 px-4'>
        <div className='max-w-7xl mx-auto'>
          <h1 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
            isDarkMode ? 'text-gray-100' : 'text-gray-900'
          }`}>
            Welcome to School Community
          </h1>
          <p className={`transition-colors duration-300 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            This is the main content area.
          </p>
        </div>
      </main>
    </div>
  )
}

export default page
