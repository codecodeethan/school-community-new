import { useRef, useEffect } from 'react'
import { deleteImage, deleteFile } from '@/Utils/upload'

export function useFileCleanup() {
  const uploadedFilesRef = useRef<{
    images: string[]
    documents: string[]
  }>({ images: [], documents: [] })
  
  const isSuccessRef = useRef(false)

  const cleanupUploadedFiles = async () => {
    if (isSuccessRef.current) {
      return
    }
    
    const { images, documents } = uploadedFilesRef.current
    
    for (const imageUrl of images) {
      try {
        await deleteImage(imageUrl)
      } catch (error) {
        console.error('Failed to clean up image:', imageUrl, error)
      }
    }
    
    for (const documentUrl of documents) {
      try {
        await deleteFile(documentUrl)
      } catch (error) {
        console.error('Failed to clean up document:', documentUrl, error)
      }
    }
    
    uploadedFilesRef.current = { images: [], documents: [] }
  }

  const handleEditorImageUpload = (imageUrl: string) => {
    uploadedFilesRef.current.images.push(imageUrl)
  }

  const handleDocumentUpload = (documentUrl: string) => {
    uploadedFilesRef.current.documents.push(documentUrl)
  }

  const handleDocumentRemove = (documentUrl: string) => {
    uploadedFilesRef.current.documents = uploadedFilesRef.current.documents.filter(
      url => url !== documentUrl
    )
  }

  const resetTracking = () => {
    isSuccessRef.current = true
    uploadedFilesRef.current = { images: [], documents: [] }
  }

  useEffect(() => {
    const handleBeforeUnload = () => {
      cleanupUploadedFiles()
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      cleanupUploadedFiles()
    }
  }, [])

  return {
    cleanupUploadedFiles,
    handleEditorImageUpload,
    handleDocumentUpload,
    handleDocumentRemove,
    resetTracking
  }
} 