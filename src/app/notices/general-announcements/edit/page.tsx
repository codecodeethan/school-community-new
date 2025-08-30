'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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

export default function EditNoticePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isDarkMode } = useThemeStore()
  const { user, isLoggedIn } = useAuthStore()
  const { getNotice, updateNotice, isLoading } = useAnnouncement()
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
  const [isLoadingNotice, setIsLoadingNotice] = useState(true)

  const noticeId = searchParams.get('id')

  // 공지사항 데이터 로드
  useEffect(() => {
    const loadNotice = async () => {
      if (!noticeId) {
        router.push('/notices/general-announcements')
        return
      }

      try {
        const notice = await getNotice(parseInt(noticeId))
        if (notice) {
          setTitle(notice.title)
          setContent(notice.content)
          setType(notice.type)
          setAttachments(notice.attachments || [])
        } else {
          router.push('/notices/general-announcements')
        }
      } catch (error) {
        console.error('Error loading notice:', error)
        router.push('/notices/general-announcements')
      } finally {
        setIsLoadingNotice(false)
      }
    }

    if (noticeId) {
      loadNotice()
    }
  }, [noticeId, getNotice, router])

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
    
    if (!noticeId) {
      return
    }

    if (!title.trim()) {
      return
    }

    const result = await updateNotice(parseInt(noticeId), {
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

  if (isLoadingNotice) {
    return (
      <>
        <Toaster position="bottom-right" richColors closeButton />
        <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
        }`}>
          <Navbar />
          <Sidebar />
          <main className="max-w-4xl mx-auto flex-1 w-full px-4 py-8">
            <div className={`text-center py-12 transition-colors duration-300 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Loading notice...
            </div>
          </main>
          <Footer />
        </div>
      </>
    )
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
