import React from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

interface CreateNoticeHeaderProps {
  isDarkMode: boolean
  onCancel: () => void
  isEdit?: boolean
}

export default function CreateNoticeHeader({ isDarkMode, onCancel, isEdit = false }: CreateNoticeHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-8"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onCancel}
            className={`p-2 rounded-lg transition-colors duration-300 ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            }`}
          >
            <ArrowLeft className={`w-5 h-5 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`} />
          </button>
          <div>
            <h1 className={`text-3xl font-bold mb-2 transition-colors duration-300 ${
              isDarkMode ? 'text-gray-100' : 'text-gray-900'
            }`}>
              {isEdit ? 'Edit Announcement' : 'Create Announcement'}
            </h1>
            <p className={`text-lg transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {isEdit ? 'Update the announcement information' : 'Share important information with the community'}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
} 