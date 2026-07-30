import { useState, useRef, useCallback } from 'react'
import { uploadService } from '../../services/upload.service'

interface UploadedFile {
  id: string
  file: File
  name: string
  size: number
  progress: number
  status: 'pending' | 'uploading' | 'uploaded' | 'error'
  error?: string
}

interface FileUploaderProps {
  maxSizeMB?: number
  accept?: string
  multiple?: boolean
  onUploadComplete?: (fileId: string) => void
}

const ALLOWED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

const ACCEPT_STRING = '.pdf,.jpg,.jpeg,.png,.doc,.docx'

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export default function FileUploader({ maxSizeMB = 50, accept = ACCEPT_STRING, multiple = true, onUploadComplete }: FileUploaderProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [dragOver, setDragOver] = useState(false)
  const [globalError, setGlobalError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const validateFile = useCallback((file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return `"${file.name}" has an unsupported file type.`
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      return `"${file.name}" exceeds the ${maxSizeMB}MB limit.`
    }
    return null
  }, [maxSizeMB])

  const processFiles = useCallback((fileList: FileList | File[]) => {
    setGlobalError(null)
    const incoming = Array.from(fileList)
    if (incoming.length === 0) return

    const valid: UploadedFile[] = []
    for (const file of incoming) {
      const error = validateFile(file)
      if (error) {
        setGlobalError(error)
        continue
      }
      valid.push({
        id: `${file.name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        name: file.name,
        size: file.size,
        progress: 0,
        status: 'pending',
      })
    }

    if (valid.length > 0) {
      setFiles((prev) => [...prev, ...valid])
      valid.forEach((item) => uploadFile(item))
    }
  }, [validateFile])

  const uploadFile = async (item: UploadedFile) => {
    setFiles((prev) => prev.map((f) => f.id === item.id ? { ...f, status: 'uploading' as const } : f))

    try {
      const response = await uploadService.uploadFile(item.file, (progress) => {
        setFiles((prev) => prev.map((f) => f.id === item.id ? { ...f, progress } : f))
      })

      setFiles((prev) => prev.map((f) => f.id === item.id ? { ...f, status: 'uploaded' as const, progress: 100 } : f))
      onUploadComplete?.(response.file.id)
    } catch (err: any) {
      const message = err?.response?.data?.detail || err?.message || 'Upload failed'
      setFiles((prev) => prev.map((f) => f.id === item.id ? { ...f, status: 'error' as const, error: message } : f))
    }
  }

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    processFiles(e.dataTransfer.files)
  }, [processFiles])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files)
      e.target.value = ''
    }
  }

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-300 ${
          dragOver
            ? 'border-primary-500 bg-primary-500/10 scale-[1.02]'
            : 'border-slate-600 hover:border-primary-500/50 hover:bg-white/5'
        }`}
      >
        <input ref={inputRef} type="file" accept={accept} multiple={multiple} className="hidden" onChange={handleInputChange} />
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-600/20 text-primary-400">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div>
            <p className="text-base font-semibold text-white">
              {dragOver ? 'Drop files here' : 'Drag & drop files here'}
            </p>
            <p className="mt-1 text-sm text-slate-400">
              or <span className="text-primary-400 underline underline-offset-2">browse files</span>
            </p>
          </div>
          <p className="text-xs text-slate-500">
            Supported: PDF, JPG, PNG, DOC, DOCX &middot; Max {maxSizeMB}MB per file
          </p>
        </div>
      </div>

      {/* Global error */}
      {globalError && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-400">
          {globalError}
        </div>
      )}

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((item) => (
            <div key={item.id} className="glass rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3 min-w-0">
                  {/* File icon */}
                  <div className={`flex-shrink-0 h-9 w-9 rounded-lg flex items-center justify-center ${
                    item.status === 'error' ? 'bg-red-500/20 text-red-400' :
                    item.status === 'uploaded' ? 'bg-green-500/20 text-green-400' :
                    'bg-primary-500/20 text-primary-400'
                  }`}>
                    {item.status === 'uploaded' ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    ) : item.status === 'error' ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{item.name}</p>
                    <p className="text-xs text-slate-400">{formatBytes(item.size)}</p>
                  </div>
                </div>
                <button onClick={() => removeFile(item.id)} className="flex-shrink-0 p-1 rounded-lg text-slate-400 hover:text-red-400 hover:bg-white/5 transition-colors" aria-label="Remove file">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>

              {/* Progress bar */}
              {(item.status === 'uploading' || item.status === 'uploaded') && (
                <div className="w-full h-1.5 rounded-full bg-slate-700 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      item.status === 'uploaded' ? 'bg-green-500' : 'bg-primary-500'
                    }`}
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              )}

              {item.status === 'uploading' && (
                <p className="mt-1 text-xs text-slate-400">{item.progress}%</p>
              )}

              {item.error && (
                <p className="mt-1 text-xs text-red-400">{item.error}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
