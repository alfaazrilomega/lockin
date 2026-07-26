'use client'

import { useState, useEffect } from 'react'
import { updateTaskStatus, updateTaskPriority, updateTaskPositionBatch, createTask } from '@/actions/tasks'
import { Card } from '@/components/tremor/Card'
import { Badge } from '@/components/tremor/Badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@/components/tremor/Table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Pencil, GripVertical } from 'lucide-react'
import {
  RiAddLine,
  RiLayoutGridLine,
  RiListCheck2,
  RiChat3Line,
  RiAttachmentLine,
  RiSearchLine,
  RiPriceTag3Line,
  RiUploadCloud2Line,
  RiLoader4Line,
  RiAlertLine,
  RiUser3Line
} from '@remixicon/react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { TaskDetailsSheet, TaskDetail } from './task-details-sheet'

interface TagOption {
  id: string
  name: string
  color_code: string | null
}

export interface WorkspaceMemberItem {
  id: string
  user_id: string
  role: string
  status: string
  displayEmail?: string
  displayName?: string
  user?: {
    full_name?: string | null
    avatar_url?: string | null
  } | null
}

interface KanbanBoardProps {
  initialTasks: TaskDetail[]
  availableTags?: TagOption[]
  workspaceMembers?: WorkspaceMemberItem[]
}

export function KanbanBoard({ initialTasks, availableTags = [], workspaceMembers = [] }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<TaskDetail[]>(initialTasks)
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAssigneeId, setSelectedAssigneeId] = useState<string | null>(null)
  const [selectedTask, setSelectedTask] = useState<TaskDetail | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])
  const [createFileError, setCreateFileError] = useState<string | null>(null)

  // QA Hydration Safety Guard
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const toggleTagSelection = (tagId: string) => {
    setSelectedTagIds(prev =>
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    )
  }

  const handleCreateFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    setCreateFileError(null)

    if (files && files.length > 0) {
      const totalBytes = Array.from(files).reduce((acc, file) => acc + file.size, 0)
      const MAX_LIMIT = 10485760 // 10 MB

      if (totalBytes > MAX_LIMIT) {
        setCreateFileError('Max 10MB file/Todolist')
        e.target.value = ''
      }
    }
  }

  // Keep state in sync with server revalidations
  useEffect(() => {
    setTasks(initialTasks)
    if (selectedTask) {
      const updated = initialTasks.find(t => t.id === selectedTask.id)
      if (updated) setSelectedTask(updated)
    }
  }, [initialTasks])

  const handleStatusChange = async (taskId: string, newStatus: 'todo' | 'in_progress' | 'done') => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t))
    await updateTaskStatus(taskId, newStatus)
  }

  const handlePriorityChange = async (taskId: string, newPriority: 'low' | 'medium' | 'high') => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, priority: newPriority } : t))
    try {
      await updateTaskPriority(taskId, newPriority)
    } catch (err) {
      console.error('Failed to update priority:', err)
    }
  }

  // Handle DND for both Kanban Board (Column Status Switch) and Tremor Table (Vertical List Reorder)
  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result
    if (!destination) return

    // Case 1: Tremor Table Vertical Reordering
    if (viewMode === 'list') {
      if (destination.index === source.index) return

      const reordered = Array.from(filteredTasks)
      const [movedTask] = reordered.splice(source.index, 1)
      reordered.splice(destination.index, 0, movedTask)

      // Optimistic state update
      setTasks(reordered)

      try {
        await updateTaskPositionBatch(reordered.map(t => t.id))
      } catch (err) {
        console.error('Failed to update task positions:', err)
      }
      return
    }

    // Case 2: Kanban Board Column Drag & Drop
    const sourceColId = source.droppableId
    const destColId = destination.droppableId

    if (sourceColId === destColId && source.index === destination.index) return

    const newStatus = destColId as 'todo' | 'in_progress' | 'done'

    // Optimistic Update
    setTasks(prev => prev.map(t => t.id === draggableId ? { ...t, status: newStatus } : t))

    try {
      await updateTaskStatus(draggableId, newStatus)
    } catch (err) {
      console.error('Failed to update task status via DND:', err)
    }
  }

  const handleOpenDetails = (task: TaskDetail) => {
    setSelectedTask(task)
    setIsSheetOpen(true)
  }

  // Filter tasks by Search Query AND Selected Assignee
  const filteredTasks = tasks.filter(t => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesAssignee = selectedAssigneeId ? t.user_id === selectedAssigneeId : true

    return matchesSearch && matchesAssignee
  })

  const columns = [
    { id: 'todo', title: 'To Do', badgeVariant: 'neutral' as const },
    { id: 'in_progress', title: 'In Progress', badgeVariant: 'warning' as const },
    { id: 'done', title: 'Done', badgeVariant: 'success' as const }
  ]

  const handleCreateTaskSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      const formData = new FormData(e.currentTarget)
      await createTask(formData)
      setIsDialogOpen(false)
      setSelectedTagIds([])
    } catch (err) {
      console.error('Error creating task:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 font-satoshi">
      {/* Header Toolbar & Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Left Side: Search Input & Assignee Filter */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <Input
              placeholder="Cari tugas HR..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs h-9 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 font-satoshi"
            />
          </div>

          {/* Interactive Circular Assignee Avatars */}
          {workspaceMembers && workspaceMembers.length > 0 && (
            <div className="flex items-center gap-1.5 bg-gray-100/90 p-1 rounded-lg border border-gray-200 text-xs font-outfit">
              <span className="text-[10px] font-bold text-gray-500 uppercase px-1 font-outfit flex items-center gap-1">
                <RiUser3Line className="size-3 text-gray-500" /> Member:
              </span>

              {/* Button 'Semua' */}
              <button
                type="button"
                onClick={() => setSelectedAssigneeId(null)}
                className={`px-2.5 py-1 rounded-md font-semibold text-xs transition cursor-pointer font-satoshi ${
                  selectedAssigneeId === null
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                Semua
              </button>

              {/* Circular Avatar Pills */}
              {workspaceMembers.map((member) => {
                const userId = member.user_id
                const displayName = member.displayName || member.user?.full_name || member.displayEmail?.split('@')[0] || 'Member'
                const initials = displayName
                  .split(' ')
                  .map((n: string) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)
                const isSelected = selectedAssigneeId === userId

                return (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => setSelectedAssigneeId(prev => prev === userId ? null : userId)}
                    className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border transition cursor-pointer font-satoshi ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 ring-2 ring-indigo-300 shadow-sm'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/50'
                    }`}
                    title={`Filter tugas milik ${displayName}`}
                  >
                    <div
                      className={`h-5 w-5 rounded-full flex items-center justify-center font-bold text-[9px] font-outfit ${
                        isSelected ? 'bg-white text-indigo-700' : 'bg-indigo-100 text-indigo-700'
                      }`}
                    >
                      {initials}
                    </div>
                    <span className="text-xs font-semibold truncate max-w-[90px]">{displayName}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Right Side: Action Controls */}
        <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
          {/* View Mode Toggle Button Group */}
          <div className="flex items-center p-1 bg-gray-100 rounded-lg border border-gray-200">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition ${
                viewMode === 'kanban'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <RiLayoutGridLine className="size-3.5" /> Papan Kanban
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition ${
                viewMode === 'list'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <RiListCheck2 className="size-3.5" /> Tabel Tremor
            </button>
          </div>

          {/* Add Task Modal Trigger */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-9 gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm">
                <RiAddLine className="size-4" /> Tambah Tugas
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px] bg-white border-gray-200 font-satoshi p-6">
              <DialogHeader>
                <DialogTitle className="text-base font-bold text-gray-900">Buat Tugas Baru</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleCreateTaskSubmit} className="space-y-4 pt-2">
                {selectedTagIds.map(tagId => (
                  <input key={tagId} type="hidden" name="tag_ids" value={tagId} />
                ))}

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 font-outfit">Judul Tugas *</label>
                  <Input
                    name="title"
                    required
                    placeholder="Contoh: Implementasi Auth Middleware"
                    className="text-xs text-gray-900 font-medium placeholder:text-gray-400 bg-white border-gray-200 focus:border-indigo-500 focus:ring-indigo-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 font-outfit">Deskripsi Tugas (Opsional)</label>
                  <textarea
                    name="description"
                    placeholder="Tambahkan detail atau instruksi tugas..."
                    className="w-full h-24 p-2.5 text-xs text-gray-900 font-medium placeholder:text-gray-400 rounded-md border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 font-satoshi"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 font-outfit flex items-center gap-1">
                    <RiAlertLine className="size-3.5 text-gray-500" /> Tingkat Prioritas *
                  </label>
                  <select
                    name="priority"
                    defaultValue="medium"
                    className="w-full h-9 px-3 text-xs text-gray-900 font-medium rounded-md border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 cursor-pointer font-satoshi"
                  >
                    <option value="high">🔴 High (Tinggi)</option>
                    <option value="medium">🟡 Medium (Sedang)</option>
                    <option value="low">⚪ Low (Rendah)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 font-outfit flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <RiPriceTag3Line className="size-3.5 text-gray-500" /> Label / Tag (Bisa Pilih Lebih dari 1)
                    </span>
                    {selectedTagIds.length > 0 && (
                      <span className="text-[10px] font-semibold text-indigo-600 font-outfit">
                        {selectedTagIds.length} Dipilih
                      </span>
                    )}
                  </label>

                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {availableTags.map((tag) => {
                      const isSelected = selectedTagIds.includes(tag.id)
                      return (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => toggleTagSelection(tag.id)}
                          className={`px-2.5 py-1 rounded-md text-xs font-semibold transition flex items-center gap-1 cursor-pointer border ${
                            isSelected
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                              : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          <span
                            className="size-2 rounded-full inline-block"
                            style={{ backgroundColor: isSelected ? '#ffffff' : (tag.color_code || '#6b7280') }}
                          />
                          <span>{tag.name}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-gray-700 font-outfit flex items-center gap-1">
                      <RiUploadCloud2Line className="size-3.5 text-gray-500" /> Lampiran Berkas (Bisa Pilih Lebih dari 1 File)
                    </label>
                    {createFileError && (
                      <span className="text-red-500 font-bold text-xs animate-pulse font-outfit">
                        {createFileError}
                      </span>
                    )}
                  </div>
                  <input
                    type="file"
                    name="files"
                    multiple
                    onChange={handleCreateFilesChange}
                    className="w-full text-xs text-gray-700 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                  />
                  <p className="text-[10px] text-gray-400 font-outfit">Mendukung banyak berkas (PDF, ZIP, Gambar, Dokumen). Total maksimal 10MB.</p>
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <Button type="button" variant="outline" size="sm" onClick={() => setIsDialogOpen(false)} className="text-xs border-gray-200">
                    Batal
                  </Button>
                  <Button type="submit" size="sm" disabled={isSubmitting} className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
                    {isSubmitting ? <RiLoader4Line className="size-3.5 animate-spin" /> : 'Simpan Tugas'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main View Area with Hydration-Safe DragDropContext */}
      {!isMounted ? (
        /* Fallback SSR View before Client Hydration */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map(col => {
            const columnTasks = filteredTasks.filter(t => t.status === col.id)
            return (
              <div key={col.id} className="flex flex-col bg-gray-50/60 rounded-xl p-4 border border-gray-200 min-h-[500px]">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-200">
                  <h3 className="text-sm font-bold text-gray-900">{col.title}</h3>
                  <Badge variant={col.badgeVariant}>{columnTasks.length}</Badge>
                </div>
                <div className="space-y-3">
                  {columnTasks.map(task => (
                    <Card key={task.id} className="p-4 bg-white border-gray-200">
                      <h4 className="text-xs font-bold text-gray-900">{task.title}</h4>
                    </Card>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          {viewMode === 'kanban' ? (
            /* Kanban Columns Grid with Droppable and Draggable Cards */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {columns.map(col => {
                const columnTasks = filteredTasks.filter(t => t.status === col.id)
                return (
                  <Droppable key={col.id} droppableId={col.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex flex-col rounded-xl p-4 border transition-colors min-h-[500px] ${
                          snapshot.isDraggingOver
                            ? 'bg-indigo-50/70 border-indigo-300'
                            : 'bg-gray-50/60 border-gray-200'
                        }`}
                      >
                        {/* Column Header */}
                        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-200">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-gray-900">{col.title}</h3>
                            <Badge variant={col.badgeVariant}>{columnTasks.length}</Badge>
                          </div>
                        </div>

                        {/* Task Cards Container */}
                        <div className="flex-1 space-y-3 overflow-y-auto">
                          {columnTasks.map((task, index) => {
                            const priority = task.priority || 'medium'
                            const commentCount = task.comments?.length || 0

                            return (
                              <Draggable key={task.id} draggableId={task.id} index={index}>
                                {(dragProvided, dragSnapshot) => (
                                  <div
                                    ref={dragProvided.innerRef}
                                    {...dragProvided.draggableProps}
                                    {...dragProvided.dragHandleProps}
                                  >
                                    <Card
                                      onClick={() => handleOpenDetails(task)}
                                      className={`p-4 space-y-3 hover:border-indigo-400 transition cursor-grab active:cursor-grabbing group bg-white border-gray-200 ${
                                        dragSnapshot.isDragging ? 'shadow-xl ring-2 ring-indigo-500/40 opacity-95' : 'hover:shadow-md'
                                      }`}
                                    >
                                      <div className="flex items-start justify-between gap-2">
                                        <h4 className="text-xs font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                                          {task.title}
                                        </h4>

                                        {/* Priority Badge + Pencil Inline Dropdown */}
                                        <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                                          <Badge
                                            variant={
                                              priority === 'high'
                                                ? 'error'
                                                : priority === 'medium'
                                                ? 'warning'
                                                : 'neutral'
                                            }
                                            className="text-[10px] uppercase font-outfit px-1.5 py-0.5"
                                          >
                                            {priority.toUpperCase()}
                                          </Badge>

                                          <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                              <button
                                                type="button"
                                                className="p-1 rounded hover:bg-gray-100 transition text-gray-400 hover:text-gray-700 cursor-pointer"
                                                title="Ubah Prioritas"
                                              >
                                                <Pencil className="w-3 h-3 text-gray-400 hover:text-gray-600" />
                                              </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-36 bg-white border border-gray-200 shadow-md font-satoshi z-50">
                                              <DropdownMenuItem
                                                onClick={() => handlePriorityChange(task.id, 'high')}
                                                className="text-xs font-semibold text-red-600 hover:bg-red-50 cursor-pointer"
                                              >
                                                🔴 High (Tinggi)
                                              </DropdownMenuItem>
                                              <DropdownMenuItem
                                                onClick={() => handlePriorityChange(task.id, 'medium')}
                                                className="text-xs font-semibold text-amber-600 hover:bg-amber-50 cursor-pointer"
                                              >
                                                🟡 Medium (Sedang)
                                              </DropdownMenuItem>
                                              <DropdownMenuItem
                                                onClick={() => handlePriorityChange(task.id, 'low')}
                                                className="text-xs font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer"
                                              >
                                                ⚪ Low (Rendah)
                                              </DropdownMenuItem>
                                            </DropdownMenuContent>
                                          </DropdownMenu>
                                        </div>
                                      </div>

                                      {task.description && (
                                        <p className="text-xs text-gray-500 line-clamp-2">
                                          {task.description}
                                        </p>
                                      )}

                                      {/* Tags */}
                                      {task.tags && task.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1">
                                          {task.tags.map(({ tag }) => (
                                            <span
                                              key={tag.id}
                                              className="px-1.5 py-0.5 rounded text-[10px] font-semibold text-white"
                                              style={{ backgroundColor: tag.color_code || '#6b7280' }}
                                            >
                                              {tag.name}
                                            </span>
                                          ))}
                                        </div>
                                      )}

                                      {/* Card Footer: Metadata, Prominent Chat Indicator & Quick Status Switcher */}
                                      <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[11px] text-gray-500">
                                        <div className="flex items-center gap-2">
                                          {/* Prominent Chat Indicator */}
                                          <span
                                            className={`flex items-center gap-1 font-bold font-satoshi px-1.5 py-0.5 rounded border ${
                                              commentCount > 0
                                                ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                                : 'bg-gray-50 text-gray-400 border-gray-100'
                                            }`}
                                            title={`${commentCount} Diskusi Komentar`}
                                          >
                                            <RiChat3Line className={`size-3.5 ${commentCount > 0 ? 'text-indigo-600' : 'text-gray-400'}`} />
                                            <span>{commentCount}</span>
                                          </span>

                                          {task.attachments && task.attachments.length > 0 && (
                                            <span className="flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                                              <RiAttachmentLine className="size-3.5 text-gray-400" /> {task.attachments.length}
                                            </span>
                                          )}
                                        </div>

                                        <select
                                          value={task.status}
                                          onClick={(e) => e.stopPropagation()}
                                          onChange={(e) => handleStatusChange(task.id, e.target.value as any)}
                                          className="bg-gray-50 text-[10px] font-semibold rounded px-1.5 py-0.5 border border-gray-200 focus:outline-none cursor-pointer text-gray-700"
                                        >
                                          <option value="todo">To Do</option>
                                          <option value="in_progress">In Progress</option>
                                          <option value="done">Done</option>
                                        </select>
                                      </div>
                                    </Card>
                                  </div>
                                )}
                              </Draggable>
                            )
                          })}
                          {provided.placeholder}
                        </div>
                      </div>
                    )}
                  </Droppable>
                )
              })}
            </div>
          ) : (
            /* Tremor Raw Table View with Vertical List Reordering (Grip Drag Handle) */
            <Card className="p-0 overflow-hidden border-gray-200 bg-white">
              <Droppable droppableId="tremor-table-rows">
                {(droppableProvided) => (
                  <Table ref={droppableProvided.innerRef} {...droppableProvided.droppableProps}>
                    <TableHead>
                      <TableRow>
                        <TableHeaderCell className="w-10 text-center">Drag</TableHeaderCell>
                        <TableHeaderCell>Nama Tugas</TableHeaderCell>
                        <TableHeaderCell>Prioritas</TableHeaderCell>
                        <TableHeaderCell>Status</TableHeaderCell>
                        <TableHeaderCell>Tags</TableHeaderCell>
                        <TableHeaderCell>Diskusi & Berkas</TableHeaderCell>
                        <TableHeaderCell className="text-right">Ubah Status</TableHeaderCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredTasks.map((task, index) => {
                        const priority = task.priority || 'medium'
                        const commentCount = task.comments?.length || 0

                        return (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(dragProvided, dragSnapshot) => (
                              <TableRow
                                ref={dragProvided.innerRef}
                                {...dragProvided.draggableProps}
                                onClick={() => handleOpenDetails(task)}
                                className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                                  dragSnapshot.isDragging ? 'bg-indigo-50/80 shadow-md' : ''
                                }`}
                              >
                                {/* Grip Drag Handle Icon */}
                                <TableCell className="w-10 text-center" onClick={(e) => e.stopPropagation()}>
                                  <div
                                    {...dragProvided.dragHandleProps}
                                    className="p-1 hover:bg-gray-200/60 rounded cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-700 inline-block"
                                    title="Tarik untuk mengubah urutan"
                                  >
                                    <GripVertical className="size-4" />
                                  </div>
                                </TableCell>

                                <TableCell>
                                  <div className="font-semibold text-gray-900">{task.title}</div>
                                  {task.description && (
                                    <div className="text-[11px] text-gray-500 truncate max-w-[280px]">
                                      {task.description}
                                    </div>
                                  )}
                                </TableCell>

                                <TableCell onClick={(e) => e.stopPropagation()}>
                                  <div className="flex items-center gap-1.5">
                                    <Badge
                                      variant={
                                        priority === 'high'
                                          ? 'error'
                                          : priority === 'medium'
                                          ? 'warning'
                                          : 'neutral'
                                      }
                                    >
                                      {priority.toUpperCase()}
                                    </Badge>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <button type="button" className="p-1 rounded hover:bg-gray-100 transition text-gray-400 hover:text-gray-700 cursor-pointer">
                                          <Pencil className="w-3 h-3" />
                                        </button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="start" className="w-36 bg-white border border-gray-200 shadow-md font-satoshi z-50">
                                        <DropdownMenuItem onClick={() => handlePriorityChange(task.id, 'high')} className="text-xs font-semibold text-red-600 hover:bg-red-50 cursor-pointer">
                                          🔴 High (Tinggi)
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handlePriorityChange(task.id, 'medium')} className="text-xs font-semibold text-amber-600 hover:bg-amber-50 cursor-pointer">
                                          🟡 Medium (Sedang)
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handlePriorityChange(task.id, 'low')} className="text-xs font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer">
                                          ⚪ Low (Rendah)
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                </TableCell>

                                <TableCell>
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
                                </TableCell>

                                <TableCell>
                                  <div className="flex flex-wrap gap-1">
                                    {task.tags && task.tags.length > 0 ? (
                                      task.tags.map(({ tag }) => (
                                        <span
                                          key={tag.id}
                                          className="px-1.5 py-0.5 rounded text-[10px] font-semibold text-white"
                                          style={{ backgroundColor: tag.color_code || '#6b7280' }}
                                        >
                                          {tag.name}
                                        </span>
                                      ))
                                    ) : (
                                      <span className="text-gray-400 text-[10px]">-</span>
                                    )}
                                  </div>
                                </TableCell>

                                <TableCell>
                                  <div className="flex items-center gap-2 text-xs">
                                    <span
                                      className={`flex items-center gap-1 font-bold font-satoshi px-1.5 py-0.5 rounded border ${
                                        commentCount > 0
                                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                          : 'bg-gray-50 text-gray-400 border-gray-100'
                                      }`}
                                    >
                                      <RiChat3Line className={`size-3.5 ${commentCount > 0 ? 'text-indigo-600' : 'text-gray-400'}`} /> {commentCount}
                                    </span>
                                    <span className="flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100 text-gray-500">
                                      <RiAttachmentLine className="size-3.5 text-gray-400" /> {task.attachments?.length || 0}
                                    </span>
                                  </div>
                                </TableCell>

                                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                  <select
                                    value={task.status}
                                    onChange={(e) => handleStatusChange(task.id, e.target.value as any)}
                                    className="bg-gray-50 text-[11px] font-semibold rounded px-2 py-1 border border-gray-200 focus:outline-none cursor-pointer text-gray-700"
                                  >
                                    <option value="todo">To Do</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="done">Done</option>
                                  </select>
                                </TableCell>
                              </TableRow>
                            )}
                          </Draggable>
                        )
                      })}
                      {droppableProvided.placeholder}
                    </TableBody>
                  </Table>
                )}
              </Droppable>
            </Card>
          )}
        </DragDropContext>
      )}

      {/* Task Detail Slide-over Sheet */}
      {selectedTask && (
        <TaskDetailsSheet
          task={selectedTask}
          isOpen={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
        />
      )}
    </div>
  )
}
