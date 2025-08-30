import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import { api, ApiError } from '@/Utils/api'
import { useAuthStore } from '@/Stores/authStore'

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

interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalCount: number
  hasNextPage: boolean
  hasPrevPage: boolean
  limit: number
}

interface NoticesResponse {
  notices: Notice[]
  pagination: PaginationInfo
}

interface CreateNoticeData {
  title: string
  content: string
  type: string
  attachments?: string[]
}

interface UpdateNoticeData {
  title: string
  content: string
  type: string
  attachments?: string[]
}

export const useAnnouncement = () => {
  const { accessToken } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)

  const getAllNotices = useCallback(async (params?: {
    limit?: number
    page?: number
    sortBy?: 'latest' | 'oldest' | 'popular'
    category?: string
    search?: string
  }) => {
    setIsLoading(true)
    try {
      const searchParams = new URLSearchParams()
      
      if (params?.limit) searchParams.append('limit', params.limit.toString())
      if (params?.page) searchParams.append('page', params.page.toString())
      if (params?.sortBy) searchParams.append('sortBy', params.sortBy)
      if (params?.category) searchParams.append('category', params.category)
      if (params?.search) searchParams.append('search', params.search)
      
      const queryString = searchParams.toString()
      const url = queryString ? `/notices?${queryString}` : '/notices'
      
      const response = await api.get<NoticesResponse>(url)
      
      return response
    } catch (error) {
      toast.error('Failed to fetch announcements')
      return { notices: [], pagination: null }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getNotice = useCallback(async (id: number, userId?: number) => {
    setIsLoading(true)
    try {
      const params = userId ? `?userId=${userId}` : ''
      const response = await api.get<{ notice: Notice }>(`/notices/${id}${params}`)
      return (response as any).notice
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        toast.error('Announcement not found')
      } else {
        toast.error('Failed to fetch announcement')
      }
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createNotice = useCallback(async (data: CreateNoticeData) => {
    setIsLoading(true)
    try {
      toast.loading('Creating announcement...')
      
      const response = await api.post<{ message: string; notice: Notice }>(
        '/notices',
        data,
        accessToken || undefined
      )
      
      toast.dismiss()
      toast.success('Announcement created successfully!')
      
      return (response as any).notice
    } catch (error) {
      toast.dismiss()
      
      if (error instanceof ApiError) {
        switch (error.status) {
          case 400:
            toast.error('Please check your input data')
            break
          case 401:
            toast.error('You must be logged in to create announcements')
            break
          case 403:
            toast.error('You do not have permission to create announcements')
            break
          default:
            toast.error(error.message || 'Failed to create announcement')
        }
      } else {
        toast.error('Something went wrong. Please try again')
      }
      
      return null
    } finally {
      setIsLoading(false)
    }
  }, [accessToken])

  const updateNotice = useCallback(async (id: number, data: UpdateNoticeData) => {
    setIsLoading(true)
    try {
      toast.loading('Updating announcement...')
      
      const response = await api.put<{ message: string; notice: Notice }>(
        '/notices/${id}',
        data,
        accessToken || undefined
      )
      
      toast.dismiss()
      toast.success('Announcement updated successfully!')
      
      const updatedNotice = (response as any).notice
      
      return updatedNotice
    } catch (error) {
      toast.dismiss()
      
      if (error instanceof ApiError) {
        switch (error.status) {
          case 400:
            toast.error('Please check your input data')
            break
          case 401:
            toast.error('You must be logged in to update announcements')
            break
          case 403:
            toast.error('You do not have permission to update this announcement')
            break
          case 404:
            toast.error('Announcement not found')
            break
          default:
            toast.error(error.message || 'Failed to update announcement')
        }
      } else {
        toast.error('Something went wrong. Please try again')
      }
      
      return null
    } finally {
      setIsLoading(false)
    }
  }, [accessToken])

  const deleteNotice = useCallback(async (id: number) => {
    setIsLoading(true)
    try {
      toast.loading('Deleting announcement...')
      
      await api.delete(`/notices/${id}`, accessToken || undefined)
      
      toast.dismiss()
      toast.success('Announcement deleted successfully!')
      
      return true
    } catch (error) {
      toast.dismiss()
      
      if (error instanceof ApiError) {
        switch (error.status) {
          case 401:
            toast.error('You must be logged in to delete announcements')
            break
          case 403:
            toast.error('You do not have permission to delete this announcement')
            break
          case 404:
            toast.error('Announcement not found')
            break
          default:
            toast.error(error.message || 'Failed to delete announcement')
        }
      } else {
        toast.error('Something went wrong. Please try again')
      }
      
      return false
    } finally {
      setIsLoading(false)
    }
  }, [accessToken])

  const getLatestNotice = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await api.get<{ notice: (Notice & { imageUrl?: string }) | null }>(`/notices/latest`)
      return (response as any).notice as (Notice & { imageUrl?: string }) | null
    } catch (error) {
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])
 
  return {
    isLoading,
    getAllNotices,
    getNotice,
    createNotice,
    updateNotice,
    deleteNotice,
    getLatestNotice,
  }
}
