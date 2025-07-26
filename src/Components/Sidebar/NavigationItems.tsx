'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  Home, 
  Users, 
  BookOpen, 
  Calendar, 
  Settings, 
  MessageSquare,
  FileText,
  BarChart3
} from 'lucide-react'
import { useThemeStore } from '../../Stores/themeStore'

interface SidebarItem {
  id: string
  label: string
  icon: React.ComponentType<any>
  href: string
}

interface NavigationItemsProps {
  isOpen: boolean
}

const sidebarItems: SidebarItem[] = [
  { id: 'home', label: 'HOME', icon: Home, href: '/' },
  { id: 'students', label: 'STUDENTS', icon: Users, href: '/students' },
  { id: 'courses', label: 'COURSES', icon: BookOpen, href: '/courses' },
  { id: 'schedule', label: 'SCHEDULE', icon: Calendar, href: '/schedule' },
  { id: 'messages', label: 'MESSAGES', icon: MessageSquare, href: '/messages' },
  { id: 'documents', label: 'DOCUMENTS', icon: FileText, href: '/documents' },
  { id: 'analytics', label: 'ANALYTICS', icon: BarChart3, href: '/analytics' },
  { id: 'settings', label: 'SETTINGS', icon: Settings, href: '/settings' }
]

const NavigationItems: React.FC<NavigationItemsProps> = ({ isOpen }) => {
  const { isDarkMode } = useThemeStore()

  return (
    <nav className="flex-1 p-4">
      <ul className="space-y-2">
        {sidebarItems.map((item) => {
          const IconComponent = item.icon
          return (
            <li key={item.id}>
              <motion.button
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-bold rounded-lg transition-colors duration-200 ${
                  isDarkMode 
                    ? 'text-gray-300 hover:bg-gray-700 hover:text-gray-100' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span className={isOpen ? 'block' : 'hidden'}>{item.label}</span>
              </motion.button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default NavigationItems 