import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, isProjectMember } from "@/lib/auth-helpers";
import { createTaskSchema } from "@/lib/validations";
import { z } from "zod";
import { Quadrant } from "@prisma/client"; // (BARU) Import enum Quadrant

export async function GET(req: Request) {
  try {
    const authUser = await requireUser();
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');
    const workspaceId = searchParams.get('workspaceId');
    const status = searchParams.get('status');
    const assigneeId = searchParams.get('assigneeId');
    const quadrant = searchParams.get('quadrant'); // (BARU) Ambil query quadrant

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereClause: any = {};

    if (projectId) {
      const hasPermission = await isProjectMember(projectId, authUser.id);
      if (!hasPermission) {
        return NextResponse.json({ success: false, error: "Unauthorized: You are not a member of this project" }, { status: 403 });
      }
      whereClause.projectId = projectId;
    } else if (workspaceId) {
      whereClause.workspaceId = workspaceId;
    } else {
      whereClause.OR = [
        { assigneeId: authUser.id },
        { project: { ownerId: authUser.id } },
        { project: { members: { some: { userId: authUser.id } } } },
      ];
    }

    if (status) {
      whereClause.status = status;
    }
    if (assigneeId) {
      whereClause.assigneeId = assigneeId;
    }
    if (quadrant) { // (BARU) Filter berdasarkan Kuadran
      whereClause.quadrant = quadrant as Quadrant;
    }

    const tasks = await prisma.task.findMany({
      where: whereClause,
      include: {
        assignee: { select: { id: true, name: true, avatarUrl: true, email: true } },
        subtasks: {
          include: { assignee: { select: { id: true, name: true, avatarUrl: true } } },
          orderBy: { order: 'asc' }
        },
        _count: { select: { comments: true } }
      },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json({ success: true, data: tasks });
  } catch (error: unknown) {
    console.error("GET tasks API error:", error);
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) throw error;
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authUser = await requireUser();
    const body = await req.json();
    
    // Check validation
    const validation = createTaskSchema.parse(body);
    let targetProjectId = validation.projectId;
    let workspaceId: string | null = null;

    if (!targetProjectId) {
      // Auto-resolve or create default personal workspace & project
      let personalWorkspace = await prisma.workspace.findFirst({
        where: { ownerId: authUser.id, name: 'Personal Workspace' }
      });

      if (!personalWorkspace) {
        personalWorkspace = await prisma.workspace.create({
          data: {
            name: 'Personal Workspace',
            slug: `personal-${authUser.id.substring(0, 8)}`,
            description: 'Your default personal workspace.',
            ownerId: authUser.id,
          }
        });
      }

      let defaultProject = await prisma.project.findFirst({
        where: { ownerId: authUser.id, name: 'General Tasks' },
        select: { id: true, workspaceId: true }
      });

      if (!defaultProject) {
        defaultProject = await prisma.project.create({
          data: {
            name: 'General Tasks',
            description: 'Default workspace project for quick tasks.',
            ownerId: authUser.id,
            workspaceId: personalWorkspace.id,
            status: 'ACTIVE',
            priority: 'MEDIUM'
          },
          select: { id: true, workspaceId: true }
        });
      }

      targetProjectId = defaultProject.id;
      workspaceId = personalWorkspace.id;
    } else {
      // Verify user is a member of the project
      const hasPermission = await isProjectMember(targetProjectId, authUser.id);
      if (!hasPermission) {
        return NextResponse.json({ success: false, error: "Unauthorized: You are not a member of this project" }, { status: 403 });
      }

      // Get the project to find the workspaceId
      const project = await prisma.project.findUnique({
        where: { id: targetProjectId },
        select: { workspaceId: true, ownerId: true }
      });

      if (!project) {
        return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
      }

      workspaceId = project.workspaceId;

      if (!workspaceId) {
        let personalWorkspace = await prisma.workspace.findFirst({
          where: { ownerId: project.ownerId, name: 'Personal Workspace' }
        });

        if (!personalWorkspace) {
          personalWorkspace = await prisma.workspace.create({
            data: {
              name: 'Personal Workspace',
              slug: `personal-${project.ownerId.substring(0, 8)}`,
              description: 'Your default personal workspace.',
              ownerId: project.ownerId,
            }
          });
        }
        
        workspaceId = personalWorkspace.id;

        await prisma.project.update({
          where: { id: targetProjectId },
          data: { workspaceId }
        });
      }
    }

    // Determine the next order index for the Kanban board
    const lastTask = await prisma.task.findFirst({
      where: { projectId: validation.projectId, status: validation.status },
      orderBy: { order: 'desc' },
      select: { order: true }
    });
    
    // Add 1000 to the last order to space them out evenly
    const newOrder = lastTask ? lastTask.order + 1000 : 1000;

    const task = await prisma.task.create({
      data: {
        title: validation.title,
        description: validation.description,
        status: validation.status,
        deadline: validation.deadline,
        projectId: targetProjectId!,
        workspaceId: workspaceId!,
        assigneeId: validation.assigneeId,
        order: newOrder,
        priority: validation.priority || 'MEDIUM',
        storyPoints: validation.storyPoints || null,
        timeSpent: validation.timeSpent || null,
        
        // --- FITUR ENTERPRISE (DIAMBIL DARI ZOD ATAU LANGSUNG DARI BODY) ---
        // Fallback ke `body` jika Zod schema belum di-update dan membuang payload ini
        parentId: validation.parentId || body.parentId || null,
        epicId: validation.epicId || null,
        milestoneId: validation.milestoneId || null,
        quadrant: validation.quadrant || body.quadrant || null,
        startDate: (validation as any).startDate ? new Date((validation as any).startDate) 
                   : (body.startDate ? new Date(body.startDate) : null),
      },
    });

    return NextResponse.json({ success: true, data: task }, { status: 201 });
  } catch (error) {
    console.error("Create task REST API error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues[0]?.message || "Invalid input" }, { status: 400 });
    }
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      throw error;
    }
    return NextResponse.json({ success: false, error: "Failed to create task" }, { status: 500 });
  }
}