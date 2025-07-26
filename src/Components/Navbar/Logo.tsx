'use client'

import Image from 'next/image'
import { useThemeStore } from '../../Stores/themeStore'

const Logo = () => {
  const { isDarkMode } = useThemeStore()

  return (
    <div className="flex items-center space-x-3">
      <Image
        src={isDarkMode ? "/RIS-logo-black.webp" : "/RIS-logo-white.webp"}
        alt="RIS Logo"
        width={120}
        height={40}
        className="h-8 w-auto"
      />
      <div className="hidden md:block">
        <h1 className={`text-lg font-bold transition-colors duration-300 ${
          isDarkMode ? 'text-gray-100' : 'text-gray-900'
        }`}>
          Ruamrudee International School
        </h1>
      </div>
    </div>
  )
}

export default Logo 