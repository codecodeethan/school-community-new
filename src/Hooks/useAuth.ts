import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useAuthStore } from '@/Stores/authStore'
import { api, ApiError } from '@/Utils/api'

interface LoginCredentials {
  email: string
  password: string
}

interface SignupCredentials {
  name: string
  email: string
  password: string
}

export const useAuth = () => {
  const router = useRouter()
  const { login, logout, isLoggedIn, user } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (credentials: LoginCredentials) => {
    setIsLoading(true)
    
    try {
      toast.loading('Signing you in...')
      
      const response = await api.post('/auth/login', credentials)
      
      if (response.accessToken && response.refreshToken && response.user) {
        login(response.user, {
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        })
        
        toast.dismiss()
        toast.success('Welcome back!')
        
        router.push('/')
      } else {
        throw new Error('Invalid response format')
      }
    } catch (error) {
      toast.dismiss()
      
      if (error instanceof ApiError) {
        switch (error.status) {
          case 400:
            toast.error('Please check your email and password')
            break
          case 401:
            toast.error('Invalid email or password')
            break
          case 423:
            toast.error('Your account is inactive. Please contact support')
            break
          default:
            toast.error(error.message || 'Login failed')
        }
      } else {
        toast.error('Something went wrong. Please try again')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (credentials: SignupCredentials) => {
    setIsLoading(true)
    
    try {
      toast.loading('Creating your account...')
      
      const response = await api.post('/auth/signup-test', credentials)
      
      if (response.success && response.accessToken && response.refreshToken && response.user) {
        login(response.user, {
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        })
        
        toast.dismiss()
        toast.success('Account created successfully!')
        
        router.push('/')
      } else {
        throw new Error('Invalid response format')
      }
    } catch (error) {
      toast.dismiss()
      
      if (error instanceof ApiError) {
        switch (error.status) {
          case 400:
            toast.error('Please check your information')
            break
          default:
            toast.error(error.message || 'Signup failed')
        }
      } else {
        toast.error('Something went wrong. Please try again')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    setIsLoading(true)
    
    try {
      const { refreshToken } = useAuthStore.getState()
      
      if (refreshToken) {
        toast.loading('Signing you out...')
        await api.post('/auth/logout', { refreshToken })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      logout()
      toast.dismiss()
      toast.success('Signed out successfully')
      router.push('/login')
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async (email: string) => {
    setIsLoading(true)
    
    try {
      toast.loading('Sending reset email...')
      
      await api.post('/auth/forgot-password', { email })
      
      toast.dismiss()
      toast.success('Reset email sent! Check your inbox')
    } catch (error) {
      toast.dismiss()
      toast.error('Failed to send reset email. Please try again')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoggedIn,
    user,
    isLoading,
    login: handleLogin,
    signup: handleSignup,
    logout: handleLogout,
    forgotPassword: handleForgotPassword,
  }
} 