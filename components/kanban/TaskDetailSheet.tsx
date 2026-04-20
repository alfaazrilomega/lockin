'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Task, TaskStatus, TaskPriority } from '@/lib/types';
import { User2, Calendar, Link2, MoreHorizontal, LayoutList, GitBranch, MessageSquare, AlertCircle, Send, Activity, Loader2, Upload, AlertTriangle } from 'lucide-react';
import axios from 'axios';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Placeholder from '@tiptap/extension-placeholder';

// ─── Types ──────────────────────────────────────────────────────────
interface ActivityActor {
  id: string;
  name: string;
  avatarUrl: string | null;
}

interface FeedItem {
  id: string;
  type: 'activity' | 'comment';
  action?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: any;
  content?: string;
  actor: ActivityActor;
  editedAt?: string | null;
  createdAt: string;
}

interface TaskDetailSheetProps {
  task: Task | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────
function formatActivityLabel(action: string, metadata: Record<string, unknown>): string {
  switch (action) {
    case 'status_changed':       return `moved task from ${metadata.from} → ${metadata.to}`;
    case 'priority_changed':     return `changed priority from ${metadata.from} → ${metadata.to}`;
    case 'assignee_changed':     return `changed assignee`;
    case 'deadline_changed':     return `updated the deadline`;
    case 'commented':            return `commented`;
    default:                     return action.replace(/_/g, ' ');
  }
}

function timeAgo(date: string) {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (diff < 60)        return 'just now';
  if (diff < 3600)      return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400)     return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function Avatar({ user }: { user: ActivityActor }) {
  return (
    <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden shrink-0 border border-border">
      {user.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
      ) : (
        <span className="text-[10px] font-bold text-primary uppercase">{user.name.charAt(0)}</span>
      )}
    </div>
  );
}

// ─── Editor Toolbar ───────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EditorToolbar = ({ editor }: { editor: any }) => {
  if (!editor) return null;
  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/20 p-1.5 rounded-t-md">
      <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-xs font-medium" onClick={() => editor.chain().focus().toggleBold().run()} data-active={editor.isActive('bold')}>Bold</Button>
      <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-xs font-medium" onClick={() => editor.chain().focus().toggleItalic().run()} data-active={editor.isActive('italic')}>Italic</Button>
      <Separator orientation="vertical" className="h-4 mx-1" />
      <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-xs font-medium" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</Button>
      <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-xs font-medium" onClick={() => editor.chain().focus().toggleBulletList().run()}>List</Button>
      <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-xs font-medium" onClick={() => editor.chain().focus().toggleTaskList().run()}>Todo</Button>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────
export function TaskDetailSheet({ task, isOpen, onOpenChange, onUpdate }: TaskDetailSheetProps) {
  const [localTask, setLocalTask] = useState<Task | null>(task);
  const [isSaving, setIsSaving] = useState(false);

  // Subtask states
  const [isAddingSubtask, setIsAddingSubtask]   = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle]     = useState('');
  const [isSavingSubtask, setIsSavingSubtask]   = useState(false);

  // Activity feed states
  const [feed, setFeed]                         = useState<FeedItem[]>([]);
  const [isFeedLoading, setIsFeedLoading]       = useState(false);
  const [newComment, setNewComment]             = useState('');
  const [isPostingComment, setIsPostingComment] = useState(false);
  const feedBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setLocalTask(task); }, [task]);

  // Fetch activity feed when sheet opens or task changes
  const loadFeed = useCallback(async (taskId: string) => {
    setIsFeedLoading(true);
    try {
      const res = await axios.get(`/api/tasks/${taskId}/activity`);
      if (res.data.success) setFeed(res.data.data);
    } catch (err) {
      console.error('Failed to load activity feed:', err);
    } finally {
      setIsFeedLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen && task?.id) {
      loadFeed(task.id);
    }
  }, [isOpen, task?.id, loadFeed]);

  // Scroll feed to bottom when new items arrive
  useEffect(() => {
    feedBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [feed.length]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TaskList,
      TaskItem.configure({ nested: true }),
      Placeholder.configure({ placeholder: 'Add a detailed description...' })
    ],
    content: task?.description || '',
    immediatelyRender: false,
    editorProps: {
      attributes: { class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[150px] p-4 text-sm font-satoshi' },
    },
    onBlur: ({ editor }) => {
      if (localTask && editor.getHTML() !== localTask.description) {
        handleSave('description', editor.getHTML());
      }
    }
  });

  useEffect(() => {
    if (editor && task && task.description !== editor.getHTML()) {
      editor.commands.setContent(task.description || '');
    }
  }, [task, editor]);

  if (!localTask) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSave = async (field: keyof Task, value: any) => {
    setIsSaving(true);
    setLocalTask(prev => prev ? { ...prev, [field]: value } : prev);
    await onUpdate(localTask.id, { [field]: value });
    setIsSaving(false);
  };

  const handleAddSubtask = async () => {
    if (!newSubtaskTitle.trim() || !localTask) return;
    setIsSavingSubtask(true);
    try {
      const res = await axios.post('/api/tasks', {
        title: newSubtaskTitle,
        status: TaskStatus.TODO,
        projectId: localTask.projectId,
        parentId: localTask.id
      });
      if (res.data.success) {
        setLocalTask(prev => prev ? { ...prev, subtasks: [...(prev.subtasks || []), res.data.data] } : prev);
        setNewSubtaskTitle('');
        setIsAddingSubtask(false);
      }
    } catch (err) {
      console.error('Failed to add subtask:', err);
    } finally {
      setIsSavingSubtask(false);
    }
  };

  const handlePostComment = async () => {
    if (!newComment.trim() || !localTask) return;
    setIsPostingComment(true);
    try {
      const res = await axios.post(`/api/tasks/${localTask.id}/comments`, { content: newComment });
      if (res.data.success) {
        // Optimistically add to feed
        setFeed(prev => [...prev, {
          id: res.data.data.id,
          type: 'comment',
          content: res.data.data.content,
          actor: res.data.data.author,
          createdAt: res.data.data.createdAt,
        }]);
        setNewComment('');
      }
    } catch (err) {
      console.error('Failed to post comment:', err);
    } finally {
      setIsPostingComment(false);
    }
  };

  const isOverdue = localTask.deadline && new Date(localTask.deadline) < new Date() && localTask.status !== TaskStatus.DONE;
  const completedSubtasks = localTask.subtasks?.filter(s => s.status === TaskStatus.DONE).length || 0;
  const totalSubtasks = localTask.subtasks?.length || 0;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent aria-describedby={undefined} className="w-full sm:max-w-4xl p-0 flex flex-col h-full bg-background border-l border-border shadow-2xl font-satoshi overflow-hidden sm:rounded-l-2xl">

        {/* TOP BAR */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-muted/10 shrink-0">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
            <span className="hover:underline cursor-pointer">Project</span>
            <span>/</span>
            <span className="text-foreground bg-muted px-1.5 py-0.5 rounded font-outfit uppercase tracking-wider">{localTask.id.split('-')[0]}</span>
            {isSaving && <span className="text-primary animate-pulse">Saving…</span>}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><Link2 className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><MoreHorizontal className="h-4 w-4" /></Button>
          </div>
        </div>

        {/* MAIN SPLIT LAYOUT */}
        <div className="flex flex-1 overflow-hidden flex-col md:flex-row">

          {/* ── LEFT: Content ──────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto p-6 md:pr-4 flex flex-col gap-6 custom-scrollbar">

            {/* Title */}
            <input
              type="text"
              value={localTask.title}
              onChange={(e) => setLocalTask({ ...localTask, title: e.target.value })}
              onBlur={(e) => handleSave('title', e.target.value)}
              className="text-2xl font-bold font-satoshi text-foreground bg-transparent border-none outline-none focus:ring-0 p-0 placeholder:text-muted-foreground"
              placeholder="Task title..."
            />

            {/* Description */}
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <LayoutList className="h-4 w-4 text-muted-foreground" />
                Description
              </h3>
              <div className="border border-border rounded-md bg-card overflow-hidden shadow-sm focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
                <EditorToolbar editor={editor} />
                <EditorContent editor={editor} />
              </div>
            </div>

            {/* ── Gate System Displays ────────────────────────────── */}
            {(localTask.proofUrl || localTask.proofNotes) && (
              <div className="flex flex-col gap-2 p-3 border border-purple-500/30 bg-purple-500/5 rounded-lg">
                <h3 className="text-sm font-semibold text-purple-600 flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Proof of Work Submitted
                </h3>
                {localTask.proofUrl && (
                  <p className="text-sm text-foreground">
                    <span className="font-semibold text-muted-foreground mr-1 h-3 w-3 inline-block"><Link2 className="h-3 w-3" /></span>
                    <a href={localTask.proofUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">{localTask.proofUrl}</a>
                  </p>
                )}
                {localTask.proofNotes && (
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{localTask.proofNotes}</p>
                )}
              </div>
            )}

            {localTask.feedback && (
              <div className="flex flex-col gap-2 p-3 border border-orange-500/30 bg-orange-500/5 rounded-lg">
                <h3 className="text-sm font-semibold text-orange-600 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Revision Feedback
                </h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{localTask.feedback}</p>
              </div>
            )}

            {/* Subtasks */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <GitBranch className="h-4 w-4 text-muted-foreground" />
                  Subtasks
                  {totalSubtasks > 0 && (
                    <span className="text-xs text-muted-foreground font-normal">({completedSubtasks}/{totalSubtasks})</span>
                  )}
                </h3>
              </div>

              {/* Subtask progress bar */}
              {totalSubtasks > 0 && (
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div
                    className="bg-primary rounded-full h-1.5 transition-all"
                    style={{ width: `${(completedSubtasks / totalSubtasks) * 100}%` }}
                  />
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                {localTask.subtasks?.map((subtask) => (
                  <div key={subtask.id} className="group flex items-center gap-3 p-2 rounded-md border border-transparent hover:border-border hover:bg-muted/30 transition-all">
                    <input
                      type="checkbox"
                      checked={subtask.status === TaskStatus.DONE}
                      readOnly
                      className="h-4 w-4 rounded border-border text-primary bg-background cursor-not-allowed"
                    />
                    <span className={`text-sm flex-1 ${subtask.status === TaskStatus.DONE ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                      {subtask.title}
                    </span>
                    <Badge variant="outline" className="text-[10px] uppercase font-medium">{subtask.status.replace('_', ' ')}</Badge>
                  </div>
                ))}

                {isAddingSubtask ? (
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      autoFocus
                      placeholder="What needs to be done?"
                      value={newSubtaskTitle}
                      onChange={(e) => setNewSubtaskTitle(e.target.value)}
                      className="h-8 text-sm"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newSubtaskTitle.trim()) handleAddSubtask();
                        else if (e.key === 'Escape') { setIsAddingSubtask(false); setNewSubtaskTitle(''); }
                      }}
                    />
                    <Button size="sm" className="h-8" onClick={handleAddSubtask} disabled={!newSubtaskTitle.trim() || isSavingSubtask}>
                      {isSavingSubtask ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Add'}
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setIsAddingSubtask(false); setNewSubtaskTitle(''); }}>✕</Button>
                  </div>
                ) : (
                  <div onClick={() => setIsAddingSubtask(true)} className="border border-dashed border-border rounded-md p-2.5 text-center cursor-pointer group hover:border-primary/50 bg-muted/5 hover:bg-muted/20 transition-all mt-1">
                    <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors">+ Add subtask</p>
                  </div>
                )}
              </div>
            </div>

            {/* ── Activity Feed ───────────────────────────────── */}
            <div className="flex flex-col gap-3 pb-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                Activity
              </h3>

              {/* Comment Input */}
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border border-border">
                  <MessageSquare className="h-3 w-3 text-primary" />
                </div>
                <div className="flex-1 flex items-center gap-2 border border-border rounded-lg px-3 h-9 bg-muted/5 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
                  <input
                    type="text"
                    placeholder="Write a comment…"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground"
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) handlePostComment(); }}
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors shrink-0"
                    onClick={handlePostComment}
                    disabled={!newComment.trim() || isPostingComment}
                  >
                    {isPostingComment ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                  </Button>
                </div>
              </div>

              {/* Feed Items */}
              {isFeedLoading ? (
                <div className="flex items-center justify-center py-8 text-muted-foreground text-sm gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading activity…
                </div>
              ) : feed.length === 0 ? (
                <div className="flex items-center justify-center py-8 text-muted-foreground text-xs border border-dashed border-border rounded-md bg-muted/5">
                  No activity yet. Changes and comments will appear here.
                </div>
              ) : (
                <div className="flex flex-col gap-3 mt-1">
                  {feed.map((item) => (
                    <div key={item.id} className="flex items-start gap-3">
                      <Avatar user={item.actor} />
                      <div className="flex-1 min-w-0">
                        {item.type === 'comment' ? (
                          <div className="bg-muted/40 border border-border rounded-xl rounded-tl-sm px-3.5 py-2.5">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-semibold text-foreground">{item.actor.name}</span>
                              <span className="text-[10px] text-muted-foreground">{timeAgo(item.createdAt)}</span>
                            </div>
                            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{item.content}</p>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 pt-1">
                            <span className="text-xs font-semibold text-foreground">{item.actor.name}</span>
                            <span className="text-xs text-muted-foreground">{formatActivityLabel(item.action!, item.metadata || {})}</span>
                            <span className="text-[10px] text-muted-foreground/60 ml-auto">{timeAgo(item.createdAt)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={feedBottomRef} />
                </div>
              )}
            </div>
          </div>

          <Separator className="hidden md:block h-full w-px bg-border" />

          {/* ── RIGHT: Metadata ─────────────────────────────── */}
          <div className="w-full md:w-[280px] bg-muted/5 p-6 overflow-y-auto shrink-0 flex flex-col gap-6 border-t md:border-t-0 border-border custom-scrollbar">

            {/* Status */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</label>
              <Select value={localTask.status} onValueChange={(val) => handleSave('status', val as TaskStatus)}>
                <SelectTrigger className="w-full h-8 text-sm bg-background border-border hover:bg-muted/50 transition-colors">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TaskStatus.TODO}>To Do</SelectItem>
                  <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
                  <SelectItem value={TaskStatus.REVIEW}>Review</SelectItem>
                  <SelectItem value={TaskStatus.REVISION}>Revision</SelectItem>
                  <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Assignee */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Assignee</label>
              <div className="flex items-center gap-2 p-1.5 rounded-md hover:bg-muted cursor-pointer transition-colors border border-transparent hover:border-border">
                {localTask.assignee ? (
                  <>
                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                      {localTask.assignee.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={localTask.assignee.avatarUrl} alt="" className="h-full w-full object-cover" />
                      ) : <User2 className="h-3 w-3 text-primary" />}
                    </div>
                    <span className="text-sm font-medium text-foreground">{localTask.assignee.name}</span>
                  </>
                ) : (
                  <>
                    <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center border border-dashed border-muted-foreground/50">
                      <User2 className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <span className="text-sm text-muted-foreground">Unassigned</span>
                  </>
                )}
              </div>
            </div>

            {/* Priority */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Priority</label>
              <Select value={localTask.priority} onValueChange={(val) => handleSave('priority', val as TaskPriority)}>
                <SelectTrigger className="w-full h-8 text-sm bg-transparent border-transparent hover:bg-muted hover:border-border transition-all shadow-none px-2 focus:ring-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TaskPriority.HIGH}><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500" /> High</div></SelectItem>
                  <SelectItem value={TaskPriority.MEDIUM}><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-yellow-500" /> Medium</div></SelectItem>
                  <SelectItem value={TaskPriority.LOW}><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500" /> Low</div></SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Story Points */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Story Points</label>
              <div className="relative">
                <Input
                  type="number"
                  value={localTask.storyPoints || ''}
                  onChange={(e) => setLocalTask({ ...localTask, storyPoints: e.target.value ? parseInt(e.target.value) : null })}
                  onBlur={(e) => handleSave('storyPoints', e.target.value ? parseInt(e.target.value) : null)}
                  placeholder="0"
                  className="h-8 bg-transparent border-transparent hover:bg-muted hover:border-border shadow-none focus-visible:ring-1 focus-visible:bg-background transition-all pl-2 pr-8 font-outfit"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">pts</span>
              </div>
            </div>

            {/* Deadline */}
            <div className="space-y-1.5 mt-auto pt-6 border-t border-border">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Deadline</label>
              <div className={`flex items-center gap-2 text-sm p-2 rounded-md ${isOverdue ? 'bg-red-500/10 text-red-600 font-medium' : 'text-foreground'}`}>
                {isOverdue ? <AlertCircle className="h-4 w-4" /> : <Calendar className="h-4 w-4 text-muted-foreground" />}
                {localTask.deadline ? new Date(localTask.deadline).toLocaleDateString() : 'No date set'}
              </div>
            </div>

          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
