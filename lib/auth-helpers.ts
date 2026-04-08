import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

// Supabase user type
interface SupabaseUser {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
  created_at?: string;
  updated_at?: string;
}

// Extended user with dbUser
export interface AuthUser extends SupabaseUser {
  dbUser: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
}

/**
 * Gets the current authenticated user and verifies they exist in the database.
 * Throws an error if not authorized.
 */
export async function requireUser(): Promise<AuthUser> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('Unauthorized: No user session found');
  }

  // Verify user exists in our database
  let dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  // Bulletproof Auth Sync: Auto-create the Prisma record if Supabase authenticated them but they are missing
  if (!dbUser) {
    dbUser = await prisma.user.upsert({
      where: { id: user.id },
      create: {
        id: user.id,
        email: user.email!,
        name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Unknown User',
        avatarUrl: user.user_metadata?.avatar_url || null,
      },
      update: {
        email: user.email!,
        name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Unknown User',
        avatarUrl: user.user_metadata?.avatar_url || null,
      }
    });
  }

  return {
    ...user,
    dbUser,
  } as AuthUser;
}

/**
 * Checks if a user is the owner of a project.
 */
export async function isProjectOwner(projectId: string, userId: string): Promise<boolean> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { ownerId: true },
  });

  return project?.ownerId === userId;
}

/**
 * Checks if a user is a member of a project (owner or ProjectMember)
 */
export async function isProjectMember(projectId: string, userId: string): Promise<boolean> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { 
      ownerId: true, 
      members: { 
        where: { userId } 
      } 
    },
  });

  if (!project) return false;
  return project.ownerId === userId || project.members.length > 0;
}

/**
 * Authorizes that the user can modify a project (owner or member)
 */
export async function authorizeProjectModify(projectId: string, userId: string): Promise<void> {
  const isMember = await isProjectMember(projectId, userId);
  if (!isMember) {
    throw new Error('Unauthorized: You are not a member of this project');
  }
}

/**
 * Checks if a user has access to a task (through project membership)
 */
export async function isTaskAccessible(taskId: string, userId: string): Promise<boolean> {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: {
      projectId: true,
      project: {
        select: {
          ownerId: true,
          members: { where: { userId } },
        },
      },
    },
  });

  if (!task || !task.project) return false;
  return task.project.ownerId === userId || task.project.members.length > 0;
}

/**
 * Authorizes that the user can access a task
 */
export async function authorizeTaskAccess(taskId: string, userId: string): Promise<void> {
  const canAccess = await isTaskAccessible(taskId, userId);
  if (!canAccess) {
    throw new Error('Unauthorized: You do not have access to this task');
  }
}

/**
 * Authorizes that the user can modify a task (same as access for now)
 */
export async function authorizeTaskModify(taskId: string, userId: string): Promise<void> {
  await authorizeTaskAccess(taskId, userId);
}

/**
 * Checks if a user has access to a note (author or shared via project)
 */
export async function isNoteAccessible(noteId: string, userId: string): Promise<boolean> {
  const note = await prisma.note.findUnique({
    where: { id: noteId },
    select: {
      authorId: true,
      projectId: true,
      project: {
        select: {
          ownerId: true,
          members: { where: { userId } },
        },
      },
    },
  });

  if (!note) return false;
  if (note.authorId === userId) return true;
  if (!note.projectId) return false;
  
  return note.project?.ownerId === userId || (note.project?.members.length ?? 0) > 0;
}

/**
 * Authorizes that the user can access a note
 */
export async function authorizeNoteAccess(noteId: string, userId: string): Promise<void> {
  const canAccess = await isNoteAccessible(noteId, userId);
  if (!canAccess) {
    throw new Error('Unauthorized: You do not have access to this note');
  }
}

/**
 * Authorizes that the user can modify a note (only author)
 */
export async function authorizeNoteModify(noteId: string, userId: string): Promise<void> {
  const note = await prisma.note.findUnique({
    where: { id: noteId },
    select: { authorId: true },
  });

  if (!note) {
    throw new Error('Note not found');
  }

  if (note.authorId !== userId) {
    throw new Error('Unauthorized: Only the author can modify this note');
  }
}

/**
 * Authorizes that the user can modify a flashcard deck (only author)
 */
export async function authorizeDeckModify(deckId: string, userId: string): Promise<void> {
  const deck = await prisma.flashcardDeck.findUnique({
    where: { id: deckId },
    select: { authorId: true },
  });

  if (!deck) {
    throw new Error('Flashcard deck not found');
  }

  if (deck.authorId !== userId) {
    throw new Error('Unauthorized: Only the author can modify this deck');
  }
}

// ─────────────────────────────────────────────────────────
// Workspace-level auth helpers
// ─────────────────────────────────────────────────────────

/**
 * Checks if a user is the owner of a workspace.
 */
export async function isWorkspaceOwner(workspaceId: string, userId: string): Promise<boolean> {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    select: { ownerId: true },
  });
  return workspace?.ownerId === userId;
}

/**
 * Checks if a user is a member OR owner of a workspace.
 */
export async function isWorkspaceMember(workspaceId: string, userId: string): Promise<boolean> {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    select: {
      ownerId: true,
      members: { where: { userId } },
    },
  });
  if (!workspace) return false;
  return workspace.ownerId === userId || workspace.members.length > 0;
}

/**
 * Throws an error if the user is NOT the owner of the workspace.
 * Use this to protect owner-only actions (invite, kick, etc).
 */
export async function authorizeWorkspaceOwner(workspaceId: string, userId: string): Promise<void> {
  const owner = await isWorkspaceOwner(workspaceId, userId);
  if (!owner) {
    throw new Error('Unauthorized: Only the workspace owner can perform this action');
  }
}

/**
 * Throws an error if the user is NOT a member or owner of the workspace.
 */
export async function authorizeWorkspaceAccess(workspaceId: string, userId: string): Promise<void> {
  const member = await isWorkspaceMember(workspaceId, userId);
  if (!member) {
    throw new Error('Unauthorized: You are not a member of this workspace');
  }
}

/**
 * Returns the role of a user in a workspace: \'OWNER\', \'MEMBER\', or null (no access).
 */
export async function getWorkspaceRole(
  workspaceId: string,
  userId: string
): Promise<'OWNER' | 'MEMBER' | null> {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    select: {
      ownerId: true,
      members: { where: { userId } },
    },
  });
  if (!workspace) return null;
  if (workspace.ownerId === userId) return 'OWNER';
  if (workspace.members.length > 0) return 'MEMBER';
  return null;
}
