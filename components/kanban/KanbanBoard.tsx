'use client'

import { useState, useEffect, useRef } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { TaskStatus, TaskPriority, type Task } from '@/lib/types';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { AlertTriangle, Clock, User2, LayoutGrid, Plus, X, Loader2, Upload } from 'lucide-react';
import { TaskDetailSheet } from './TaskDetailSheet';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

// ─── Types ─────────────────────────────────────────────────────
interface KanbanBoardProps {
  initialTasks: Task[];
  projectId?: string;
  workspaceId?: string;
}

// ─── Column config ──────────────────────────────────────────────
const COLUMNS: { id: TaskStatus; title: string; color: string }[] = [
  { id: TaskStatus.TODO,        title: 'To Do',       color: 'border-border' },
  { id: TaskStatus.IN_PROGRESS, title: 'In Progress', color: 'border-blue-500/40' },
  { id: TaskStatus.REVIEW,      title: 'Review',      color: 'border-purple-500/40' },
  { id: TaskStatus.REVISION,    title: 'Revision',    color: 'border-orange-500/40' },
  { id: TaskStatus.DONE,        title: 'Done',        color: 'border-green-500/40' },
];

const PRIORITY_BADGE: Record<string, { label: string; className: string }> = {
  [TaskPriority.HIGH]:   { label: 'High',   className: 'bg-red-500/10 text-red-500 border-red-500/20' },
  [TaskPriority.MEDIUM]: { label: 'Medium', className: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' },
  [TaskPriority.LOW]:    { label: 'Low',    className: 'bg-green-500/10 text-green-600 border-green-500/20' },
};

const STATUS_HEADER_COLORS: Record<string, string> = {
  [TaskStatus.TODO]:        'bg-muted/40',
  [TaskStatus.IN_PROGRESS]: 'bg-blue-500/5',
  [TaskStatus.REVIEW]:      'bg-purple-500/5',
  [TaskStatus.REVISION]:    'bg-orange-500/5',
  [TaskStatus.DONE]:        'bg-green-500/5',
};

// ─── Task Card ──────────────────────────────────────────────────
function TaskCard({ task, onClick }: { task: Task; onClick: () => void }) {
  const priority = task.priority as TaskPriority | undefined;
  const priorityStyle = priority ? PRIORITY_BADGE[priority] : null;
  const isOverdue = task.deadline && task.status !== TaskStatus.DONE && new Date(task.deadline) < new Date();

  return (
    <Card
      onClick={onClick}
      className="border-border bg-card cursor-pointer hover:border-primary/40 hover:shadow-md transition-all duration-200 group"
    >
      <CardContent className="p-4 space-y-3">
        <h4 className="font-satoshi font-medium text-sm text-foreground leading-snug group-hover:text-primary transition-colors">
          {task.title}
        </h4>

        {task.description && (
          <p className="font-satoshi text-xs text-muted-foreground line-clamp-2 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: task.description.replace(/<[^>]*>/g, '') }}
          />
        )}

        <div className="flex items-center justify-between pt-1 gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            {priorityStyle && (
              <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-4 ${priorityStyle.className}`}>
                {priorityStyle.label}
              </Badge>
            )}
            {task.storyPoints != null && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 bg-muted text-muted-foreground font-outfit">
                {task.storyPoints} pts
              </Badge>
            )}
            {task.subtasks && task.subtasks.length > 0 && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 text-muted-foreground">
                {task.subtasks.filter(s => s.status === TaskStatus.DONE).length}/{task.subtasks.length}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            {task.deadline && (
              <span className={`flex items-center gap-1 text-[10px] ${isOverdue ? 'text-red-500' : 'text-muted-foreground'}`}>
                {isOverdue && <AlertTriangle className="h-3 w-3" />}
                <Clock className="h-3 w-3" />
                {new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            )}
            {task.assignee && (
              <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border border-border" title={task.assignee.name}>
                {task.assignee.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={task.assignee.avatarUrl} alt={task.assignee.name} className="h-full w-full rounded-full object-cover" />
                ) : (
                  <span className="text-[8px] font-bold text-primary uppercase">{task.assignee.name.charAt(0)}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Inline Column Creator ──────────────────────────────────────
function InlineColumnCreator({
  status,
  projectId,
  onCreated,
}: {
  status: TaskStatus;
  projectId?: string;
  onCreated: (task: Task) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 50);
  }, [isOpen]);

  const handleCreate = async () => {
    if (!title.trim() || !projectId) return;
    setIsSaving(true);
    try {
      const res = await axios.post('/api/tasks', {
        title: title.trim(),
        status,
        projectId,
      });
      if (res.data.success) {
        onCreated(res.data.data);
        setTitle('');
        setIsOpen(false);
      }
    } catch (err) {
      console.error('Inline create failed:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 w-full px-2 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-lg transition-all group mt-1"
      >
        <Plus className="h-3.5 w-3.5 group-hover:text-primary transition-colors" />
        <span className="group-hover:text-primary transition-colors">Add task</span>
      </button>
    );
  }

  return (
    <div className="mt-1 p-2 border border-primary/30 rounded-lg bg-background shadow-sm space-y-2">
      <Input
        ref={inputRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title…"
        className="h-8 text-sm border-none shadow-none focus-visible:ring-0 px-1 bg-transparent"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && title.trim()) handleCreate();
          if (e.key === 'Escape') { setIsOpen(false); setTitle(''); }
        }}
      />
      <div className="flex items-center gap-1.5">
        <Button size="sm" className="h-7 text-xs px-3" onClick={handleCreate} disabled={!title.trim() || isSaving}>
          {isSaving ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Create'}
        </Button>
        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { setIsOpen(false); setTitle(''); }}>
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

// ─── Proof of Work Modal ────────────────────────────────────────
interface ProofOfWorkModalProps {
  taskTitle: string;
  isOpen: boolean;
  onConfirm: (proofUrl: string, proofNotes: string) => void;
  onCancel: () => void;
}

function ProofOfWorkModal({ taskTitle, isOpen, onConfirm, onCancel }: ProofOfWorkModalProps) {
  const [proofUrl, setProofUrl] = useState('');
  const [proofNotes, setProofNotes] = useState('');

  const handleConfirm = () => {
    onConfirm(proofUrl.trim(), proofNotes.trim());
    setProofUrl('');
    setProofNotes('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-md font-satoshi">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Upload className="h-5 w-5 text-purple-500" />
            Proof of Work Required
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Moving <span className="font-semibold text-foreground">&quot;{taskTitle}&quot;</span> to Review requires proof of completion.
            Attach a link (PR, Figma, Doc) or write notes so your leader can verify.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Proof URL <span className="text-muted-foreground font-normal normal-case">(optional)</span>
            </label>
            <Input
              placeholder="https://github.com/your/pr or figma link…"
              value={proofUrl}
              onChange={(e) => setProofUrl(e.target.value)}
              className="h-9 text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Notes
            </label>
            <textarea
              placeholder="Describe what was done and how to verify it…"
              value={proofNotes}
              onChange={(e) => setProofNotes(e.target.value)}
              rows={3}
              className="w-full text-sm bg-muted/20 border border-border rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 resize-none placeholder:text-muted-foreground transition-all"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={onCancel} className="text-sm">Cancel</Button>
          <Button
            onClick={handleConfirm}
            disabled={!proofUrl.trim() && !proofNotes.trim()}
            className="text-sm bg-purple-600 hover:bg-purple-700 text-white"
          >
            Submit for Review
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Revision Feedback Modal ──────────────────────────────────────
interface RevisionFeedbackModalProps {
  taskTitle: string;
  isOpen: boolean;
  onConfirm: (feedback: string) => void;
  onCancel: () => void;
}

function RevisionFeedbackModal({ taskTitle, isOpen, onConfirm, onCancel }: RevisionFeedbackModalProps) {
  const [feedback, setFeedback] = useState('');

  const handleConfirm = () => {
    onConfirm(feedback.trim());
    setFeedback('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-md font-satoshi">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Revision Feedback Required
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Moving <span className="font-semibold text-foreground">&quot;{taskTitle}&quot;</span> to Revision requires feedback.
            Let the assignee know what needs to be changed.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Feedback Notes
            </label>
            <textarea
              placeholder="Explain why this task needs revision..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              className="w-full text-sm bg-muted/20 border border-border rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/50 resize-none placeholder:text-muted-foreground transition-all"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={onCancel} className="text-sm">Cancel</Button>
          <Button
            onClick={handleConfirm}
            disabled={!feedback.trim()}
            className="text-sm bg-orange-600 hover:bg-orange-700 text-white"
          >
            Send back for Revision
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Board ─────────────────────────────────────────────────
export function KanbanBoard({ initialTasks, projectId, workspaceId }: KanbanBoardProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [tasks, setTasks]         = useState<Task[]>(initialTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isSheetOpen, setIsSheetOpen]   = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null); // userId filter
  // Proof of Work & Revision gates state
  const [proofPending, setProofPending] = useState<{
    taskId: string; taskTitle: string; newStatus: TaskStatus; newOrder: number;
  } | null>(null);
  
  const [revisionPending, setRevisionPending] = useState<{
    taskId: string; taskTitle: string; newStatus: TaskStatus; newOrder: number;
  } | null>(null);

  const { toast } = useToast();

  useEffect(() => { setTasks(initialTasks); }, [initialTasks]);
  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) return null;

  // ── Unique assignees for filter bar ─────────────────────────
  const assignees = Array.from(
    new Map(
      tasks
        .filter(t => t.assignee)
        .map(t => [t.assignee!.id, t.assignee!])
    ).values()
  );

  // ── Filtered task view ───────────────────────────────────────
  const visibleTasks = activeFilter
    ? tasks.filter(t => t.assigneeId === activeFilter)
    : tasks;

  // ── DragEnd ──────────────────────────────────────────────────
  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus  = destination.droppableId as TaskStatus;
    const draggedTask = tasks.find(t => t.id === draggableId);

    // ── Proof of Work gate: Intercept drag to REVIEW ──────────
    if (newStatus === TaskStatus.REVIEW && draggedTask && draggedTask.status !== TaskStatus.REVIEW) {
      const destinationTasks = tasks.filter(t => t.status === newStatus).sort((a, b) => a.order - b.order);
      let newOrder = 1000;
      if (destinationTasks.length > 0) {
        if (destination.index === 0) newOrder = destinationTasks[0].order - 1000;
        else if (destination.index >= destinationTasks.length) newOrder = destinationTasks[destinationTasks.length - 1].order + 1000;
        else newOrder = (destinationTasks[destination.index - 1].order + destinationTasks[destination.index].order) / 2;
      }
      setProofPending({ taskId: draggableId, taskTitle: draggedTask.title, newStatus, newOrder });
      return; // Don't proceed until proof is submitted
    }

    // ── Leader Feedback gate: Intercept drag to REVISION ــــــ
    if (newStatus === TaskStatus.REVISION && draggedTask && draggedTask.status !== TaskStatus.REVISION) {
      const destinationTasks = tasks.filter(t => t.status === newStatus).sort((a, b) => a.order - b.order);
      let newOrder = 1000;
      if (destinationTasks.length > 0) {
        if (destination.index === 0) newOrder = destinationTasks[0].order - 1000;
        else if (destination.index >= destinationTasks.length) newOrder = destinationTasks[destinationTasks.length - 1].order + 1000;
        else newOrder = (destinationTasks[destination.index - 1].order + destinationTasks[destination.index].order) / 2;
      }
      setRevisionPending({ taskId: draggableId, taskTitle: draggedTask.title, newStatus, newOrder });
      return; // Don't proceed until feedback is submitted
    }

    // ── Normal DnD update ─────────────────────────────────────
    const destinationTasks = tasks.filter(t => t.status === newStatus).sort((a, b) => a.order - b.order);
    let newOrder = 1000;
    if (destinationTasks.length === 0) newOrder = 1000;
    else if (destination.index === 0) newOrder = destinationTasks[0].order - 1000;
    else if (destination.index >= destinationTasks.length) newOrder = destinationTasks[destinationTasks.length - 1].order + 1000;
    else newOrder = (destinationTasks[destination.index - 1].order + destinationTasks[destination.index].order) / 2;

    const previousTasks = [...tasks];
    setTasks(tasks.map(t => t.id === draggableId ? { ...t, status: newStatus, order: newOrder } : t));

    try {
      await axios.put(`/api/tasks/${draggableId}`, { status: newStatus, order: newOrder }, { withCredentials: true });
    } catch (err) {
      console.error('DnD update error:', err);
      setTasks(previousTasks);
      toast({ title: 'Sync Error', description: 'Failed to save position.', variant: 'destructive' });
    }
  };

  // ── Proof of Work confirmed ───────────────────────────────────
  const handleProofConfirm = async (proofUrl: string, proofNotes: string) => {
    if (!proofPending) return;
    const { taskId, newStatus, newOrder } = proofPending;

    const previousTasks = [...tasks];
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus, order: newOrder, proofUrl, proofNotes } : t));
    setProofPending(null);

    try {
      await axios.patch(`/api/tasks/${taskId}`, { status: newStatus, order: newOrder, proofUrl, proofNotes }, { withCredentials: true });
      toast({ title: '✓ Submitted for review', description: 'Your work has been sent to the leader for approval.' });
    } catch (err) {
      console.error('Proof submit error:', err);
      setTasks(previousTasks);
      toast({ title: 'Error', description: 'Failed to submit proof.', variant: 'destructive' });
    }
  };

  // ── Revision Feedback confirmed ───────────────────────────────────
  const handleRevisionConfirm = async (feedback: string) => {
    if (!revisionPending) return;
    const { taskId, newStatus, newOrder } = revisionPending;

    const previousTasks = [...tasks];
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus, order: newOrder, feedback } : t));
    setRevisionPending(null);

    try {
      await axios.patch(`/api/tasks/${taskId}`, { status: newStatus, order: newOrder, feedback }, { withCredentials: true });
      toast({ title: '✓ Sent for revision', description: 'Feedback has been attached to the task.' });
    } catch (err) {
      console.error('Revision feedback submit error:', err);
      setTasks(previousTasks);
      toast({ title: 'Error', description: 'Failed to submit revision feedback.', variant: 'destructive' });
    }
  };

  // ── Task field updates from detail sheet ──────────────────────
  const onTaskUpdate = async (taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates } : t));
    setSelectedTask(prev => prev?.id === taskId ? { ...prev, ...updates } : prev);
    try {
      await axios.patch(`/api/tasks/${taskId}`, updates, { withCredentials: true });
    } catch (error) {
      console.error('Failed to update task:', error);
      toast({ title: 'Error', description: 'Failed to sync task update.', variant: 'destructive' });
    }
  };

  // ── Inline creation handler ────────────────────────────────────
  const onTaskCreated = (task: Task) => {
    setTasks(prev => [...prev, task]);
  };

  const totalTasks   = tasks.length;
  const doneTasks    = tasks.filter(t => t.status === TaskStatus.DONE).length;
  const progressPct  = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* ── Summary + Avatar Filter Bar ───────────────────────── */}
      <div className="flex items-center gap-3 px-1 flex-wrap">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <LayoutGrid className="h-3.5 w-3.5" />
          {totalTasks} tasks
        </span>
        <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden min-w-[80px]">
          <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
        </div>
        <span className="font-outfit font-semibold text-foreground text-xs">{progressPct}%</span>

        {/* Avatar filters */}
        {assignees.length > 0 && (
          <div className="flex items-center gap-1.5 ml-2 border-l border-border pl-3">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Filter:</span>
            <button
              onClick={() => setActiveFilter(null)}
              className={`h-6 px-2 rounded-full text-[10px] font-medium border transition-all ${!activeFilter ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/50'}`}
            >
              All
            </button>
            {assignees.map(user => (
              <button
                key={user.id}
                onClick={() => setActiveFilter(activeFilter === user.id ? null : user.id)}
                title={user.name}
                className={`h-6 w-6 rounded-full flex items-center justify-center border-2 transition-all hover:scale-110 overflow-hidden ${activeFilter === user.id ? 'border-primary ring-2 ring-primary/30' : 'border-border hover:border-primary/50'}`}
              >
                {user.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-[9px] font-bold text-primary uppercase">{user.name.charAt(0)}</span>
                )}
              </button>
            ))}
            {activeFilter && (
              <button onClick={() => setActiveFilter(null)} className="h-5 w-5 flex items-center justify-center rounded-full hover:bg-muted transition-colors ml-0.5" title="Clear filter">
                <X className="h-3 w-3 text-muted-foreground" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Kanban Board ─────────────────────────────────────── */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-6 w-full h-full min-h-[500px]">
          {COLUMNS.map(column => {
            const columnTasks = visibleTasks.filter(t => t.status === column.id).sort((a, b) => a.order - b.order);

            return (
              <div
                key={column.id}
                className={`flex-1 min-w-[260px] max-w-[310px] flex flex-col rounded-xl border ${column.color} overflow-hidden bg-muted/20`}
              >
                {/* Column header */}
                <div className={`px-4 py-3 border-b border-border shrink-0 ${STATUS_HEADER_COLORS[column.id]}`}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-satoshi font-semibold text-foreground text-xs uppercase tracking-wider">
                      {column.title}
                      {column.id === TaskStatus.REVIEW && (
                        <span className="ml-1.5 text-[9px] text-purple-500 font-normal normal-case">⚡ requires proof</span>
                      )}
                    </h3>
                    <span className="text-[11px] font-outfit font-medium text-muted-foreground bg-background px-2 py-0.5 rounded-full border border-border">
                      {columnTasks.length}
                    </span>
                  </div>
                </div>

                {/* Droppable list */}
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`flex-1 p-3 transition-colors duration-200 flex flex-col ${snapshot.isDraggingOver ? 'bg-muted/40' : ''}`}
                    >
                      <div className="flex flex-col gap-3 min-h-[120px] flex-1">
                        {columnTasks.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  ...provided.draggableProps.style,
                                  transform: snapshot.isDragging
                                    ? provided.draggableProps.style?.transform
                                    : 'translate3d(0,0,0)',
                                }}
                                className={`transition-opacity duration-200 ${snapshot.isDragging ? 'opacity-90 scale-[1.02] shadow-xl z-50' : 'opacity-100'}`}
                              >
                                <TaskCard
                                  task={task}
                                  onClick={() => { setSelectedTask(task); setIsSheetOpen(true); }}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>

                      {/* ── Inline creator at column bottom ── */}
                      {projectId && (
                        <InlineColumnCreator
                          status={column.id}
                          projectId={projectId}
                          onCreated={onTaskCreated}
                        />
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {/* ── Proof of Work & Revision Modals ──────────────────── */}
      {proofPending && (
        <ProofOfWorkModal
          taskTitle={proofPending.taskTitle}
          isOpen={!!proofPending}
          onConfirm={handleProofConfirm}
          onCancel={() => setProofPending(null)}
        />
      )}

      {revisionPending && (
        <RevisionFeedbackModal
          taskTitle={revisionPending.taskTitle}
          isOpen={!!revisionPending}
          onConfirm={handleRevisionConfirm}
          onCancel={() => setRevisionPending(null)}
        />
      )}

      {/* ── Task Detail Sheet ─────────────────────────────────  */}
      <TaskDetailSheet
        task={selectedTask}
        isOpen={isSheetOpen}
        onOpenChange={(open) => {
          setIsSheetOpen(open);
          if (!open) setTimeout(() => setSelectedTask(null), 300);
        }}
        onUpdate={onTaskUpdate}
      />
    </div>
  );
}
