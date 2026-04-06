"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Calendar, Clock, CheckCircle } from "lucide-react";
import { type Task as DbTask, TaskStatus } from "@/lib/types";

interface RecentTaskListProps {
  tasks: DbTask[];
}

export function RecentTaskList({ tasks }: RecentTaskListProps) {
  const getStatusLabel = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.DONE: return "Done";
      case TaskStatus.IN_PROGRESS: return "In Progress";
      case TaskStatus.REVIEW: return "Review";
      case TaskStatus.REVISION: return "Revision";
      default: return "To Do";
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.DONE: return "bg-green-100 text-green-800 border-green-200";
      case TaskStatus.IN_PROGRESS: return "bg-blue-100 text-blue-800 border-blue-200";
      case TaskStatus.REVIEW: return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case TaskStatus.REVISION: return "bg-orange-100 text-orange-800 border-orange-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Card className="bg-background border border-border shadow-sm rounded-xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">My Tasks</CardTitle>
          <span className="text-sm text-muted-foreground">{tasks.length} tasks</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No tasks yet. Add your first task to get started!
            </div>
          ) : (
            tasks.map((task) => {
              const isCompleted = task.status === TaskStatus.DONE;
              return (
                <div
                  key={task.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent transition-colors duration-200 ${
                    isCompleted ? "opacity-60" : ""
                  }`}
                >
                  <CheckCircle className={`h-5 w-5 ${isCompleted ? "text-green-600" : "text-muted-foreground"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}
                      >
                        {getStatusLabel(task.status)}
                      </span>
                      <span
                        className={`text-sm ${
                          isCompleted ? "line-through text-muted-foreground" : "text-foreground"
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>
                    {task.deadline && (
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{format(task.deadline, "MMM d, yyyy")}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{format(task.deadline, "HH:mm")}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}