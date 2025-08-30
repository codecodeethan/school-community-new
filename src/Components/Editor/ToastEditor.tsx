'use client'

import React, { useRef, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import '@toast-ui/editor/dist/toastui-editor.css';
import { uploadImage, deleteImage, validateImageFile, ALLOWED_IMAGE_TYPES } from '@/Utils/upload'
import { toast } from 'sonner'

// SSR 에러 방지를 위한 dynamic import
const Editor = dynamic(() => import('@toast-ui/react-editor').then(mod => mod.Editor), {
  ssr: false,
  loading: () => <div className="h-[300px] bg-gray-100 animate-pulse rounded-lg"></div>
})

interface ToastEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  isDarkMode?: boolean
  onImageUpload?: (imageUrl: string) => void
  isEditMode?: boolean
}

const ToastEditor: React.FC<ToastEditorProps> = ({ 
  content, 
  onChange, 
  placeholder = "",
  isDarkMode = false,
  onImageUpload,
  isEditMode = false
}) => {
  const imageInputRef = useRef<HTMLInputElement>(null)
  const editorRef = useRef<any>(null)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [isEditorReady, setIsEditorReady] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // 에디터 초기화 완료 감지
  useEffect(() => {
    const checkEditorReady = () => {
      if (editorRef.current) {
        const editorInstance = editorRef.current.getInstance()
        if (editorInstance) {
          setIsEditorReady(true)
          
          // Edit 모드에서 기존 이미지들 추적
          if (isEditMode && content) {
            const imageRegex = /<img[^>]+src="([^">]+)"/g
            const existingImages: string[] = []
            let match
            
            while ((match = imageRegex.exec(content)) !== null) {
              const imageUrl = match[1]
              // 상대 경로로 변환
              const relativeUrl = imageUrl.replace(/^https?:\/\/[^\/]+/, '')
              existingImages.push(relativeUrl)
            }
            
            setUploadedImages(existingImages)
          }
          
          // 초기 텍스트 완전 제거
          setTimeout(() => {
            try {
              const markdown = editorInstance.getMarkdown()
              const html = editorInstance.getHTML()
              
              // 초기 기본 텍스트들 제거
              const cleanMarkdown = markdown
                .replace(/^Write\s*\n?/g, '')
                .replace(/^Preview\s*\n?/g, '')
                .replace(/^Start writing your announcement\.\.\.\s*\n?/g, '')
                .replace(/^Markdown\s*\n?/g, '')
                .replace(/^WYSIWYG\s*\n?/g, '')
                .trim()
              
              const cleanHtml = html
                .replace(/<p>Write<\/p>/g, '')
                .replace(/<p>Preview<\/p>/g, '')
                .replace(/<p>Start writing your announcement\.\.\.<\/p>/g, '')
                .replace(/<p>Markdown<\/p>/g, '')
                .replace(/<p>WYSIWYG<\/p>/g, '')
                .replace(/<p><\/p>/g, '')
                .trim()
              
              if (cleanMarkdown !== markdown || cleanHtml !== html) {
                editorInstance.setMarkdown(cleanMarkdown)
              }
              
              setIsInitialized(true)
            } catch (error) {
              console.error('Editor initialization error:', error)
              setIsInitialized(true)
            }
          }, 200)
        }
      }
    }

    // 에디터가 마운트된 후 체크
    const timer = setTimeout(checkEditorReady, 500)
    return () => clearTimeout(timer)
  }, [isEditMode, content])

  // 에디터 내용 변경 감지 및 이미지 추적
  const handleEditorChange = (newContent: string) => {
    if (!isInitialized) {
      return 
    }
    
    
    // HTML 형식으로 내용 추출
    if (editorRef.current && isEditorReady) {
      const editorInstance = editorRef.current.getInstance()
      const html = editorInstance.getHTML()
      const markdown = editorInstance.getMarkdown()
      
      // HTML에서 불필요한 텍스트 제거
      const cleanHtml = html
        .replace(/<p>Write<\/p>/g, '')
        .replace(/<p>Preview<\/p>/g, '')
        .replace(/<p>Start writing your announcement\.\.\.<\/p>/g, '')
        .replace(/<p>Markdown<\/p>/g, '')
        .replace(/<p>WYSIWYG<\/p>/g, '')
        .replace(/<p><\/p>/g, '')
        .trim()
      
      
      // 실제 사용자 입력 내용만 전달 (HTML 형식)
      if (cleanHtml && cleanHtml !== '<p></p>' && cleanHtml !== '') {
        onChange(cleanHtml)
      } else {
        onChange('')
      }
    }
    
    // 에디터에서 이미지 URL 추출 (HTML 기반으로 변경)
    if (editorRef.current && isEditorReady) {
      const editorInstance = editorRef.current.getInstance()
      const html = editorInstance.getHTML()
      
      // HTML에서 이미지 URL 추출
      const imageRegex = /<img[^>]+src="([^">]+)"/g
      const currentImages: string[] = []
      let match
      
      while ((match = imageRegex.exec(html)) !== null) {
        const imageUrl = match[1]
        // 상대 경로로 변환하여 저장
        const relativeUrl = imageUrl.replace(/^https?:\/\/[^\/]+/, '')
        currentImages.push(relativeUrl)
      }
      
      
      // 삭제된 이미지 찾기
      const deletedImages = uploadedImages.filter(img => !currentImages.includes(img))
      
      // 삭제된 이미지를 백엔드에서도 삭제
      deletedImages.forEach(async (imageUrl) => {
        try {
          await deleteImage(imageUrl)
        } catch (error) {
          console.error('Failed to delete image from server:', imageUrl, error)
        }
      })
      
      // 새로운 이미지 목록 업데이트
      setUploadedImages(currentImages)
    }
  }

  const handleImageUpload = async (file: File) => {
    const validationError = validateImageFile(file)
    
    if (validationError) {
      toast.error(validationError)
      return
    }

    try {
      toast.loading('Uploading image...')
      
      const result = await uploadImage(file)
      
      toast.dismiss()
      
      if (result.success && result.fileUrl) {
        // 에디터에 이미지 삽입
        if (editorRef.current && isEditorReady) {
          const editorInstance = editorRef.current.getInstance()
          
          // 백엔드에서 완전한 URL을 받으므로 그대로 사용
          const fullImageUrl = result.fileUrl
          
          // 이미지 삽입
          editorInstance.insertImage({
            imageUrl: fullImageUrl,
            altText: file.name
          })
          
          // 업로드된 이미지 목록에 추가 (상대 경로로 저장)
          const relativeUrl = result.fileUrl.replace(/^https?:\/\/[^\/]+/, '')
          setUploadedImages(prev => [...prev, relativeUrl])
          
          // 부모 컴포넌트에 알림 (상대 경로로 전달)
          if (onImageUpload) {
            onImageUpload(relativeUrl)
          }
          
        }
        toast.success('Image uploaded successfully!')
      } else {
        toast.error(result.message || 'Upload failed')
      }
    } catch (error) {
      toast.dismiss()
      toast.error('Upload failed')
      console.error('Upload error:', error)
    }
  }

  const handleImageSelect = () => {
    imageInputRef.current?.click()
  }

  useEffect(() => {
    return () => {
      // Edit 모드에서는 기존 이미지들을 삭제하지 않음
      // Create 모드에서도 content가 있는 경우 이미지 삭제하지 않음
      if (!isEditMode && (!content || content.trim() === '')) {
        uploadedImages.forEach(async (imageUrl) => {
          try {
            await deleteImage(imageUrl)
          } catch (error) {
            console.error('Failed to clean up image from server:', imageUrl, error)
          }
        })
      }
    }
  }, [uploadedImages, isEditMode, content])

  return (
    <div className="space-y-4">
      <div className={`border rounded-lg overflow-hidden transition-colors duration-300 ${
        isDarkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-white'
      }`}>
        <Editor
          ref={editorRef}
          initialValue={content || ""}
          previewStyle="vertical"
          height="300px"
          initialEditType="wysiwyg"
          useCommandShortcut={false}
          placeholder={placeholder}
          onChange={handleEditorChange}
          hooks={{
            addImageBlobHook: async (blob: File, callback: Function) => {
              try {
                const validationError = validateImageFile(blob)
                if (validationError) {
                  toast.error(validationError)
                  return false
                }

                toast.loading('Uploading image...')
                const result = await uploadImage(blob)
                toast.dismiss()

                if (result.success && result.fileUrl) {
                  // 백엔드에서 완전한 URL을 받으므로 그대로 사용
                  const fullImageUrl = result.fileUrl
                  
                  // 콜백으로 이미지 URL 전달
                  callback(fullImageUrl, blob.name)
                  
                  // 업로드된 이미지 목록에 추가 (상대 경로로 저장)
                  const relativeUrl = result.fileUrl.replace(/^https?:\/\/[^\/]+/, '')
                  setUploadedImages(prev => [...prev, relativeUrl])
                  
                  // 부모 컴포넌트에 알림 (상대 경로로 전달)
                  if (onImageUpload) {
                    onImageUpload(relativeUrl)
                  }
                
                  
                  toast.success('Image uploaded successfully!')
                  return false
                } else {
                  toast.error(result.message || 'Upload failed')
                  return false
                }
              } catch (error) {
                toast.dismiss()
                toast.error('Upload failed')
                console.error('Upload error:', error)
                return false
              }
            }
          }}
        />
      </div>

      {/* 다크모드 스타일 */}
      <style jsx global>{`
        .toastui-editor-defaultUI {
          border: none !important;
        }
        
        .toastui-editor-defaultUI .toastui-editor-toolbar {
          background-color: ${isDarkMode ? '#374151' : '#F9FAFB'} !important;
          border-color: ${isDarkMode ? '#4B5563' : '#E5E7EB'} !important;
        }
        
        .toastui-editor-defaultUI .toastui-editor-main {
          background-color: ${isDarkMode ? '#1F2937' : '#FFFFFF'} !important;
          color: ${isDarkMode ? '#F9FAFB' : '#111827'} !important;
        }
        
        .toastui-editor-defaultUI .toastui-editor-contents {
          background-color: ${isDarkMode ? '#1F2937' : '#FFFFFF'} !important;
          color: ${isDarkMode ? '#F9FAFB' : '#111827'} !important;
        }
        
        /* 초기 텍스트 완전 제거 */
        .toastui-editor-defaultUI .toastui-editor-contents p:first-child:empty,
        .toastui-editor-defaultUI .toastui-editor-contents p:first-child:blank {
          display: none !important;
        }
        
        /* Write, Preview, Markdown, WYSIWYG 텍스트 제거 */
        .toastui-editor-defaultUI .toastui-editor-toolbar .toastui-editor-toolbar-divider:before,
        .toastui-editor-defaultUI .toastui-editor-toolbar .toastui-editor-toolbar-divider:after {
          content: "" !important;
        }
        
        /* 탭 텍스트 제거 */
        .toastui-editor-defaultUI .toastui-editor-toolbar .toastui-editor-toolbar-tabs button {
          font-size: 0 !important;
        }
        
        .toastui-editor-defaultUI .toastui-editor-toolbar .toastui-editor-toolbar-tabs button:before {
          content: "" !important;
        }
        
        /* 초기 placeholder 텍스트 제거 */
        .toastui-editor-defaultUI .toastui-editor-contents p:first-child {
          min-height: 0 !important;
        }
        
        /* 빈 내용일 때 기본 텍스트 숨김 */
        .toastui-editor-defaultUI .toastui-editor-contents:empty::before,
        .toastui-editor-defaultUI .toastui-editor-contents p:first-child:empty::before {
          content: none !important;
        }
        
        /* 특정 텍스트 숨김 */
        .toastui-editor-defaultUI .toastui-editor-contents p:contains("Write"),
        .toastui-editor-defaultUI .toastui-editor-contents p:contains("Preview"),
        .toastui-editor-defaultUI .toastui-editor-contents p:contains("Start writing your announcement..."),
        .toastui-editor-defaultUI .toastui-editor-contents p:contains("Markdown"),
        .toastui-editor-defaultUI .toastui-editor-contents p:contains("WYSIWYG") {
          display: none !important;
        }
      `}</style>
    </div>
  )
}

export default ToastEditor 