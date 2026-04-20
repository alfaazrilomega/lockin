import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth-helpers';
import { createProjectSchema } from '@/lib/validations';
import { z } from 'zod';

export async function GET() {
  try {
    const authUser = await requireUser();
    const userId = authUser.id;

    // Verify user exists
    const dbUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!dbUser) {
      return NextResponse.json({ success: false, error: 'User account not found' }, { status: 404 });
    }

    // Heavy "God-Tier" fetch mapping out the entire Agile architecture for the frontend
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } },
        ],
      },
      include: {
        owner: { select: { id: true, name: true, avatarUrl: true } },
        members: {
          include: {
            user: { select: { id: true, name: true, avatarUrl: true } },
          },
        },
        epics: {
          include: {
            _count: { select: { tasks: true } }
          }
        },
        milestones: {
          include: {
            _count: { select: { tasks: true } }
          }
        },
        // We only pull summary data for tasks to calculate swift metrics
        tasks: {
          select: {
            id: true,
            status: true,
            priority: true,
            storyPoints: true,
            epicId: true,
            milestoneId: true,
          }
        },
        _count: {
          select: { notes: true, tasks: true, epics: true, milestones: true }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Map projects into calculated Dadmin / Linear views
    const formattedProjects = projects.map(p => {
      // Metric Calculation:
      const totalPoints = p.tasks.reduce((sum, t) => sum + (t.storyPoints || 0), 0);
      const completedPoints = p.tasks.filter(t => t.status === 'DONE').reduce((sum, t) => sum + (t.storyPoints || 0), 0);
      const completedTasks = p.tasks.filter(t => t.status === 'DONE').length;
      
      const realProgress = p.tasks.length > 0 
          ? Math.round((completedTasks / p.tasks.length) * 100) 
          : 0;

      const completionVelocity = totalPoints > 0 
          ? Math.round((completedPoints / totalPoints) * 100) 
          : 0;

      return {
        id: p.id,
        name: p.name,
        description: p.description,
        status: p.status, // ACTIVE, PLANNING
        priority: p.priority, // HIGH, MEDIUM, LOW
        deadline: p.deadline,
        createdAt: p.createdAt,
        owner: p.owner,
        members: p.members,
        epics: p.epics,
        milestones: p.milestones,
        _count: p._count,
        metrics: {
          computedProgress: realProgress, // Real task completion %
          pointsVelocity: completionVelocity, // Real point completion %
          totalStoryPoints: totalPoints,
          completedStoryPoints: completedPoints,
          urgentTaskCount: p.tasks.filter(t => t.priority === 'HIGH' && t.status !== 'DONE').length
        }
      };
    });

    return NextResponse.json({ success: true, data: formattedProjects });
  } catch (error) {
    console.error('Get user god-tier projects API error:', error);
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: 'Failed to fetch complex project structure' }, { status: 500 });
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
        status: 'PLANNING', // Start in Planning logically
        priority: 'MEDIUM' 
      },
      include: {
        owner: true,
        _count: { select: { tasks: true, notes: true, epics: true, milestones: true } }
      },
    });

    return NextResponse.json({ success: true, data: project }, { status: 201 });
  } catch (error) {
    console.error('Create agile project API error:', error);
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues[0]?.message || 'Invalid input' }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Failed to create project' }, { status: 500 });
  }
}
