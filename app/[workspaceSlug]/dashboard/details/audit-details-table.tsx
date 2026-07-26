'use client'

import { useState } from 'react'
import { getTaskTimeline } from '@/actions/overview'
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from '@/components/ui/sheet'
import {
  RiUser3Line,
  RiTimeLine,
  RiChat3Line,
  RiAttachmentLine,
  RiHistoryLine,
  RiLoader4Line,
  RiCalendarLine,
  RiCheckDoubleLine,
  RiPriceTag3Line,
  RiExternalLinkLine
} from '@remixicon/react'

export interface AuditTaskItem {
  id: string
  title: string
  description: string | null
  status: 'todo' | 'in_progress' | 'done'
  priority?: 'low' | 'medium' | 'high'
  created_at: Date
  owner?: {
    full_name: string | null
    avatar_url: string | null
  }
  comments?: Array<{ id: string }>
  attachments?: Array<{ id: string; file_name: string }>
  tags?: Array<{ tag: { id: string; name: string; color_code: string | null } }>
}

interface AuditDetailsTableProps {
  tasks: AuditTaskItem[]
}

export function AuditDetailsTable({ tasks }: AuditDetailsTableProps) {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [timelineData, setTimelineData] = useState<any>(null)
  const [isLoadingTimeline, setIsLoadingTimeline] = useState(false)

  const handleRowClick = async (taskId: string) => {
    setSelectedTaskId(taskId)
    setIsDrawerOpen(true)
    setIsLoadingTimeline(true)
    setTimelineData(null)

    try {
      const data = await getTaskTimeline(taskId)
      setTimelineData(data)
    } catch (error) {
      console.error('Error fetching task timeline:', error)
    } finally {
      setIsLoadingTimeline(false)
    }
  }

  const selectedTask = tasks.find(t => t.id === selectedTaskId)

  return (
    <div className="space-y-6 font-satoshi">
      <Card className="p-0 overflow-hidden border-gray-200 bg-white">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>ID Tugas</TableHeaderCell>
              <TableHeaderCell>Assignee (Pemilik)</TableHeaderCell>
              <TableHeaderCell>Judul & Deskripsi</TableHeaderCell>
              <TableHeaderCell>Prioritas</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Komentar & Berkas</TableHeaderCell>
              <TableHeaderCell>Tanggal Dibuat</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map(task => {
              const priority = task.priority || 'medium'
              return (
                <TableRow
                  key={task.id}
                  onClick={() => handleRowClick(task.id)}
                  className="hover:bg-indigo-50/40 transition-colors cursor-pointer group"
                >
                  {/* Task ID */}
                  <TableCell className="font-mono text-[11px] text-gray-500 font-semibold group-hover:text-indigo-600">
                    {task.id.slice(0, 8)}...
                  </TableCell>

                  {/* Assignee */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="size-7 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xs font-outfit">
                        {task.owner?.full_name?.charAt(0) || <RiUser3Line className="size-3.5" />}
                      </div>
                      <div className="truncate">
                        <span className="text-xs font-semibold text-gray-900 block truncate">
                          {task.owner?.full_name || 'System User'}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Title & Description */}
                  <TableCell>
                    <div className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                      <span>{task.title}</span>
                      <RiExternalLinkLine className="size-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    {task.description && (
                      <div className="text-[11px] text-gray-500 truncate max-w-[260px] font-outfit">
                        {task.description}
                      </div>
                    )}
                  </TableCell>

                  {/* Priority Badge */}
                  <TableCell>
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
                  </TableCell>

                  {/* Status Badge */}
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

                  {/* Comments & Attachments Count */}
                  <TableCell>
                    <div className="flex items-center gap-3 text-xs text-gray-500 font-outfit">
                      <span className="flex items-center gap-1">
                        <RiChat3Line className="size-3.5 text-gray-400" /> {task.comments?.length || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <RiAttachmentLine className="size-3.5 text-gray-400" /> {task.attachments?.length || 0}
                      </span>
                    </div>
                  </TableCell>

                  {/* Date */}
                  <TableCell className="text-gray-500 font-outfit text-xs">
                    {new Date(task.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Card>

      {/* Time-Travel History Drawer (Slide-over) */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="sm:max-w-[560px] w-full overflow-y-auto bg-white border-l border-gray-200 p-6 font-satoshi">
          <SheetHeader className="space-y-3 pb-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <Badge variant="success" className="gap-1 font-outfit">
                <RiHistoryLine className="size-3.5" /> Time-Travel Audit History
              </Badge>
              <span className="font-mono text-xs text-gray-400">ID: {selectedTaskId?.slice(0, 8)}</span>
            </div>

            <SheetTitle className="text-xl font-bold text-gray-900 font-satoshi">
              {selectedTask?.title || 'Audit History Timeline'}
            </SheetTitle>
            <SheetDescription className="text-xs text-gray-500 font-outfit">
              Sejarah perubahan status, catatan aktivitas, dan log audit PostgreSQL real-time.
            </SheetDescription>
          </SheetHeader>

          {/* Drawer Timeline Content */}
          <div className="py-6 space-y-6">
            {isLoadingTimeline ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500 gap-2">
                <RiLoader4Line className="size-6 animate-spin text-indigo-600" />
                <span className="text-xs font-outfit">Memuat jejak waktu audit PostgreSQL...</span>
              </div>
            ) : timelineData ? (
              <div className="space-y-6 font-satoshi">
                {/* Task Meta Summary */}
                <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 text-xs">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider font-outfit block">Assignee Pemilik</span>
                    <span className="font-bold text-gray-900">{timelineData.task.owner?.full_name || 'System User'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider font-outfit block">Prioritas Tugas</span>
                    {(() => {
                      const activePriority = String(selectedTask?.priority || timelineData?.task?.priority || 'medium').toLowerCase()
                      return (
                        <Badge
                          variant={
                            activePriority === 'high'
                              ? 'error'
                              : activePriority === 'medium'
                              ? 'warning'
                              : 'neutral'
                          }
                        >
                          {activePriority.toUpperCase()}
                        </Badge>
                      )
                    })()}
                  </div>
                </div>

                {/* Vertical Timeline Component */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider font-outfit flex items-center gap-1.5">
                    <RiTimeLine className="size-4 text-indigo-600" /> Timeline Jejak Audit Database
                  </h4>

                  <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                    {/* Render PostgreSQL Activity Logs */}
                    {timelineData.timeline.length > 0 ? (
                      timelineData.timeline.map((log: any, idx: number) => (
                        <div key={log.id || idx} className="relative group">
                          {/* Timeline Dot */}
                          <span className="absolute -left-[23px] top-1 size-3.5 rounded-full bg-white border-2 border-indigo-600 shadow-sm" />

                          <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-gray-900">
                                {log.action === 'created' ? '🟢 Tugas Dibuat' : log.action === 'updated' ? '🟡 Perubahan Status / Detail' : '🔴 Tugas Dihapus'}
                              </span>
                              <span className="text-[10px] text-gray-400 font-outfit font-mono">
                                {new Date(log.created_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}
                              </span>
                            </div>

                            <p className="text-xs text-gray-600 font-outfit">
                              Aksi dilakukan oleh <strong className="text-gray-900 font-satoshi">{log.userName}</strong>.
                            </p>

                            {log.snapshot && (
                              <div className="text-[10px] font-mono bg-gray-50 p-2 rounded border border-gray-100 text-gray-600 mt-2 truncate">
                                Snapshot: Status = {log.snapshot.status || 'todo'} | Title = &quot;{log.snapshot.title}&quot;
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      /* Fallback timeline if logs are pending */
                      <div className="relative">
                        <span className="absolute -left-[23px] top-1 size-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-sm" />
                        <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm space-y-1 text-xs">
                          <div className="font-bold text-gray-900">🟢 Inisialisasi Tugas Database</div>
                          <p className="text-gray-500 text-[11px] font-outfit">
                            Dibuat pada {new Date(timelineData.task.created_at).toLocaleString('id-ID')}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Task Comments Timeline Entries */}
                    {timelineData.task.comments && timelineData.task.comments.length > 0 && (
                      timelineData.task.comments.map((comment: any) => (
                        <div key={comment.id} className="relative">
                          <span className="absolute -left-[23px] top-1 size-3.5 rounded-full bg-blue-500 border-2 border-white shadow-sm" />
                          <div className="p-3 bg-indigo-50/50 rounded-lg border border-indigo-100 space-y-1 text-xs">
                            <div className="flex items-center justify-between font-semibold text-gray-900">
                              <span className="flex items-center gap-1">
                                <RiChat3Line className="size-3.5 text-indigo-600" /> Komentar Diskusi
                              </span>
                              <span className="text-[10px] text-gray-400 font-outfit font-mono">
                                {new Date(comment.created_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}
                              </span>
                            </div>
                            <p className="text-gray-700 italic font-satoshi">&quot;{comment.content}&quot;</p>
                            <span className="text-[10px] text-gray-500 font-outfit block">
                              Oleh {comment.authorName || comment.author?.full_name || comment.authorEmail || 'Unknown User'}
                              {comment.authorEmail ? ` (${comment.authorEmail})` : ''}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
