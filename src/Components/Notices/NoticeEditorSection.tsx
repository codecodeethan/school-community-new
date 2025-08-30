import React from 'react'
import ToastEditor from '@/Components/Editor/ToastEditor'

interface NoticeEditorSectionProps {
  content: string
  setContent: (content: string) => void
  isDarkMode: boolean
  onImageUpload: (imageUrl: string) => void
  isEditMode?: boolean
}

export default function NoticeEditorSection({ 
  content, 
  setContent, 
  isDarkMode, 
  onImageUpload,
  isEditMode = false
}: NoticeEditorSectionProps) {
  return (
    <div className="mb-6">
      <label className={`block mb-2 text-sm font-medium transition-colors duration-300 ${
        isDarkMode ? 'text-gray-300' : 'text-gray-700'
      }`}>
        Content
      </label>
      <ToastEditor
        content={content}
        onChange={setContent}
        placeholder=""
        isDarkMode={isDarkMode}
        onImageUpload={onImageUpload}
        isEditMode={isEditMode}
      />
    </div>
  )
} 