'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, User, Eye, FileText, Download, Clock, Tag } from 'lucide-react'
import { toast, Toaster } from 'sonner'
import { useAnnouncement } from '@/Hooks/useAnnouncement'
import { useAuthStore } from '@/Stores/authStore'
import { useThemeStore } from '@/Stores/themeStore'
import { Navbar } from '@/Components/Navbar'
import { Sidebar } from '@/Components/Sidebar'

interface Notice {
  id: number
  title: string
  content: string
  author: string
  type: string
  viewsCount: number
  attachments: string[]
  createdAt: string
}

export default function NoticeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { isDarkMode } = useThemeStore()
  const { user, isLoggedIn } = useAuthStore()
  const { getNotice, isLoading } = useAnnouncement()
  
  const [notice, setNotice] = useState<Notice | null>(null)
  const [isLoadingDetail, setIsLoadingDetail] = useState(true)

  const noticeId = params.id ? parseInt(params.id as string) : null

  useEffect(() => {
    if (noticeId) {
      loadNoticeDetail()
    }
  }, [noticeId])

  const loadNoticeDetail = async () => {
    if (!noticeId) return
    
    setIsLoadingDetail(true)
    try {
      const userId = user?.id
      const data = await getNotice(noticeId, userId)
      setNotice(data || null)
    } catch (error) {
      toast.error('Failed to load announcement')
      console.error('Error loading notice:', error)
    } finally {
      setIsLoadingDetail(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleBack = () => {
    router.push('/notices/general-announcements')
  }

  const handleDownload = (url: string) => {
    const link = document.createElement('a')
    link.href = url
    link.download = url.split('/').pop() || 'attachment'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getFileName = (url: string) => {
    try {
      const decodedUrl = decodeURIComponent(url)
      return decodedUrl.split('/').pop() || 'Unknown file'
    } catch {
      return url.split('/').pop() || 'Unknown file'
    }
  }

  if (isLoadingDetail) {
    return (
      <>
        <Toaster position="bottom-right" richColors closeButton />
        <div className={`min-h-screen transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-900' : 'bg-white'
        }`}>
          <Navbar />
          <Sidebar />
          <main className="max-w-4xl mx-auto flex-1 w-full px-4 py-8">
            {/* Back Button Skeleton */}
            <div className="animate-pulse mb-8">
              <div className={`h-10 rounded-lg w-48 ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`}></div>
            </div>
            
            {/* Main Content Skeleton */}
            <div className="animate-pulse">
              <div className={`rounded-2xl shadow-xl border overflow-hidden ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-100'
              }`}>
                {/* Header Skeleton */}
                <div className={`p-8 border-b ${
                  isDarkMode ? 'border-gray-700' : 'border-gray-100'
                }`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-6 h-6 rounded ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                    }`}></div>
                    <div className={`w-20 h-6 rounded-full ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                    }`}></div>
                  </div>
                  <div className={`h-12 rounded mb-6 ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}></div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                      }`}></div>
                      <div className={`w-24 h-4 rounded ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                      }`}></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                      }`}></div>
                      <div className={`w-32 h-4 rounded ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                      }`}></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                      }`}></div>
                      <div className={`w-20 h-4 rounded ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                      }`}></div>
                    </div>
                  </div>
                </div>
                
                {/* Content Skeleton */}
                <div className="p-8">
                  <div className="space-y-4">
                    <div className={`h-4 rounded w-full ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                    }`}></div>
                    <div className={`h-4 rounded w-3/4 ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                    }`}></div>
                    <div className={`h-4 rounded w-5/6 ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                    }`}></div>
                    <div className={`h-4 rounded w-2/3 ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                    }`}></div>
                    <div className={`h-4 rounded w-full ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                    }`}></div>
                    <div className={`h-4 rounded w-4/5 ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                    }`}></div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </>
    )
  }

  if (!notice) {
    return (
      <>
        <Toaster position="bottom-right" richColors closeButton />
        <div className={`min-h-screen transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-900' : 'bg-white'
        }`}>
          <Navbar />
          <Sidebar />
          <main className="max-w-4xl mx-auto flex-1 w-full px-4 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
                isDarkMode ? 'text-red-400' : 'text-red-500'
              }`}>
                Announcement Not Found
              </h1>
              <p className={`text-lg transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                The announcement you're looking for doesn't exist.
              </p>
              <button
                onClick={handleBack}
                className="mt-6 px-6 py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors duration-300"
              >
                Go Back
              </button>
            </motion.div>
          </main>
        </div>
      </>
    )
  }

  return (
    <>
      <Toaster position="bottom-right" richColors closeButton />
      <div className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-900' : 'bg-white'
      }`}>
        <Navbar />
        <Sidebar />

        <main className="max-w-4xl mx-auto flex-1 w-full px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Back Button */}
            <motion.button
              onClick={handleBack}
              className="flex items-center gap-2 mb-8 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowLeft size={20} />
              Back to Announcements
            </motion.button>

            {/* Main Content Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className={`rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-100'
              }`}
            >
              {/* Header Section */}
              <div className={`p-8 border-b transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-gray-800 text-gray-100 border-gray-700' 
                  : 'bg-white text-gray-900 border-gray-100'
              }`}>
                <div className="flex items-center gap-3 mb-4">
                  <Tag size={24} className="text-red-500" />
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors duration-300 ${
                    isDarkMode 
                      ? 'bg-red-900/30 text-red-400 border-red-700' 
                      : 'bg-red-50 text-red-500 border-red-200'
                  }`}>
                    {notice.type}
                  </span>
                </div>
                
                <h1 className={`text-4xl font-bold mb-6 leading-tight transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-100' : 'text-gray-900'
                }`}>
                  {notice.title}
                </h1>
                
                <div className={`flex items-center gap-6 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <div className="flex items-center gap-2">
                    <User size={18} className="text-red-500" />
                    <span className="font-medium">{notice.author}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-red-500" />
                    <span>{formatDate(notice.createdAt)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Eye size={18} className="text-red-500" />
                    <span>{notice.viewsCount} views</span>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className={`p-8 transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              }`}>
                {notice.content && notice.content !== "wysiwyg" ? (
                  <div 
                    className={`prose prose-lg max-w-none prose-red transition-colors duration-300 ${
                      isDarkMode ? 'prose-invert' : ''
                    }`}
                    dangerouslySetInnerHTML={{ __html: notice.content }}
                  />
                ) : (
                  <div className="text-center py-12">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300 ${
                      isDarkMode ? 'bg-red-900/30' : 'bg-red-100'
                    }`}>
                      <FileText size={32} className="text-red-500" />
                    </div>
                    <p className={`text-lg transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      No content available
                    </p>
                  </div>
                )}
              </div>

              {/* Attachments Section */}
              {notice.attachments && notice.attachments.length > 0 && (
                <div className={`border-t p-8 transition-colors duration-300 ${
                  isDarkMode 
                    ? 'border-gray-700 bg-gray-900/50' 
                    : 'border-gray-100 bg-gray-50'
                }`}>
                  <div className="flex items-center gap-3 mb-6">
                    <FileText size={24} className="text-red-500" />
                    <h3 className={`text-xl font-semibold transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-100' : 'text-gray-900'
                    }`}>
                      Attachments ({notice.attachments.length})
                    </h3>
                  </div>
                  
                  <div className="space-y-3">
                    {notice.attachments.map((attachment, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                        className={`flex items-center justify-between p-4 rounded-lg border transition-colors duration-300 ${
                          isDarkMode 
                            ? 'bg-gray-800 border-gray-600 hover:border-red-500' 
                            : 'bg-white border-gray-200 hover:border-red-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                            isDarkMode ? 'bg-red-900/30' : 'bg-red-100'
                          }`}>
                            <FileText size={20} className="text-red-500" />
                          </div>
                          <div>
                            <span className={`font-medium transition-colors duration-300 ${
                              isDarkMode ? 'text-gray-100' : 'text-gray-900'
                            }`}>
                              {getFileName(attachment)}
                            </span>
                          </div>
                        </div>
                        
                        <motion.button
                          onClick={() => handleDownload(attachment)}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors duration-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="button"
                        >
                          <Download size={16} />
                          Download
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        </main>
      </div>
    </>
  )
} 