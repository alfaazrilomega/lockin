"use server"

import { requireUser, isProjectMember } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { TaskStatus } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { createTaskSchema } from '@/lib/validations';
import { z } from 'zod';
import { type CreateTaskForm } from '@/lib/types';

export async function updateTaskStatusAndOrder(taskId: string, newStatus: TaskStatus, newOrder: number) {
  try {
    const user = await requireUser();
    
    // Verify user has access to task (indirectly through workspace permissions)
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { workspace: { include: { members: true } } }
    });

    if (!task) throw new Error("Task not found");

    const isOwner = task.workspace?.ownerId === user.id;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isMember = task.workspace?.members.some((m: any) => 
      m.userId === user.id && ['EDITOR', 'LEADER'].includes(m.permission)
    );

    if (!isOwner && !isMember) {
      throw new Error("Unauthorized: Insufficient permissions to move this task.");
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { status: newStatus, order: newOrder }
    });

    // Revalidate paths to sync state
    revalidatePath('/workspaces');
    
    return { success: true, data: updatedTask };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Unknown error occurred' };
  }
}

export async function createTask(data: CreateTaskForm) {
  try {
    const authUser = await requireUser();
    const validation = createTaskSchema.parse(data);

    let targetProjectId = validation.projectId;
    let workspaceId: string | null = null;

    if (!targetProjectId) {
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
        return { success: false, error: 'Unauthorized: You are not a member of this project' };
      }

      // Get the project to find the workspaceId
      const project = await prisma.project.findUnique({
        where: { id: targetProjectId },
        select: { workspaceId: true, ownerId: true }
      });

      if (!project) {
        return { success: false, error: 'Project not found' };
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
      where: { projectId: targetProjectId, status: validation.status },
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
        projectId: targetProjectId,
        workspaceId: workspaceId!,
        assigneeId: validation.assigneeId,
        order: newOrder,
      },
    });

    revalidatePath(`/dashboard/projects/${validation.projectId}`);
    revalidatePath('/dashboard');
    
    return { success: true, data: task };
  } catch (error) {
    console.error('Create task error:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message || 'Invalid input' };
    }
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Failed to create task' };
  }
}
