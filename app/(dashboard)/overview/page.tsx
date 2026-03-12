import { StatCard } from "@/components/shared/stat-card";
import { ProjectCard } from "@/components/shared/project-card";
import { RecentTaskList } from "@/components/shared/recent-task-list";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar, Users, CheckCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import { createClient } from '@/lib/supabase/server';


// Mock data for demonstration - replace with actual data fetching
const mockStats = [
  { title: "Total Projects", value: 12, icon: <Calendar className="h-5 w-5" /> },
  { title: "Pending Tasks", value: 8, icon: <Clock className="h-5 w-5" /> },
  { title: "Due Today", value: 3, icon: <CheckCircle className="h-5 w-5" /> },
  { title: "Team Members", value: 15, icon: <Users className="h-5 w-5" /> },
];

const mockProjects = [
  {
    id: "1",
    name: "LockIn Dashboard Redesign",
    description: "Complete UI/UX overhaul for the dashboard.",
    deadline: new Date(2024, 2, 15),
    progress: 75,
    teamSize: 4,
    ownerId: "mock-user-1",
    createdAt: new Date(2024, 0, 1),
    updatedAt: new Date(2024, 2, 1),
  },
  {
    id: "2",
    name: "AI Note Processing",
    description: "Integrate AI into the note-taking pipeline.",
    deadline: new Date(2024, 2, 20),
    progress: 45,
    teamSize: 3,
    ownerId: "mock-user-1",
    createdAt: new Date(2024, 0, 5),
    updatedAt: new Date(2024, 2, 5),
  },
  {
    id: "3",
    name: "Flashcard System",
    description: "Build spaced-repetition flashcard functionality.",
    deadline: new Date(2024, 2, 25),
    progress: 20,
    teamSize: 2,
    ownerId: "mock-user-1",
    createdAt: new Date(2024, 0, 10),
    updatedAt: new Date(2024, 2, 10),
  },
];

const mockTasks = [
  {
    id: "1",
    title: "Review dashboard wireframes",
    dueDate: new Date(2024, 2, 10, 14, 0),
    isCompleted: false,
    priority: "high" as const,
  },
  {
    id: "2",
    title: "Implement project progress tracking",
    dueDate: new Date(2024, 2, 12, 10, 0),
    isCompleted: false,
    priority: "medium" as const,
  },
  {
    id: "3",
    title: "Add task priority system",
    dueDate: new Date(2024, 2, 11, 16, 0),
    isCompleted: true,
    priority: "low" as const,
  },
  {
    id: "4",
    title: "Test responsive design",
    dueDate: new Date(2024, 2, 13, 9, 0),
    isCompleted: false,
    priority: "medium" as const,
  },
];

export default async function DashboardPage() {
  // Check authentication on server side
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // If no user, redirect to home page
  if (!user) {

    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-foreground mb-4">Authentication Required</h1>
        <p className="text-muted-foreground mb-8">Please sign in to access the dashboard</p>
        <a href="/auth/sign-in" className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
          Sign In
        </a>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-satoshi tracking-tight font-semibold text-2xl text-foreground">
          Dashboard
        </h1>
        <div className="text-sm text-muted-foreground">
          Last updated: {format(new Date(), "MMM d, yyyy 'at' HH:mm")}
        </div>
      </div>

      {/* Statistics Cards - Top Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockStats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Main Content - Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Active Projects */}
        <Card className="bg-background border border-border shadow-sm rounded-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-foreground">
              Active Projects
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {mockProjects.length} projects in progress
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right Column: My Tasks */}
        <RecentTaskList tasks={mockTasks} />
      </div>
    </div>
  );
}