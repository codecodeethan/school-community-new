'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Navbar } from '@/Components/Navbar'
import { Sidebar } from '@/Components/Sidebar'
import { Footer } from '@/Components/Footer'
import { useThemeStore } from '@/Stores/themeStore'
import { useAuthStore } from '@/Stores/authStore'
import { useAnnouncement } from '@/Hooks/useAnnouncement'
import { useFileCleanup } from '@/Hooks/useFileCleanup'
import { Toaster } from 'sonner'

// 분리된 컴포넌트들
import {
  CreateNoticeHeader,
  NoticeFormFields,
  NoticeEditorSection,
  NoticeFileUploadSection,
  NoticeFormActions
} from '@/Components/Notices'

export default function CreateNoticePage() {
  const router = useRouter()
  const { isDarkMode } = useThemeStore()
  const { user, isLoggedIn } = useAuthStore()
  const { createNotice, isLoading } = useAnnouncement()
  const {
    cleanupUploadedFiles,
    handleEditorImageUpload,
    handleDocumentUpload,
    handleDocumentRemove,
    resetTracking
  } = useFileCleanup()
  
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [type, setType] = useState('Notice')
  const [attachments, setAttachments] = useState<string[]>([])

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login')
      return
    }
    
    if (!user || user.role !== 'adminStudent') {
      router.push('/notices/general-announcements')
      return
    }
  }, [isLoggedIn, user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
  
    
    if (!title.trim()) {
      return
    }


    const result = await createNotice({
      title: title.trim(),
      content,
      type,
      attachments,
    })


    if (result) {
      resetTracking()
      router.push('/notices/general-announcements')
    } 
  }

  const handleCancel = () => {
    // 취소 시 업로드된 파일들 정리
    cleanupUploadedFiles()
    router.push('/notices/general-announcements')
  }

  if (!isLoggedIn || !user || user.role !== 'adminStudent') {
    return null
  }

  return (
    <>
      <Toaster position="bottom-right" richColors closeButton />
      <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <Navbar />
        <Sidebar />

        <main className="max-w-4xl mx-auto flex-1 w-full px-4 py-8">
          <CreateNoticeHeader 
            isDarkMode={isDarkMode} 
            onCancel={handleCancel} 
          />

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            onSubmit={handleSubmit}
            className={`rounded-2xl p-6 transition-colors duration-300 ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-lg border ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}
          >
            <NoticeFormFields
              title={title}
              setTitle={setTitle}
              type={type}
              setType={setType}
              isDarkMode={isDarkMode}
            />

            <NoticeEditorSection
              content={content}
              setContent={setContent}
              isDarkMode={isDarkMode}
              onImageUpload={handleEditorImageUpload}
            />

            <NoticeFileUploadSection
              attachments={attachments}
              onAttachmentsChange={setAttachments}
              isDarkMode={isDarkMode}
              onFileUpload={handleDocumentUpload}
              onFileRemove={handleDocumentRemove}
            />

            <NoticeFormActions
              isLoading={isLoading}
              title={title}
              onCancel={handleCancel}
              onSubmit={handleSubmit}
            />
          </motion.form>
        </main>
        
        <Footer />
      </div>
    </>
  )
} 