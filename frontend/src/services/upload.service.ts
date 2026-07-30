import { api } from './api'

export interface FileResponse {
  id: string
  original_name: string
  stored_name: string
  file_size: number
  mime_type: string
  status: string
  created_at: string
}

export interface UploadResponse {
  file: FileResponse
  message: string
}

export interface FileListResponse {
  files: FileResponse[]
  total: number
}

export const uploadService = {
  async uploadFile(file: File, onProgress?: (progress: number) => void): Promise<UploadResponse> {
    const formData = new FormData()
    formData.append('file', file)
    const response = await api.post('/api/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          onProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total))
        }
      },
    })
    return response.data
  },

  async getFiles(skip = 0, limit = 20): Promise<FileListResponse> {
    const response = await api.get(`/api/files?skip=${skip}&limit=${limit}`)
    return response.data
  },

  async getFile(fileId: string): Promise<FileResponse> {
    const response = await api.get(`/api/files/${fileId}`)
    return response.data
  },

  async deleteFile(fileId: string): Promise<void> {
    await api.delete(`/api/files/${fileId}`)
  },

  getDownloadUrl(fileId: string): string {
    const base = import.meta.env.VITE_API_URL || 'http://localhost:8000'
    return `${base}/api/files/${fileId}/download`
  },
}
