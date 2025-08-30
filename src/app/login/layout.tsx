'use client'

import { Navbar } from '@/Components/Navbar'
import { Sidebar } from '@/Components/Sidebar'
import { Footer } from '@/Components/Footer'
import { useThemeStore } from '@/Stores/themeStore'
import React from 'react'

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isDarkMode } = useThemeStore()

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
    }`}>
      <Navbar />
      <Sidebar />
      <main className='flex-1 pt-12 px-4 flex justify-center items-center'>
        {children}
      </main>
      <Footer />
    </div>
  )
} 