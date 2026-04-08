import { z } from 'zod';

// Project validation schemas
export const createProjectSchema = z.object({
  name: z.string()
    .min(1, 'Project name is required')
    .max(100, 'Project name must be less than 100 characters')
    .trim(),
  description: z.string()
    .max(500, 'Description must be less than 500 characters')
    .optional()
    .nullable()
    .transform(val => val || null),
  deadline: z.union([z.string().datetime(), z.date()])
    .optional()
    .nullable()
    .transform(val => val ? new Date(val) : null),
});

export const updateProjectSchema = z.object({
  name: z.string()
    .min(1, 'Project name is required')
    .max(100, 'Project name must be less than 100 characters')
    .trim()
    .optional(),
  description: z.string()
    .max(500, 'Description must be less than 500 characters')
    .optional()
    .nullable(),
  deadline: z.union([z.string().datetime(), z.date()])
    .optional()
    .nullable()
    .transform(val => val ? new Date(val) : null),
  progress: z.number()
    .min(0, 'Progress must be between 0 and 100')
    .max(100, 'Progress must be between 0 and 100')
    .optional(),
});

// Task validation schemas
export const createTaskSchema = z.object({
  title: z.string()
    .min(1, 'Task title is required')
    .max(200, 'Task title must be less than 200 characters')
    .trim(),
  description: z.string()
    .max(2000, 'Description must be less than 2000 characters')
    .optional()
    .nullable(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'REVISION', 'DONE']),
  deadline: z.union([z.string().datetime(), z.date()])
    .optional()
    .nullable()
    .transform(val => val ? new Date(val) : null),
  projectId: z.string()
    .min(1, 'Project ID is required'),
  assigneeId: z.string()
    .uuid()
    .optional()
    .nullable(),
});

export const updateTaskSchema = z.object({
  title: z.string()
    .min(1, 'Task title is required')
    .max(200, 'Task title must be less than 200 characters')
    .trim()
    .optional(),
  description: z.string()
    .max(2000, 'Description must be less than 2000 characters')
    .optional()
    .nullable(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'REVISION', 'DONE'])
    .optional(),
  deadline: z.union([z.string().datetime(), z.date()])
    .optional()
    .nullable()
    .transform(val => val ? new Date(val) : null),
  assigneeId: z.string()
    .uuid()
    .optional()
    .nullable(),
});

// Note validation schemas
export const createNoteSchema = z.object({
  title: z.string()
    .min(1, 'Note title is required')
    .max(200, 'Note title must be less than 200 characters')
    .trim(),
  content: z.string()
    .max(50000, 'Content must be less than 50000 characters')
    .optional()
    .nullable(),
  projectId: z.string()
    .uuid()
    .optional()
    .nullable(),
  meetingDate: z.union([z.string().datetime(), z.date()])
    .optional()
    .nullable()
    .transform(val => val ? new Date(val) : null),
});

export const updateNoteSchema = z.object({
  title: z.string()
    .min(1, 'Note title is required')
    .max(200, 'Note title must be less than 200 characters')
    .trim()
    .optional(),
  content: z.string()
    .max(50000, 'Content must be less than 50000 characters')
    .optional()
    .nullable(),
  meetingDate: z.union([z.string().datetime(), z.date()])
    .optional()
    .nullable()
    .transform(val => val ? new Date(val) : null),
});

// Flashcard deck validation schemas
export const createDeckSchema = z.object({
  title: z.string()
    .min(1, 'Deck title is required')
    .max(100, 'Deck title must be less than 100 characters')
    .trim(),
  description: z.string()
    .max(500, 'Description must be less than 500 characters')
    .optional()
    .nullable(),
  noteId: z.string()
    .uuid()
    .optional()
    .nullable(),
});

// Flashcard validation schemas
export const createFlashcardSchema = z.object({
  front: z.string()
    .min(1, 'Front side is required')
    .max(500, 'Front side must be less than 500 characters')
    .trim(),
  back: z.string()
    .min(1, 'Back side is required')
    .max(1000, 'Back side must be less than 1000 characters')
    .trim(),
  deckId: z.string()
    .min(1, 'Deck ID is required'),
});

// Member invitation schema (Project level)
export const addMemberSchema = z.object({
  userId: z.string()
    .uuid('User ID must be a valid UUID'),
  roleName: z.string()
    .min(1, 'Role name is required')
    .max(50, 'Role name must be less than 50 characters'),
  permission: z.enum(['LEADER', 'EDITOR', 'VIEWER']),
});

// Workspace member schemas
export const addWorkspaceMemberSchema = z.object({
  userId: z.string()
    .uuid('User ID must be a valid UUID'),
  permission: z.enum(['LEADER', 'EDITOR', 'VIEWER'])
    .default('EDITOR'),
});

export const inviteWorkspaceMemberByEmailSchema = z.object({
  email: z.string()
    .email('Please provide a valid email address')
    .toLowerCase(),
  permission: z.enum(['LEADER', 'EDITOR', 'VIEWER'])
    .default('EDITOR'),
});

export const updateWorkspaceMemberSchema = z.object({
  permission: z.enum(['LEADER', 'EDITOR', 'VIEWER']),
});

// Share schemas
export const createShareSchema = z.object({
  itemType: z.enum(['PROJECT', 'NOTE']),
  itemId: z.string().min(1, 'Item ID is required'),
  receiverId: z.string().min(1, 'Receiver ID is required'),
  permission: z.enum(['VIEW', 'COPY']).default('VIEW'),
});

export const updateShareSchema = z.object({
  action: z.enum(['ACCEPT', 'REJECT', 'CANCEL']),
});
