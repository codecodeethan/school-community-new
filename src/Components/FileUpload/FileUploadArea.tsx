'use client'

import React, { useRef, useState } from 'react'
import { Upload, X, File, Paperclip, Trash2 } from 'lucide-react'
import { uploadDocument, deleteFile, validateDocumentFile } from '@/Utils/upload'
import { toast } from 'sonner'

interface FileUploadAreaProps {
  attachments: string[]
  onAttachmentsChange: (attachments: string[]) => void
  isDarkMode?: boolean
  onFileUpload?: (fileUrl: string) => void
  onFileRemove?: (fileUrl: string) => void
  originalAttachments?: string[]
}

const FileUploadArea: React.FC<FileUploadAreaProps> = ({
  attachments,
  onAttachmentsChange,
  isDarkMode = false,
  onFileUpload,
  onFileRemove,
  originalAttachments = []
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFileUpload = async (file: File) => {
    const validationError = validateDocumentFile(file)
    
    if (validationError) {
      toast.error(validationError)
      return
    }

    try {
      toast.loading('Uploading file...')
      
      const result = await uploadDocument(file)
      
      toast.dismiss()
      
      if (result.success && result.fileUrl) {
        const newAttachments = [...attachments, result.fileUrl]
        onAttachmentsChange(newAttachments)
        
        // 부모 컴포넌트에 알림
        if (onFileUpload) {
          onFileUpload(result.fileUrl)
        }
        
        toast.success('File uploaded successfully!')
      } else {
        toast.error(result.message || 'Upload failed')
      }
    } catch (error) {
      toast.dismiss()
      toast.error('Upload failed')
      console.error('Upload error:', error)
    }
  }

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const removeAttachment = async (index: number) => {
    const fileUrl = attachments[index]
    
    try {
      // 기존 첨부파일인지 확인 (Edit 모드에서만)
      const isOriginalFile = originalAttachments.includes(fileUrl)
      
      if (isOriginalFile) {
        // 기존 파일은 백엔드에서 삭제하지 않고 프론트엔드에서만 제거
        const newAttachments = attachments.filter((_, i) => i !== index)
        onAttachmentsChange(newAttachments)
        
        // 부모 컴포넌트에 알림
        if (onFileRemove) {
          onFileRemove(fileUrl)
        }
        
        toast.success('File removed from list!')
      } else {
        // 새로 업로드된 파일은 백엔드에서도 삭제
        const result = await deleteFile(fileUrl)
        
        if (result.success) {
          // 프론트엔드에서도 제거
          const newAttachments = attachments.filter((_, i) => i !== index)
          onAttachmentsChange(newAttachments)
          
          // 부모 컴포넌트에 알림
          if (onFileRemove) {
            onFileRemove(fileUrl)
          }
          
          toast.success('File removed successfully!')
        } else {
          toast.error(result.message || 'Failed to remove file')
        }
      }
    } catch (error) {
      toast.error('Failed to remove file')
      console.error('Remove error:', error)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    files.forEach(file => {
      handleFileUpload(file)
    })
  }

  // 파일명 추출 및 표시 개선
  const getFileName = (url: string) => {
    try {
      // URL에서 파일명 추출
      const filename = url.split('/').pop() || 'Unknown file'
      
      // URL 디코딩 시도
      try {
        return decodeURIComponent(filename)
      } catch {
        return filename
      }
    } catch (error) {
      return 'Unknown file'
    }
  }

  return (
    <div className="space-y-4">
      {/* 파일 업로드 영역 */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 transition-all duration-300 ${
          isDragging
            ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
            : isDarkMode
              ? 'border-gray-600 bg-gray-800/50'
              : 'border-gray-300 bg-gray-50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <Upload className={`mx-auto h-12 w-12 mb-4 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <h3 className={`text-lg font-medium mb-2 transition-colors duration-300 ${
            isDarkMode ? 'text-gray-200' : 'text-gray-900'
          }`}>
            Upload Files
          </h3>
          <p className={`text-sm mb-4 transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Drag and drop any files here, or click the button below
          </p>
          
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleFileSelect}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                isDarkMode
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              <Upload className="w-4 h-4" />
              Upload Files
            </button>
          </div>
          
          <p className={`text-xs mt-3 transition-colors duration-300 ${
            isDarkMode ? 'text-gray-500' : 'text-gray-500'
          }`}>
            All file types supported (Max 50MB per file)
          </p>
        </div>
      </div>

      {/* 첨부파일 목록 */}
      {attachments.length > 0 && (
        <div className={`rounded-lg border transition-colors duration-300 ${
          isDarkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-200 bg-white'
        }`}>
          <div className={`p-4 border-b transition-colors duration-300 ${
            isDarkMode ? 'border-gray-600' : 'border-gray-200'
          }`}>
            <h4 className={`font-medium transition-colors duration-300 ${
              isDarkMode ? 'text-gray-200' : 'text-gray-900'
            }`}>
              Attached Files ({attachments.length})
            </h4>
          </div>
          
          <div className="p-4 space-y-3">
            {attachments.map((attachment, index) => {
              const fileName = getFileName(attachment)
              
              return (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg transition-colors duration-300 ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                  } border ${
                    isDarkMode ? 'border-gray-600' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`p-2 rounded-lg ${
                      isDarkMode ? 'bg-green-900/30' : 'bg-green-100'
                    }`}>
                      <File className={`w-4 h-4 ${
                        isDarkMode ? 'text-green-400' : 'text-green-600'
                      }`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-900'
                      }`} title={fileName}>
                        {fileName}
                      </p>
                      <p className={`text-xs transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        File
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <a
                      href={attachment}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-2 rounded-lg transition-colors duration-300 ${
                        isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                      }`}
                      title="Download file"
                    >
                      <Paperclip className={`w-4 h-4 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`} />
                    </a>
                    
                    <button
                      onClick={() => removeAttachment(index)}
                      className={`p-2 rounded-lg transition-colors duration-300 ${
                        isDarkMode ? 'hover:bg-red-900/30' : 'hover:bg-red-100'
                      }`}
                      title="Remove file"
                    >
                      <Trash2 className={`w-4 h-4 ${
                        isDarkMode ? 'text-red-400' : 'text-red-500'
                      }`} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 숨겨진 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="*/*"
        onChange={(e) => {
          const files = Array.from(e.target.files || [])
          files.forEach(file => {
            handleFileUpload(file)
          })
          e.target.value = ''
        }}
        className="hidden"
      />
    </div>
  )
}

export default FileUploadArea 