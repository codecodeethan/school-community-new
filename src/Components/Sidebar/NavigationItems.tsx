'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home, 
  Users, 
  BookOpen, 
  Calendar, 
  Settings, 
  MessageSquare,
  FileText,
  BarChart3,
  ChevronDown,
  ChevronRight
} from 'lucide-react'
import { useThemeStore } from '../../Stores/themeStore'

interface SidebarItem {
  id: string
  label: string
  icon: React.ComponentType<any>
  href?: string
  subItems?: {
    id: string
    label: string
    href: string
  }[]
}

interface NavigationItemsProps {
  isOpen: boolean
}

const sidebarItems: SidebarItem[] = [
  { id: 'home', label: 'HOME', icon: Home, href: '/' },
  { id: 'sc_members', label: 'SC MEMBERS', icon: Users, href: '/sc' },
  { 
    id: 'notice_board', 
    label: 'NOTICE BOARD', 
    icon: FileText,
    subItems: [
      { id: 'general_announcements', label: 'General Announcements', href: '/notices/general-announcements' },
      { id: 'public_relations', label: 'Public Relations', href: '/notices/public-relations' },
      { id: 'hall_functions', label: 'Hall Functions', href: '/notices/hall-functions' },
      { id: 'spirit', label: 'Spirit', href: '/notices/spirit' },
      { id: 'facility', label: 'Facility', href: '/notices/facility' }
    ]
  },
  { id: 'inquiry', label: 'INQUIRY', icon: MessageSquare, href: '/inquiry' },
  { id: 'settings', label: 'SETTINGS', icon: Settings, href: '/settings' }
]

const NavigationItems: React.FC<NavigationItemsProps> = ({ isOpen }) => {
  const { isDarkMode } = useThemeStore()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const isExpanded = (itemId: string) => expandedItems.includes(itemId)

  return (
    <nav className="flex-1 p-4">
      <ul className="space-y-2">
        {sidebarItems.map((item) => {
          const IconComponent = item.icon
          const hasSubItems = item.subItems && item.subItems.length > 0
          
          return (
            <li key={item.id}>
              {hasSubItems ? (
                <div>
                  <motion.button
                    onClick={() => toggleExpanded(item.id)}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm font-bold rounded-lg transition-colors duration-200 ${
                      isDarkMode 
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-gray-100' 
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <IconComponent className="w-5 h-5" />
                      {isOpen && <span>{item.label}</span>}
                    </div>
                    {isOpen && (
                      <motion.div
                        animate={{ rotate: isExpanded(item.id) ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </motion.div>
                    )}
                  </motion.button>
                  
                  <AnimatePresence>
                    {isExpanded(item.id) && isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <ul className="ml-6 mt-2 space-y-1">
                          {item.subItems?.map((subItem) => (
                            <li key={subItem.id}>
                              <Link href={subItem.href} className="block">
                                <motion.div
                                  whileHover={{ x: 4 }}
                                  whileTap={{ scale: 0.95 }}
                                  className={`px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${
                                    isDarkMode 
                                      ? 'text-gray-400 hover:bg-gray-700 hover:text-gray-200' 
                                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                                  }`}
                                >
                                  {subItem.label}
                                </motion.div>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link href={item.href || '#'} className="block">
                  <motion.div
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-bold rounded-lg transition-colors duration-200 ${
                      isDarkMode 
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-gray-100' 
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    {isOpen && <span>{item.label}</span>}
                  </motion.div>
                </Link>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default NavigationItems 