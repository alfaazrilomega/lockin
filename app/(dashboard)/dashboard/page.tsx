import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, FileText, Users } from "lucide-react";
import { redirect } from "next/navigation";
import { NewProjectDialog } from "@/components/shared/new-project-dialog";
import { DashboardMetricsClient } from "@/components/dashboard/DashboardMetricsClient";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }



  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-satoshi font-bold text-foreground">
            Welcome back, {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
          </h1>
          <p className="text-muted-foreground font-satoshi mt-1">
            Here&apos;s what&apos;s happening with your projects today.
          </p>
        </div>
        <NewProjectDialog>
          <Button className="font-satoshi font-semibold transition-transform duration-200 hover:scale-105">
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </NewProjectDialog>
      </div>

      <DashboardMetricsClient />

  {/* Quick Actions Grid */ }
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    <Card className="bg-background border-border hover:border-primary/50 transition-colors cursor-pointer group">
      <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <Plus className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="font-medium text-foreground">Create Project</h3>
          <p className="text-xs text-muted-foreground">Start something new</p>
        </div>
      </CardContent>
    </Card>

    <Card className="bg-background border-border hover:border-primary/50 transition-colors cursor-pointer group">
      <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <FileText className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="font-medium text-foreground">Add Note</h3>
          <p className="text-xs text-muted-foreground">Capture ideas</p>
        </div>
      </CardContent>
    </Card>

    <Card className="bg-background border-border hover:border-primary/50 transition-colors cursor-pointer group">
      <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <Calendar className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="font-medium text-foreground">Schedule</h3>
          <p className="text-xs text-muted-foreground">Plan your time</p>
        </div>
      </CardContent>
    </Card>

    <Card className="bg-background border-border hover:border-primary/50 transition-colors cursor-pointer group">
      <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <Users className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="font-medium text-foreground">Invite</h3>
          <p className="text-xs text-muted-foreground">Add team members</p>
        </div>
      </CardContent>
    </Card>
  </div>
  </div >
    );
}