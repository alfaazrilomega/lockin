import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Calendar, Users } from "lucide-react"
import { type Project } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import Link from "next/link"

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/dashboard/projects/${project.id}`}>
      <Card className="group bg-background border-border shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden border-l-4 border-l-primary">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl font-semibold font-satoshi group-hover:text-primary transition-colors">
              {project.name}
            </CardTitle>
            {project.deadline && (
              <div className="flex items-center text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                <Calendar className="h-3 w-3 mr-1" />
                {formatDate(project.deadline)}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
            {project.description || "No description provided."}
          </p>
          
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span>Progress</span>
              <span className="font-outfit">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-1.5" />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="flex items-center text-xs text-muted-foreground">
              <Users className="h-3 w-3 mr-1" />
            <span>{(project.members?.length ?? 0)} member{(project.members?.length ?? 0) !== 1 ? 's' : ''}</span>
            </div>
            <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/60">
              View Details →
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}