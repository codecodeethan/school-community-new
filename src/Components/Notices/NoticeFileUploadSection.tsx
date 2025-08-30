import React from 'react'
import FileUploadArea from '@/Components/FileUpload/FileUploadArea'

interface NoticeFileUploadSectionProps {
  attachments: string[]
  onAttachmentsChange: (attachments: string[]) => void
  isDarkMode: boolean
  onFileUpload: (documentUrl: string) => void
  onFileRemove: (documentUrl: string) => void
  originalAttachments?: string[]
}

export default function NoticeFileUploadSection({ 
  attachments, 
  onAttachmentsChange, 
  isDarkMode, 
  onFileUpload, 
  onFileRemove,
  originalAttachments = []
}: NoticeFileUploadSectionProps) {
  return (
    <div className="mb-6">
      <label className={`block mb-2 text-sm font-medium transition-colors duration-300 ${
        isDarkMode ? 'text-gray-300' : 'text-gray-700'
      }`}>
        Attachments
      </label>
      <FileUploadArea
        attachments={attachments}
        onAttachmentsChange={onAttachmentsChange}
        isDarkMode={isDarkMode}
        onFileUpload={onFileUpload}
        onFileRemove={onFileRemove}
        originalAttachments={originalAttachments}
      />
    </div>
  )
} 