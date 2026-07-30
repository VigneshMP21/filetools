import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { ArrowUpTrayIcon, XCircleIcon, CheckCircleIcon, ExclamationCircleIcon, FolderOpenIcon } from '@heroicons/react/24/outline'
import { uploadService } from '../../services/upload.service'
import { formatBytes } from '../../utils/tools'

interface UploadItem {
  id: string
  file: File
  progress: number
  status: 'queued' | 'uploading' | 'completed' | 'error'
  error?: string
}

export default function DashboardUploadPage() {
  const [items, setItems] = useState<UploadItem[]>([])
  const [dragOver, setDragOver] = useState(false)

  const addFiles = useCallback((fileList: FileList | File[]) => {
    const files = Array.from(fileList)
    const newItems: UploadItem[] = files.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      file,
      progress: 0,
      status: 'queued',
    }))
    setItems((prev) => [...prev, ...newItems])
    newItems.forEach((item) => uploadItem(item))
  }, [])

  const uploadItem = async (item: UploadItem) => {
    setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, status: 'uploading' as const } : i))

    try {
      const response = await uploadService.uploadFile(item.file, (progress) => {
        setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, progress } : i))
      })
      setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, status: 'completed' as const, progress: 100 } : i))
      toast.success(`${item.file.name} uploaded successfully`)
    } catch (err: any) {
      const errorMsg = err?.response?.data?.detail || err.message || 'Upload failed'
      setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, status: 'error' as const, error: errorMsg } : i))
      toast.error(`Failed to upload ${item.file.name}`)
    }
  }

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files.length) {
      addFiles(e.dataTransfer.files)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => setDragOver(false)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      addFiles(e.target.files)
      e.target.value = ''
    }
  }

  const completedCount = items.filter((i) => i.status === 'completed').length
  const errorCount = items.filter((i) => i.status === 'error').length

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Upload Files</h1>
        <p className="mt-1 text-slate-400">Upload your documents for processing</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative rounded-3xl border-2 border-dashed p-16 text-center transition-all ${
          dragOver
            ? 'border-accent-500 bg-accent-500/5'
            : 'border-white/10 bg-white/[0.02] hover:border-accent-500/40'
        }`}
      >
        <input
          type="file"
          multiple
          onChange={handleFileSelect}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
        <div className="pointer-events-none">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-accent-500/10">
            <ArrowUpTrayIcon className="h-10 w-10 text-accent-400" />
          </div>
          <h2 className="mt-6 text-xl font-semibold text-white">
            {dragOver ? 'Drop files here' : 'Drop files here or click to browse'}
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Supported formats: PDF, JPG, PNG, DOC, DOCX &bull; Max 50MB per file
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Your files are encrypted and automatically deleted after processing
          </p>
        </div>
      </motion.div>

      {completedCount > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between rounded-2xl bg-accent-500/10 p-4">
          <div className="flex items-center gap-2 text-sm text-accent-400">
            <CheckCircleIcon className="h-5 w-5" />
            {completedCount} file{completedCount !== 1 ? 's' : ''} uploaded successfully
          </div>
          <Link to="/dashboard/files" className="flex items-center gap-1.5 text-sm font-medium text-accent-400 hover:text-accent-300 transition-colors">
            <FolderOpenIcon className="h-4 w-4" />
            View My Files
          </Link>
        </motion.div>
      )}

      {errorCount > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-red-500/10 p-4 text-sm text-red-400">
          {errorCount} file{errorCount !== 1 ? 's' : ''} failed to upload
        </motion.div>
      )}

      <AnimatePresence mode="popLayout">
        {items.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
            <h2 className="text-lg font-semibold text-white">Upload Queue</h2>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass rounded-2xl p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0 mr-4">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-white truncate">{item.file.name}</p>
                      {item.status === 'completed' && <CheckCircleIcon className="h-4 w-4 shrink-0 text-accent-400" />}
                      {item.status === 'error' && <ExclamationCircleIcon className="h-4 w-4 shrink-0 text-red-400" />}
                      {item.status === 'uploading' && (
                        <svg className="h-4 w-4 shrink-0 animate-spin text-accent-400" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                      )}
                    </div>
                    <p className="mt-0.5 text-sm text-slate-400">{formatBytes(item.file.size)}</p>
                    {item.status === 'uploading' && (
                      <div className="mt-2 h-2 w-full rounded-full bg-white/5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.progress}%` }}
                          className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500"
                        />
                      </div>
                    )}
                    {item.status === 'error' && item.error && (
                      <p className="mt-1 text-xs text-red-400">{item.error}</p>
                    )}
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="shrink-0 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    <XCircleIcon className="h-5 w-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
