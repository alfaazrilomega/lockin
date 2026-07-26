import { requireUser } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Briefcase, Users, ArrowRight, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { KanbanBoardWrapper } from '@/components/kanban/KanbanBoardWrapper';


export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Workspaces | LockIn',
  description: 'Manage your personal and team workspaces.',
};

export default async function WorkspacesPage() {
  const user = await requireUser();

  const globalTasks = await prisma.task.findMany({
    where: {
      workspace: {
        OR: [{ ownerId: user.id }, { members: { some: { userId: user.id } } }]
      }
    },
    orderBy: { order: 'asc' }
  });

  const workspaces = await prisma.workspace.findMany({
    where: {
      OR: [
        { ownerId: user.id },
        { members: { some: { userId: user.id } } }
      ]
    },
    include: {
      _count: {
        select: { projects: true, members: true }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div className="flex flex-col space-y-8 w-full max-w-6xl mx-auto animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-satoshi font-bold text-foreground">Workspaces</h1>
          <p className="text-muted-foreground font-satoshi mt-1">
            Manage your personal dashboard and collaborative organizations.
          </p>
        </div>
        <Button className="font-satoshi font-semibold transition-transform duration-200 hover:scale-105">
          <Plus className="w-4 h-4 mr-2" />
          New Workspace
        </Button>
      </div>

      {workspaces.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border rounded-xl bg-muted/20">
          <Briefcase className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-satoshi font-semibold text-foreground">No workspaces found</h3>
          <p className="text-muted-foreground font-satoshi mt-2 mb-6 max-w-md">
            You don&apos;t belong to any workspaces yet. Create your first workspace to start organizing your projects.
          </p>
          <Button variant="outline" className="font-satoshi transition-transform duration-200 hover:scale-105">
            Create Workspace
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {workspaces.map((workspace: any) => (
            <Link key={workspace.id} href={`/workspaces/${workspace.slug}`}>
              <Card className="h-full cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border-border bg-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-satoshi text-xl font-bold truncate">
                      {workspace.name}
                    </CardTitle>
                    {workspace.ownerId === user.id && (
                      <span className="px-2 py-1 text-[10px] uppercase tracking-wider font-outfit font-semibold bg-primary/10 text-primary rounded-full">
                        Owner
                      </span>
                    )}
                  </div>
                  <CardDescription className="font-satoshi text-sm truncate">
                    {workspace.description || 'No description provided.'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6 mt-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Briefcase className="w-4 h-4" />
                      <span className="font-outfit font-medium text-sm">
                        {workspace._count.projects} <span className="font-satoshi font-normal">Projects</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span className="font-outfit font-medium text-sm">
                        {workspace._count.members + 1} <span className="font-satoshi font-normal">Members</span>
                      </span>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center text-primary text-sm font-satoshi font-medium group">
                    Enter Workspace
                    <ArrowRight className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Global Kanban Board injected per User Request */}
      <div className="mt-16 pt-8 border-t border-border">
        <div className="mb-6">
          <h2 className="text-2xl font-satoshi font-bold text-foreground flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-primary" />
            Global Task Board
          </h2>
          <p className="text-muted-foreground font-satoshi mt-1">
            Drag and drop tasks across all your workspaces securely with 60FPS optimistic UI updates.
          </p>
        </div>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <KanbanBoardWrapper initialTasks={globalTasks as any} workspaceId="global" />
      </div>

    </div>
  );
}
