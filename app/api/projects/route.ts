import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth-helpers';
import { createProjectSchema } from '@/lib/validations';
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

export async function GET() {
  try {
    const authUser = await requireUser();
    const userId = authUser.id;

    // Verify user exists
    const dbUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!dbUser) {
      return NextResponse.json({ success: false, error: 'User account not found' }, { status: 404 });
    }

    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } },
        ],
      },
      include: {
        owner: true,
        members: {
          include: {
            user: true,
          },
        },
        tasks: true,
        notes: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return NextResponse.json({ success: true, data: projects.map((p: any) => toProjectDTO(p as unknown as PrismaProjectResult)) });
  } catch (error) {
    console.error('Get user projects API error:', error);
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Convert deadline string to Date object if present
    if (body.deadline && typeof body.deadline === 'string') {
        body.deadline = new Date(body.deadline);
    }
    
    const validation = createProjectSchema.parse(body);

    // Authorize user
    const authUser = await requireUser();

    // Ensure user has a Personal Workspace
    let workspace = await prisma.workspace.findFirst({
      where: { ownerId: authUser.id, name: 'Personal Workspace' }
    });

    if (!workspace) {
      workspace = await prisma.workspace.create({
        data: {
          name: 'Personal Workspace',
          slug: `personal-${authUser.id.substring(0, 8)}`,
          description: 'Your default personal workspace.',
          ownerId: authUser.id,
        }
      });
    }

    const project = await prisma.project.create({
      data: {
        name: validation.name,
        description: validation.description,
        deadline: validation.deadline,
        ownerId: authUser.id,
        workspaceId: workspace.id,
      },
      include: {
        owner: true,
        members: {
          include: {
            user: true,
          },
        },
        tasks: true,
        notes: true,
      },
    });

    return NextResponse.json({ success: true, data: toProjectDTO(project as unknown as PrismaProjectResult) }, { status: 201 });
  } catch (error) {
    console.error('Create project API error:', error);
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues[0]?.message || 'Invalid input' }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Failed to create project' }, { status: 500 });
  }
}
