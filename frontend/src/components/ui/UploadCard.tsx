import { useCallback, useState } from 'react'
import { useDropzone, FileRejection } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../lib/utils'
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react'

interface UploadFile {
  id: string
  file: File
  progress: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
}

interface UploadCardProps {
  onFilesSelected?: (files: File[]) => void
  accept?: Record<string, string[]>
  maxSize?: number
  maxFiles?: number
  multiple?: boolean
  className?: string
}

export function UploadCard({
  onFilesSelected,
  accept = {
    'application/pdf': ['.pdf'],
    'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
  },
  maxSize = 10 * 1024 * 1024, // 10MB default
  maxFiles = 10,
  multiple = true,
  className = '',
}: UploadCardProps) {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadFile[] = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      progress: 0,
      status: 'pending',
    }))

    setUploadFiles((prev) => [...prev, ...newFiles].slice(0, maxFiles))
    onFilesSelected?.(acceptedFiles)
  }, [onFilesSelected, maxFiles])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles: multiple ? maxFiles : 1,
    multiple,
  })

  const removeFile = (id: string) => {
    setUploadFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={cn(
          'relative p-8 rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer',
          isDragActive
            ? 'border-primary-500 bg-primary-500/10'
            : 'border-white/10 hover:border-primary-500/50 hover:bg-white/5',
          'bg-slate-900/50 backdrop-blur'
        )}
      >
        <input {...getInputProps()} />

        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="flex flex-col items-center text-center"
        >
          <div className={cn(
            'w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors duration-300',
            isDragActive ? 'bg-primary-500/20' : 'bg-white/5'
          )}>
            <Upload className={cn(
              'w-8 h-8 transition-colors duration-300',
              isDragActive ? 'text-primary-400' : 'text-slate-400'
            )} />
          </div>

          <p className="text-lg font-medium text-white mb-2">
            {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
          </p>
          <p className="text-sm text-slate-400 mb-4">
            or click to browse
          </p>
          <p className="text-xs text-slate-500">
            Max {maxFiles} files, up to {formatFileSize(maxSize)} each
          </p>
        </motion.div>
      </div>

      {/* File List */}
      <AnimatePresence>
        {uploadFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            {uploadFiles.map((uploadFile) => (
              <motion.div
                key={uploadFile.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/30 border border-white/5"
              >
                <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center">
                  <File className="w-5 h-5 text-primary-400" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {uploadFile.file.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    {formatFileSize(uploadFile.file.size)}
                  </p>
                </div>

                {/* Status */}
                {uploadFile.status === 'uploading' && (
                  <div className="w-20 h-1.5 rounded-full bg-slate-700 overflow-hidden">
                    <motion.div
                      className="h-full bg-primary-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadFile.progress}%` }}
                    />
                  </div>
                )}

                {uploadFile.status === 'success' && (
                  <CheckCircle className="w-5 h-5 text-success-400" />
                )}

                {uploadFile.status === 'error' && (
                  <AlertCircle className="w-5 h-5 text-danger-400" />
                )}

                {/* Remove Button */}
                <button
                  onClick={() => removeFile(uploadFile.id)}
                  className="p-1 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <X className="w-4 h-4 text-slate-400 hover:text-white" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
