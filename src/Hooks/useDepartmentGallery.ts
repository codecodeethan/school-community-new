import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import { api, ApiError } from '@/Utils/api'
import { useAuthStore } from '@/Stores/authStore'

export interface GalleryItem {
  id: number;
  title: string;
  description: string;
  author: string;
  userId: number;
  department: string;
  thumbnailUrl: string;
  googleDriveUrl?: string;
  eventDate: string;
  year: number;
  month: number;
  createdAt: string;
  updatedAt: string;
}

interface GalleryResponse {
  galleryItems: GalleryItem[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
  };
}

interface LatestTwoDepartmentsResponse {
  department1: {
    name: string;
    item: GalleryItem | null;
  };
  department2: {
    name: string;
    item: GalleryItem | null;
  };
}

interface CreateGalleryData {
  title: string;
  description: string;
  department: string;
  eventDate: string;
  googleDriveUrl?: string;
  thumbnail?: File;
}

interface UpdateGalleryData {
  title: string;
  description: string;
  department: string;
  eventDate: string;
  googleDriveUrl?: string;
  thumbnail?: File;
}

export const useDepartmentGallery = () => {
  const { accessToken } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)

  const getAllGalleryItems = useCallback(async (params?: {
    limit?: number;
    page?: number;
    sortBy?: 'latest' | 'oldest' | 'eventDate';
    department?: string;
    year?: number;
    month?: number;
    search?: string;
  }) => {
    setIsLoading(true)
    try {
      const searchParams = new URLSearchParams()
      
      if (params?.limit) searchParams.append('limit', params.limit.toString())
      if (params?.page) searchParams.append('page', params.page.toString())
      if (params?.sortBy) searchParams.append('sortBy', params.sortBy)
      if (params?.department) searchParams.append('department', params.department)
      if (params?.year) searchParams.append('year', params.year.toString())
      if (params?.month) searchParams.append('month', params.month.toString())
      if (params?.search) searchParams.append('search', params.search)
      
      const queryString = searchParams.toString()
      const url = queryString ? `/gallery?${queryString}` : '/gallery'
      
      const response = await api.get<GalleryResponse>(url)
      
      return response
    } catch (error) {
      toast.error('Failed to fetch gallery items')
      return { galleryItems: [], pagination: null }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getGalleryItemById = useCallback(async (id: number) => {
    setIsLoading(true)
    try {
      const response = await api.get<GalleryItem>(`/gallery/${id}`)
      return response
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        toast.error('Gallery item not found')
      } else {
        toast.error('Failed to fetch gallery item')
      }
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createGalleryItem = useCallback(async (formData: FormData) => {
    setIsLoading(true)
    try {
      toast.loading('Creating gallery item...')
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7777'}/gallery`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new ApiError(response.status, errorData.message || 'Failed to create gallery item')
      }

      const data = await response.json()
      
      toast.dismiss()
      toast.success('Gallery item created successfully!')
      
      return data
    } catch (error) {
      toast.dismiss()
      
      if (error instanceof ApiError) {
        switch (error.status) {
          case 400:
            toast.error('Please check your input data')
            break
          case 401:
            toast.error('You must be logged in to create gallery items')
            break
          case 403:
            toast.error('You do not have permission to create gallery items')
            break
          default:
            toast.error(error.message || 'Failed to create gallery item')
        }
      } else {
        toast.error('Something went wrong. Please try again')
      }
      
      return null
    } finally {
      setIsLoading(false)
    }
  }, [accessToken])

  const updateGalleryItem = useCallback(async (id: number, formData: FormData) => {
    setIsLoading(true)
    try {
      toast.loading('Updating gallery item...')
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7777'}/gallery/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new ApiError(response.status, errorData.message || 'Failed to update gallery item')
      }

      const data = await response.json()
      
      toast.dismiss()
      toast.success('Gallery item updated successfully!')
      
      return data
    } catch (error) {
      toast.dismiss()
      
      if (error instanceof ApiError) {
        switch (error.status) {
          case 400:
            toast.error('Please check your input data')
            break
          case 401:
            toast.error('You must be logged in to update gallery items')
            break
          case 403:
            toast.error('You do not have permission to update this gallery item')
            break
          case 404:
            toast.error('Gallery item not found')
            break
          default:
            toast.error(error.message || 'Failed to update gallery item')
        }
      } else {
        toast.error('Something went wrong. Please try again')
      }
      
      return null
    } finally {
      setIsLoading(false)
    }
  }, [accessToken])

  const deleteGalleryItem = useCallback(async (id: number) => {
    setIsLoading(true)
    try {
      toast.loading('Deleting gallery item...')
      
      await api.delete(`/gallery/${id}`, accessToken || undefined)
      
      toast.dismiss()
      toast.success('Gallery item deleted successfully!')
      
      return true
    } catch (error) {
      toast.dismiss()
      
      if (error instanceof ApiError) {
        switch (error.status) {
          case 401:
            toast.error('You must be logged in to delete gallery items')
            break
          case 403:
            toast.error('You do not have permission to delete this gallery item')
            break
          case 404:
            toast.error('Gallery item not found')
            break
          default:
            toast.error(error.message || 'Failed to delete gallery item')
        }
      } else {
        toast.error('Something went wrong. Please try again')
      }
      
      return false
    } finally {
      setIsLoading(false)
    }
  }, [accessToken])

  const getLatestTwoDepartments = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await api.get<LatestTwoDepartmentsResponse>(`/gallery/latest-two`)
  
      return response
    } catch (error) {
      toast.error('Failed to fetch latest two departments items')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    isLoading,
    getAllGalleryItems,
    getGalleryItemById,
    createGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    getLatestTwoDepartments,
  }
}
