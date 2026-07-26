'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import type { Task } from '@/lib/types';

const KanbanBoard = dynamic(
  () => import('./KanbanBoard').then((mod) => mod.KanbanBoard),
  { ssr: false }
);

interface KanbanBoardWrapperProps {
  initialTasks: Task[];
  projectId?: string;
  workspaceId?: string;
}

export function KanbanBoardWrapper(props: KanbanBoardWrapperProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center p-12 border border-dashed border-border rounded-xl bg-muted/20">
        <div className="text-muted-foreground font-satoshi text-sm">Loading Kanban Board...</div>
      </div>
    );
  }

  return <KanbanBoard {...props} />;
}
