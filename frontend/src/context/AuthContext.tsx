import { createContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { authService, type UserResponse } from '../services/auth.service'

interface AuthContextType {
  user: UserResponse | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, username: string, password: string, fullName?: string) => Promise<void>
  logout: () => Promise<void>
  forgotPassword: (email: string) => Promise<{ message: string }>
  resetPassword: (token: string, newPassword: string) => Promise<{ message: string }>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!user

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      setIsLoading(false)
      return
    }
    authService.getCurrentUser()
      .then((userData) => setUser(userData))
      .catch(() => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
      })
      .finally(() => setIsLoading(false))
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const response = await authService.login({ email, password })
    localStorage.setItem('accessToken', response.tokens.access_token)
    localStorage.setItem('refreshToken', response.tokens.refresh_token)
    setUser(response.user)
  }, [])

  const register = useCallback(async (email: string, username: string, password: string, fullName?: string) => {
    const response = await authService.register({ email, username, password, full_name: fullName })
    localStorage.setItem('accessToken', response.tokens.access_token)
    localStorage.setItem('refreshToken', response.tokens.refresh_token)
    setUser(response.user)
  }, [])

  const logout = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken) {
        await authService.logout(refreshToken)
      }
    } catch {
      // Proceed with local logout even if API call fails
    } finally {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      setUser(null)
    }
  }, [])

  const forgotPassword = useCallback(async (email: string) => {
    return authService.forgotPassword(email)
  }, [])

  const resetPassword = useCallback(async (token: string, newPassword: string) => {
    return authService.resetPassword(token, newPassword)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated, login, register, logout, forgotPassword, resetPassword }}>
      {children}
    </AuthContext.Provider>
  )
}
