'use client'

import React, { useState, useEffect } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from '@/components/ui/sheet'
import { Badge } from '@/components/tremor/Badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  createComment,
  createAttachment,
  updateTaskDescription,
  deleteTask,
  deleteAttachment
} from '@/actions/tasks'
import {
  RiChat3Line,
  RiAttachmentLine,
  RiDeleteBinLine,
  RiCalendarLine,
  RiPriceTag3Line,
  RiSendPlaneLine,
  RiFileTextLine,
  RiLoader4Line,
  RiUploadCloud2Line
} from '@remixicon/react'

export interface TaskDetail {
  id: string
  user_id?: string
  owner?: { full_name?: string | null; avatar_url?: string | null } | null
  title: string
  description: string | null
  status: 'todo' | 'in_progress' | 'done'
  priority?: 'low' | 'medium' | 'high'
  created_at: Date
  due_date?: Date | null
  tags?: Array<{
    tag: {
      id: string
      name: string
      color_code: string | null
    }
  }>
  comments?: Array<{
    id: string
    content: string
    created_at: Date
    author?: {
      full_name: string | null
      avatar_url: string | null
    }
  }>
  attachments?: Array<{
    id: string
    file_name: string
    file_path: string
    file_size: number
    content_type: string
  }>
}

interface TaskDetailsSheetProps {
  task: TaskDetail | null
  isOpen: boolean
  onClose: () => void
}

export function TaskDetailsSheet({ task, isOpen, onClose }: TaskDetailsSheetProps) {
  const [description, setDescription] = useState(task?.description || '')
  const [isSavingDesc, setIsSavingDesc] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [isPostingComment, setIsPostingComment] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [fileSizeError, setFileSizeError] = useState<string | null>(null)

  // Synchronize description state when task changes
  useEffect(() => {
    if (task) {
      setDescription(task.description || '')
    }
  }, [task])

  if (!task) return null

  const handleSaveDescription = async () => {
    try {
      setIsSavingDesc(true)
      await updateTaskDescription(task.id, description)
    } catch (error) {
      console.error('Error saving description:', error)
    } finally {
      setIsSavingDesc(false)
    }
  }

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim()) return

    try {
      setIsPostingComment(true)
      await createComment(task.id, commentText)
      setCommentText('')
    } catch (error) {
      console.error('Error posting comment:', error)
    } finally {
      setIsPostingComment(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setFileSizeError(null)

    const fileList = Array.from(files)
    const selectedTotalBytes = fileList.reduce((acc, f) => acc + f.size, 0)
    const currentTotalBytes = task.attachments ? task.attachments.reduce((acc, a) => acc + (a.file_size || 0), 0) : 0
    const MAX_LIMIT = 10485760 // 10 MB

    if ((currentTotalBytes + selectedTotalBytes) > MAX_LIMIT) {
      setFileSizeError('Max 10MB file/Todolist')
      e.target.value = ''
      return
    }

    try {
      setIsUploading(true)
      const formData = new FormData()
      fileList.forEach(file => {
        formData.append('files', file)
      })
      await createAttachment(task.id, formData)
      e.target.value = ''
    } catch (error) {
      console.error('Error uploading file:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDeleteAttachment = async (attachmentId: string) => {
    try {
      setFileSizeError(null)
      await deleteAttachment(attachmentId)
    } catch (error) {
      console.error('Error deleting attachment:', error)
    }
  }

  const handleDeleteTask = async () => {
    if (confirm('Apakah Anda yakin ingin menghapus tugas ini?')) {
      await deleteTask(task.id)
      onClose()
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-[540px] w-full overflow-y-auto bg-white border-l border-gray-200 p-6 font-satoshi">
        <SheetHeader className="space-y-3 pb-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <Badge
              variant={
                task.status === 'todo'
                  ? 'neutral'
                  : task.status === 'in_progress'
                  ? 'warning'
                  : 'success'
              }
            >
              {task.status.replace('_', ' ')}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-600 hover:bg-red-50 h-8 w-8"
              onClick={handleDeleteTask}
            >
              <RiDeleteBinLine className="size-4" />
            </Button>
          </div>

          <SheetTitle className="text-xl font-bold text-gray-900 font-satoshi">
            {task.title}
          </SheetTitle>
          <SheetDescription className="text-xs text-gray-500 flex items-center gap-2 font-outfit">
            <RiCalendarLine className="size-3.5" />
            Dibuat pada {new Date(task.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 pt-6">
          {/* Tags Section */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1.5 font-outfit">
              <RiPriceTag3Line className="size-3.5" /> Tags
            </label>
            <div className="flex flex-wrap gap-1.5">
              {task.tags && task.tags.length > 0 ? (
                task.tags.map(({ tag }) => (
                  <span
                    key={tag.id}
                    className="px-2 py-0.5 rounded text-xs font-semibold text-white"
                    style={{ backgroundColor: tag.color_code || '#6b7280' }}
                  >
                    {tag.name}
                  </span>
                ))
              ) : (
                <span className="text-xs text-gray-400 italic">Tidak ada tag</span>
              )}
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1.5 font-outfit">
              Deskripsi Tugas
            </label>
            <textarea
              className="w-full min-h-[100px] p-3 text-xs text-gray-900 font-medium placeholder:text-gray-400 rounded-md border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 font-satoshi"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tambahkan rincian deskripsi..."
            />
            <div className="flex justify-end">
              <Button
                size="sm"
                onClick={handleSaveDescription}
                disabled={isSavingDesc}
                className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm transition-colors"
              >
                {isSavingDesc ? <RiLoader4Line className="size-3.5 animate-spin" /> : 'Simpan Deskripsi'}
              </Button>
            </div>
          </div>

          {/* Attachments Section */}
          <div className="space-y-3 pt-2 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1.5 font-outfit">
                  <RiAttachmentLine className="size-3.5" /> Lampiran Berkas
                </label>
                {fileSizeError && (
                  <span className="text-red-500 font-bold text-xs ml-2 animate-pulse font-outfit">
                    {fileSizeError}
                  </span>
                )}
              </div>
              <label className="cursor-pointer text-xs text-indigo-600 font-semibold flex items-center gap-1 hover:underline">
                {isUploading ? <RiLoader4Line className="size-3.5 animate-spin" /> : <RiUploadCloud2Line className="size-3.5" />}
                <span>Unggah Berkas</span>
                <input type="file" multiple className="hidden" onChange={handleFileUpload} disabled={isUploading} />
              </label>
            </div>

            <div className="space-y-2">
              {task.attachments && task.attachments.length > 0 ? (
                task.attachments.map((att) => (
                  <div
                    key={att.id}
                    className="flex items-center justify-between p-2.5 rounded-md border border-gray-200 bg-white text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <RiFileTextLine className="size-4 text-gray-400 flex-shrink-0" />
                      <span className="truncate font-semibold text-gray-900">{att.file_name}</span>
                      <span className="text-gray-400 text-[10px] font-outfit">
                        ({(att.file_size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-gray-400 hover:text-red-600"
                      onClick={() => handleDeleteAttachment(att.id)}
                    >
                      <RiDeleteBinLine className="size-3.5" />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400 italic">Belum ada lampiran berkas</p>
              )}
            </div>
          </div>

          {/* Comments Section */}
          <div className="space-y-3 pt-2 border-t border-gray-200">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1.5 font-outfit">
              <RiChat3Line className="size-3.5" /> Diskusi & Komentar
            </label>

            <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1">
              {task.comments && task.comments.length > 0 ? (
                task.comments.map((comment) => (
                  <div key={comment.id} className="p-3 rounded-md bg-gray-50 border border-gray-100 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="font-bold text-gray-900 font-satoshi truncate">
                          {(comment as any).authorName || comment.author?.full_name || (comment as any).authorEmail || 'Unknown User'}
                        </span>
                        {(comment as any).authorEmail && (
                          <span className="text-[10px] text-indigo-600 font-mono font-normal truncate">
                            ({(comment as any).authorEmail})
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-400 font-outfit flex-shrink-0">
                        {new Date(comment.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-gray-700 font-satoshi">{comment.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400 italic">Belum ada komentar.</p>
              )}
            </div>

            <form onSubmit={handleAddComment} className="flex items-center gap-2 pt-2">
              <Input
                placeholder="Tulis komentar..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="text-xs h-9 text-gray-900 font-medium placeholder:text-gray-400 bg-white border-gray-200 focus:border-indigo-500 focus:ring-indigo-200"
              />
              <Button size="sm" type="submit" disabled={isPostingComment} className="h-9 px-3 bg-indigo-600 hover:bg-indigo-700 text-white">
                {isPostingComment ? <RiLoader4Line className="size-3.5 animate-spin" /> : <RiSendPlaneLine className="size-3.5" />}
              </Button>
            </form>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
