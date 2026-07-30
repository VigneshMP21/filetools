import { api } from './api'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  username: string
  password: string
  full_name?: string
}

export interface AuthResponse {
  user: {
    id: string
    email: string
    username: string
    full_name: string | null
    is_active: boolean
    is_verified: boolean
    created_at: string
  }
  tokens: {
    access_token: string
    refresh_token: string
    token_type: string
  }
}

export interface UserResponse {
  id: string
  email: string
  username: string
  full_name: string | null
  is_active: boolean
  is_verified: boolean
  created_at: string
}

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post('/api/auth/login', data)
    return response.data
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post('/api/auth/register', data)
    return response.data
  },

  async logout(refreshToken: string): Promise<void> {
    await api.post('/api/auth/logout', { refresh_token: refreshToken })
  },

  async refreshToken(refreshToken: string): Promise<{ access_token: string; refresh_token: string }> {
    const response = await api.post('/api/auth/refresh', { refresh_token: refreshToken })
    return response.data
  },

  async getCurrentUser(): Promise<UserResponse> {
    const response = await api.get('/api/auth/me')
    return response.data
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await api.post('/api/auth/forgot-password', { email })
    return response.data
  },

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const response = await api.post('/api/auth/reset-password', { token, new_password: newPassword })
    return response.data
  },
}
