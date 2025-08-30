const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7777'

interface ApiResponse<T = any> {
  success?: boolean
  message?: string
  data?: T
  accessToken?: string
  refreshToken?: string
  user?: any
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

const handleResponse = async (response: Response): Promise<any> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new ApiError(response.status, errorData.message || `HTTP error! status: ${response.status}`)
  }
  
  return response.json()
}

export const api = {
  async get<T = any>(endpoint: string, token?: string): Promise<ApiResponse<T>> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers,
    })
    
    return handleResponse(response)
  },

  async post<T = any>(endpoint: string, data: any, token?: string, headers?: HeadersInit): Promise<ApiResponse<T>> {
    const requestHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      ...headers
    }
    
    if (token) {
      (requestHeaders as Record<string, string>).Authorization = `Bearer ${token}`
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify(data),
    })
    
    return handleResponse(response)
  },

  async postFormData<T = any>(endpoint: string, formData: FormData, token?: string, headers?: HeadersInit): Promise<ApiResponse<T>> {
    const requestHeaders: HeadersInit = { ...headers }

    if (token) {
      (requestHeaders as Record<string, string>).Authorization = `Bearer ${token}`
    }

    const url = `${API_BASE_URL}${endpoint}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: requestHeaders,
        body: formData,
      })
      
      return handleResponse(response)
    } catch (error) {
      throw error;
    }
  },

  async put<T = any>(endpoint: string, data: any, token?: string, headers?: HeadersInit): Promise<ApiResponse<T>> {
    const requestHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      ...headers
    }
    
    if (token) {
      (requestHeaders as Record<string, string>).Authorization = `Bearer ${token}`
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: requestHeaders,
      body: JSON.stringify(data),
    })
    
    return handleResponse(response)
  },

  async putFormData<T = any>(endpoint: string, formData: FormData, token?: string, headers?: HeadersInit): Promise<ApiResponse<T>> {
    const requestHeaders: HeadersInit = { ...headers }
    
    if (token) {
      (requestHeaders as Record<string, string>).Authorization = `Bearer ${token}`
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: requestHeaders,
      body: formData,
    })
    
    return handleResponse(response)
  },

  async delete<T = any>(endpoint: string, token?: string): Promise<ApiResponse<T>> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers,
    })
    
    return handleResponse(response)
  },
}

export { ApiError } 