"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { Calendar, Clock } from "lucide-react";

interface Task {
  id: string;
  title: string;
  dueDate: Date;
  isCompleted: boolean;
  priority: "low" | "medium" | "high";
}

interface RecentTaskListProps {
  tasks: Task[];
}

export function RecentTaskList({ tasks }: RecentTaskListProps) {
  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high": return "High";
      case "medium": return "Medium";
      case "low": return "Low";
      default: return "Normal";
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
            tasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent transition-colors duration-200 ${
                  task.isCompleted ? "opacity-60" : ""
                }`}
              >
                <Checkbox
                  checked={task.isCompleted}
                  className="border-border"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                        task.isCompleted
                          ? "bg-muted text-muted-foreground line-through"
                          : "bg-background text-foreground"
                      }`}
                    >
                      {getPriorityLabel(task.priority)}
                    </span>
                    <span
                      className={`text-sm ${
                        task.isCompleted ? "line-through text-muted-foreground" : "text-foreground"
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{format(task.dueDate, "MMM d")}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{format(task.dueDate, "HH:mm")}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}