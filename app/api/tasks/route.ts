import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, isProjectMember } from "@/lib/auth-helpers";
import { createTaskSchema } from "@/lib/validations";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const authUser = await requireUser();
    const body = await req.json();
    
    // Check validation
    const validation = createTaskSchema.parse(body);

    // Verify user is a member of the project
    const hasPermission = await isProjectMember(validation.projectId, authUser.id);
    if (!hasPermission) {
      return NextResponse.json({ success: false, error: "Unauthorized: You are not a member of this project" }, { status: 403 });
    }

    // Get the project to find the workspaceId
    const project = await prisma.project.findUnique({
      where: { id: validation.projectId },
      select: { workspaceId: true, ownerId: true }
    });

    if (!project) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    }

    let workspaceId = project.workspaceId;

    if (!workspaceId) {
      // Lazy auto-create or find Personal Workspace for the project owner
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

      // Permanently back-assign the project to the workspace
      await prisma.project.update({
        where: { id: validation.projectId },
        data: { workspaceId }
      });
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
        projectId: validation.projectId,
        workspaceId: workspaceId, // Use the resolved workspaceId
        assigneeId: validation.assigneeId,
        order: newOrder,
        // Phase 0.5 Refinements
        priority: validation.priority || 'MEDIUM',
        storyPoints: validation.storyPoints || null,
        timeSpent: validation.timeSpent || null,
        parentId: validation.parentId || null,
        epicId: validation.epicId || null,
        milestoneId: validation.milestoneId || null,
      },
    });

    return NextResponse.json({ success: true, data: task }, { status: 201 });
  } catch (error) {
    console.error("Create task REST API error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues[0]?.message || "Invalid input" }, { status: 400 });
    }
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      throw error; // Let Next.js handle redirects internally
    }
    return NextResponse.json({ success: false, error: "Failed to create task" }, { status: 500 });
  }
}
