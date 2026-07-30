import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  DocumentTextIcon, PhotoIcon, ArrowDownTrayIcon, TrashIcon,
  MagnifyingGlassIcon, FunnelIcon, Squares2X2Icon, ListBulletIcon,
  ChevronLeftIcon, ChevronRightIcon, ClockIcon
} from '@heroicons/react/24/outline'
import { uploadService, type FileResponse } from '../../services/upload.service'
import { formatBytes } from '../../utils/tools'

const ITEMS_PER_PAGE = 12

function getFileIcon(mimeType: string) {
  if (mimeType?.startsWith('image/')) return PhotoIcon
  return DocumentTextIcon
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'completed':
      return 'bg-accent-500/10 text-accent-400'
    case 'processing':
      return 'bg-yellow-500/10 text-yellow-400'
    case 'error':
      return 'bg-red-500/10 text-red-400'
    default:
      return 'bg-slate-500/10 text-slate-400'
  }
}

function FileCard({ file, onDelete }: { file: FileResponse; onDelete: (id: string) => void }) {
  const Icon = getFileIcon(file.mime_type)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await uploadService.deleteFile(file.id)
      toast.success('File deleted')
      onDelete(file.id)
    } catch {
      toast.error('Failed to delete file')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="glass rounded-2xl p-5 group"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-500/10">
        <Icon className="h-8 w-8 text-accent-400" />
      </div>
      <p className="mt-4 font-medium text-white truncate" title={file.original_name}>{file.original_name}</p>
      <div className="mt-2 flex items-center gap-3 text-sm text-slate-400">
        <span>{formatBytes(file.file_size)}</span>
        <span>&bull;</span>
        <span className="flex items-center gap-1">
          <ClockIcon className="h-3.5 w-3.5" />
          {new Date(file.created_at).toLocaleDateString()}
        </span>
      </div>
      <div className="mt-3">
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(file.status)}`}>
          {file.status || 'uploaded'}
        </span>
      </div>
      <div className="mt-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <a
          href={uploadService.getDownloadUrl(file.id)}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-accent-500/10 py-2 text-sm font-medium text-accent-400 transition-all hover:bg-accent-500/20"
        >
          <ArrowDownTrayIcon className="h-4 w-4" />
          Download
        </a>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex items-center justify-center gap-1.5 rounded-xl bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition-all hover:bg-red-500/20 disabled:opacity-50"
        >
          {isDeleting ? (
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
          ) : (
            <TrashIcon className="h-4 w-4" />
          )}
        </button>
      </div>
    </motion.div>
  )
}

function FileRow({ file, onDelete }: { file: FileResponse; onDelete: (id: string) => void }) {
  const Icon = getFileIcon(file.mime_type)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await uploadService.deleteFile(file.id)
      toast.success('File deleted')
      onDelete(file.id)
    } catch {
      toast.error('Failed to delete file')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <motion.tr
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="border-b border-white/5 text-slate-300 hover:bg-white/[0.02] transition-colors"
    >
      <td className="py-4 pr-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-500/10">
            <Icon className="h-5 w-5 text-accent-400" />
          </div>
          <div>
            <p className="font-medium text-white truncate max-w-[300px]" title={file.original_name}>{file.original_name}</p>
            <p className="text-xs text-slate-500">{file.mime_type || 'Unknown'}</p>
          </div>
        </div>
      </td>
      <td className="py-4 pr-4 text-sm">{formatBytes(file.file_size)}</td>
      <td className="py-4 pr-4">
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(file.status)}`}>
          {file.status || 'uploaded'}
        </span>
      </td>
      <td className="py-4 pr-4 text-sm text-slate-400">{new Date(file.created_at).toLocaleDateString()}</td>
      <td className="py-4">
        <div className="flex gap-2">
          <a
            href={uploadService.getDownloadUrl(file.id)}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-accent-500/10 px-3 py-1.5 text-xs font-medium text-accent-400 transition-all hover:bg-accent-500/20"
          >
            <ArrowDownTrayIcon className="h-3.5 w-3.5" />
            Download
          </a>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 transition-all hover:bg-red-500/20 disabled:opacity-50"
          >
            {isDeleting ? (
              <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
            ) : (
              <TrashIcon className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </td>
    </motion.tr>
  )
}

function SkeletonGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="glass rounded-2xl p-5 animate-pulse">
          <div className="h-16 w-16 rounded-2xl bg-white/5" />
          <div className="mt-4 h-4 w-3/4 rounded bg-white/5" />
          <div className="mt-2 h-3 w-1/2 rounded bg-white/5" />
          <div className="mt-3 h-5 w-16 rounded-full bg-white/5" />
          <div className="mt-4 flex gap-2">
            <div className="h-9 flex-1 rounded-xl bg-white/5" />
            <div className="h-9 w-20 rounded-xl bg-white/5" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function DashboardFilesPage() {
  const [files, setFiles] = useState<FileResponse[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [isLoading, setIsLoading] = useState(true)

  const loadFiles = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await uploadService.getFiles(page * ITEMS_PER_PAGE, ITEMS_PER_PAGE)
      setFiles(res.files || [])
      setTotal(res.total || 0)
    } catch {
      toast.error('Failed to load files')
    } finally {
      setIsLoading(false)
    }
  }, [page])

  useEffect(() => {
    loadFiles()
  }, [loadFiles])

  const handleDelete = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId))
    setTotal((prev) => prev - 1)
  }

  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.original_name?.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || file.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">My Files</h1>
          <p className="mt-1 text-slate-400">{total} file{total !== 1 ? 's' : ''} total</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search files..."
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-11 pr-4 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-accent-500 focus:ring-1 focus:ring-accent-500"
          />
        </div>
        <div className="relative">
          <FunnelIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-10 text-sm text-white outline-none transition-all focus:border-accent-500 focus:ring-1 focus:ring-accent-500"
          >
            <option value="all" className="bg-slate-800">All Status</option>
            <option value="completed" className="bg-slate-800">Completed</option>
            <option value="processing" className="bg-slate-800">Processing</option>
            <option value="error" className="bg-slate-800">Error</option>
          </select>
        </div>
        <div className="flex rounded-xl border border-white/10 overflow-hidden">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-accent-500/20 text-accent-400' : 'bg-transparent text-slate-400 hover:text-white'}`}
          >
            <Squares2X2Icon className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-2.5 transition-colors ${viewMode === 'table' ? 'bg-accent-500/20 text-accent-400' : 'bg-transparent text-slate-400 hover:text-white'}`}
          >
            <ListBulletIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <SkeletonGrid />
      ) : filteredFiles.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl py-16 text-center">
          <DocumentTextIcon className="mx-auto h-16 w-16 text-slate-500" />
          <h3 className="mt-4 text-lg font-semibold text-white">No files found</h3>
          <p className="mt-2 text-sm text-slate-400">
            {search || statusFilter !== 'all' ? 'Try adjusting your search or filter' : 'Upload your first file to get started'}
          </p>
        </motion.div>
      ) : viewMode === 'grid' ? (
        <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredFiles.map((file) => (
            <FileCard key={file.id} file={file} onDelete={handleDelete} />
          ))}
        </motion.div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-left text-slate-400">
                  <th className="p-4 pr-4 font-medium">Name</th>
                  <th className="p-4 pr-4 font-medium">Size</th>
                  <th className="p-4 pr-4 font-medium">Status</th>
                  <th className="p-4 pr-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFiles.map((file) => (
                  <FileRow key={file.id} file={file} onDelete={handleDelete} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-300 transition-all hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeftIcon className="h-4 w-4" />
            Previous
          </button>
          <span className="text-sm text-slate-400">Page {page + 1} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-300 transition-all hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      )}
    </motion.div>
  )
}
