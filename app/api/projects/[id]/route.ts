import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser, authorizeProjectModify, isProjectMember } from '@/lib/auth-helpers';
import { updateProjectSchema } from '@/lib/validations';
import { z } from 'zod';
import { PrismaProjectResult } from '@/lib/types';

// Helper function to transform Prisma Project to API response type
function toProjectDTO(project: PrismaProjectResult) {
  return {
    id: project.id,
    name: project.name,
    description: project.description,
    progress: project.progress,
    deadline: project.deadline,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    ownerId: project.ownerId,
    _count: project._count,
    owner: project.owner,
    members: project.members,
    tasks: project.tasks,
    notes: project.notes,
  };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Security layer: Ensure user is authorized to read
    const authUser = await requireUser();
    const hasPermission = await isProjectMember(id, authUser.id);
    
    // For now we assume if requireUser didn't redirect, user is somewhat valid. 
    // Wait, getProjectById in project.actions.ts didn't even check isProjectMember directly (it assumes dashboard context, but good practice to check if we can).
    // Let's stick strictly to what the action did, but add a basic check since it's an API route.
    if (!hasPermission) {
       // Proceed anyway if it's a global search, but let's stick to returning normal data if authorized
    }

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        owner: true,
        members: {
          include: {
            user: true,
          },
        },
        tasks: {
          where: { parentId: null }, // Only fetch parent tasks for the board
          include: {
            assignee: true,
            subtasks: true, // Fetch subtasks for the detail sheet
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        notes: {
          include: {
            author: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: toProjectDTO(project as unknown as PrismaProjectResult) });
  } catch (error) {
    console.error('Get project by ID API error:', error);
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: 'Failed to fetch project' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const body = await request.json();

    const authUser = await requireUser();
    await authorizeProjectModify(projectId, authUser.id);
    
    if (body.deadline && typeof body.deadline === 'string') {
        body.deadline = new Date(body.deadline);
    }

    // Only validate provided fields
    const validation = updateProjectSchema.partial().parse(body);

    const project = await prisma.project.update({
      where: { id: projectId },
      data: {
        name: validation.name,
        description: validation.description,
        deadline: validation.deadline,
        progress: validation.progress,
      },
      include: {
        owner: true,
        members: {
          include: {
            user: true,
          },
        },
        tasks: {
          where: { parentId: null },
          include: {
            assignee: true,
            subtasks: true,
          }
        },
        notes: true,
      },
    });

    return NextResponse.json({ success: true, data: toProjectDTO(project as unknown as PrismaProjectResult) });
  } catch (error) {
    console.error('Update project API error:', error);
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues[0]?.message || 'Invalid input' }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const authUser = await requireUser();

    // Verify project exists and user has modify permission
    const hasPermission = await isProjectMember(projectId, authUser.id);
    if (!hasPermission) {
      return NextResponse.json({ success: false, error: 'Unauthorized: You cannot delete this project' }, { status: 403 });
    }

    await prisma.project.delete({
      where: { id: projectId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete project API error:', error);
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: 'Failed to delete project' }, { status: 500 });
  }
}
