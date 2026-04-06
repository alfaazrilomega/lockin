'use client'

import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { TaskStatus, type Task } from '@/lib/types';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

interface KanbanBoardProps {
  initialTasks: Task[];
  workspaceId?: string;
}

const COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: TaskStatus.TODO, title: 'To Do' },
  { id: TaskStatus.IN_PROGRESS, title: 'In Progress' },
  { id: TaskStatus.REVIEW, title: 'Review' },
  { id: TaskStatus.DONE, title: 'Done' }
];

export function KanbanBoard({ initialTasks }: KanbanBoardProps) {
  // Prevent Hydration errors with Drag and Drop in React 18 / Next SSR
  const [isMounted, setIsMounted] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const { toast } = useToast();
  
  // Sync if initialTasks changes from parent prop
  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) return null;

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId as TaskStatus;
    
    // Calculate fractional order for O(1) list insertions without full array reindexes
    const destinationTasks = tasks.filter(t => t.status === newStatus).sort((a, b) => a.order - b.order);
    let newOrder = 0;
    
    if (destinationTasks.length === 0) {
      newOrder = 1000.0;
    } else if (destination.index === 0) {
      newOrder = destinationTasks[0].order - 1000.0;
    } else if (destination.index === destinationTasks.length) {
      newOrder = destinationTasks[destinationTasks.length - 1].order + 1000.0;
    } else {
      newOrder = (destinationTasks[destination.index - 1].order + destinationTasks[destination.index].order) / 2.0;
    }

    // 1. Snapshot previous state for rollback
    const previousTasks = [...tasks];

    // 2. Optimistically snap UI instantly (mutate local state)
    const newTasks = tasks.map(task => 
      task.id === draggableId 
        ? { ...task, status: newStatus, order: newOrder } 
        : task
    );
    setTasks(newTasks);
    
    // 3. Resolve via REST API in background
    try {
      axios.put(`/api/tasks/${draggableId}`, {
        status: newStatus,
        order: newOrder
      }, { withCredentials: true }).catch((err) => {
        // Handle failed promise
        console.error("Task update error:", err);
        setTasks(previousTasks);
        toast({
          title: "Synchronization Error",
          description: "Failed to save task position. Rolled back to previous state.",
          variant: "destructive",
        });
      });
    } catch (err) {
      // Catch synchronous errors (highly unlikely here, but good practice)
      console.error("Task update error:", err);
      setTasks(previousTasks);
      toast({
        title: "Synchronization Error",
        description: "An unexpected error occurred. Rolled back.",
        variant: "destructive",
      });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-6 overflow-x-auto pb-6 w-full h-full min-h-[500px]">
        {COLUMNS.map(column => {
          const columnTasks = tasks.filter(t => t.status === column.id).sort((a, b) => a.order - b.order);

          return (
            <div key={column.id} className="flex-1 min-w-[300px] max-w-[350px] flex flex-col bg-muted/20 rounded-xl border border-border overflow-hidden">
              <div className="p-4 border-b border-border bg-muted/40 shrink-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-satoshi font-semibold text-foreground text-sm uppercase tracking-wider">{column.title}</h3>
                  <span className="text-xs font-outfit font-medium text-muted-foreground bg-background px-2 py-0.5 rounded-full border border-border">
                    {columnTasks.length}
                  </span>
                </div>
              </div>
              
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`flex-1 p-3 transition-colors duration-200 ${snapshot.isDraggingOver ? 'bg-muted/40' : ''}`}
                  >
                    <div className="flex flex-col gap-3 min-h-[150px]">
                      {columnTasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                ...provided.draggableProps.style,
                                // CSS GPU ACCELERATION strictly required by persona
                                transform: snapshot.isDragging 
                                  ? provided.draggableProps.style?.transform 
                                  : 'translate3d(0,0,0)',
                              }}
                              className={`transition-opacity duration-200 ${snapshot.isDragging ? 'opacity-90 scale-\[1.02\] shadow-xl z-50' : 'opacity-100 shadow-sm'}`}
                            >
                              <Card className="border-border bg-card cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors">
                                <CardContent className="p-4">
                                  <h4 className="font-satoshi font-medium text-sm text-foreground leading-snug">{task.title}</h4>
                                  {task.description && (
                                    <p className="font-satoshi text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                                      {task.description}
                                    </p>
                                  )}
                                </CardContent>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
