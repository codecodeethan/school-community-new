import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: number
  name: string
  email: string
  role: string
  isEmailVerified: boolean
}

interface AuthState {
  isLoggedIn: boolean
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  login: (userData: User, tokens: { accessToken: string; refreshToken: string }) => void
  logout: () => void
  updateUser: (userData: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      user: null,
      accessToken: null,
      refreshToken: null,
      
      login: (userData: User, tokens: { accessToken: string; refreshToken: string }) => {
        set({
          isLoggedIn: true,
          user: userData,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        })
      },
      
      logout: () => {
        set({
          isLoggedIn: false,
          user: null,
          accessToken: null,
          refreshToken: null,
        })
      },
      
      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData }
          })
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
) 