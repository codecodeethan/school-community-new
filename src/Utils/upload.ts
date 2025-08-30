const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7777'

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']

export const ALLOWED_FILE_TYPES = ['*/*']

export const MAX_IMAGE_SIZE = 10 * 1024 * 1024
export const MAX_FILE_SIZE = 50 * 1024 * 1024

export const validateImageFile = (file: File): string | null => {
  if (file.size > MAX_IMAGE_SIZE) {
    return `Image file size must be less than 10MB. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return 'Only image files are allowed. (JPEG, PNG, GIF, WebP)'
  }

  return null
}

export const validateDocumentFile = (file: File): string | null => {
  if (file.size > MAX_FILE_SIZE) {
    return `File size must be less than 50MB. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`
  }

  return null
}

export const uploadImage = async (file: File) => {
  try {
    const validationError = validateImageFile(file)
    if (validationError) {
      return { success: false, message: validationError }
    }

    const formData = new FormData()
    formData.append('images', file)

    const response = await fetch(`${API_BASE_URL}/api/upload-images`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Upload failed: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.files && data.files.length > 0) {
      return {
        success: true,
        fileUrl: data.files[0].url,
        fileName: data.files[0].name,
        fileSize: data.files[0].size,
        message: data.message
      }
    } else {
      return { success: false, message: 'No files uploaded' }
    }
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'Upload failed' }
  }
}

export const uploadDocument = async (file: File) => {
  try {
    const validationError = validateDocumentFile(file)
    if (validationError) {
      return { success: false, message: validationError }
    }

    const formData = new FormData()
    formData.append('files', file)

    const response = await fetch(`${API_BASE_URL}/api/upload-files`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Upload failed: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.files && data.files.length > 0) {
      return {
        success: true,
        fileUrl: data.files[0].url,
        fileName: data.files[0].name,
        fileSize: data.files[0].size,
        message: data.message
      }
    } else {
      return { success: false, message: 'No files uploaded' }
    }
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'Upload failed' }
  }
}

export const deleteImage = async (imageUrl: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/delete-image`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Delete failed: ${response.status}`)
    }

    const data = await response.json()
    return { success: data.success, message: data.message }
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'Delete failed' }
  }
}

export const deleteFile = async (fileUrl: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/delete-file`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileUrl }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Delete failed: ${response.status}`)
    }

    const data = await response.json()
    return { success: data.success, message: data.message }
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'Delete failed' }
  }
} 