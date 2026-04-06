export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  REVISION = 'REVISION',
  DONE = 'DONE',
}

export enum PermissionLevel {
  VIEWER = 'VIEWER',
  EDITOR = 'EDITOR',
  LEADER = 'LEADER',
}

export interface User {
  id: string
  email: string
  name: string
  avatarUrl: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Project {
  id: string
  name: string
  description: string | null
  progress: number
  deadline: Date | null
  createdAt: Date
  updatedAt: Date
  ownerId: string
  owner?: User
  members?: ProjectMember[]
  tasks?: Task[]
  notes?: Note[]
  _count?: {
    tasks: number
  }
}

export interface ProjectMember {
  id: string
  roleName: string
  permission: PermissionLevel
  joinedAt: Date
  projectId: string
  userId: string
  project?: Project
  user: User
}

export interface Task {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  deadline: Date | null
  proofUrl: string | null
  proofNotes: string | null
  feedback: string | null
  projectId: string
  order: number
  workspaceId?: string
  assigneeId: string | null
  project?: Project
  workspace?: Record<string, unknown> | null
  assignee?: User | null
  createdAt: Date
  updatedAt: Date
}

export interface Note {
  id: string
  title: string
  content: string | null
  audioUrl: string | null
  transcript: string | null
  summary: string | null
  meetingDate: Date | null
  authorId: string
  projectId: string | null
  author?: User
  project?: Project | null
  flashcardDecks?: FlashcardDeck[]
  createdAt: Date
  updatedAt: Date
}

// Flashcard Types
export interface FlashcardDeck {
  id: string
  title: string
  description: string | null
  authorId: string
  noteId: string | null
  author?: User
  note?: Note | null
  cards?: Flashcard[]
  createdAt: Date
  updatedAt: Date
}

export interface Flashcard {
  id: string
  front: string
  back: string
  nextReview: Date
  interval: number
  easeFactor: number
  repetitions: number
  deckId: string
  deck?: FlashcardDeck
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// Form Types
export interface CreateProjectForm {
  name: string
  description?: string
  deadline?: Date
}

export interface CreateTaskForm {
  title: string
  description?: string
  status: TaskStatus
  deadline?: Date
  projectId: string
  assigneeId?: string
}

export interface CreateNoteForm {
  title: string
  content?: string
  projectId?: string
  meetingDate?: Date
}

// Dashboard Types
export interface DashboardStats {
  totalProjects: number
  activeTasks: number
  completedTasks: number
  upcomingDeadlines: number
  recentProjects: Project[]
  upcomingDeadlineTasks: Task[]
}

export interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  type: 'task' | 'meeting' | 'deadline'
  projectId?: string
  taskId?: string
  noteId?: string
}

// AI Types
export interface AISummaryRequest {
  type: 'meeting-summary' | 'flashcards'
  content: string
  model?: string
}

export interface FlashcardGenerationResult {
  front: string
  back: string
}

// Prisma Query Result Types (for DTO transformations)
export interface PrismaProjectResult {
  id: string
  name: string
  description: string | null
  progress: number
  deadline: Date | null
  createdAt: Date
  updatedAt: Date
  ownerId: string
  _count?: { tasks: number }
  owner?: User
  members?: ProjectMember[]
  tasks?: Task[]
  notes?: Note[]
}

export interface PrismaTaskResult {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  deadline: Date | null
  proofUrl: string | null
  proofNotes: string | null
  feedback: string | null
  projectId: string
  order: number
  workspaceId?: string
  assigneeId: string | null
  project?: Project
  workspace?: Record<string, unknown> | null
  assignee?: User | null
  createdAt: Date
  updatedAt: Date
}

export interface PrismaNoteResult {
  id: string
  title: string
  content: string | null
  audioUrl: string | null
  transcript: string | null
  summary: string | null
  meetingDate: Date | null
  authorId: string
  projectId: string | null
  author?: User
  project?: Project | null
  flashcardDecks?: FlashcardDeck[]
  createdAt: Date
  updatedAt: Date
}

export interface PrismaFlashcardDeckResult {
  id: string
  title: string
  description: string | null
  authorId: string
  noteId: string | null
  author?: User
  note?: Note | null
  cards?: PrismaFlashcardResult[]
  createdAt: Date
  updatedAt: Date
}

export interface PrismaFlashcardResult {
  id: string
  front: string
  back: string
  nextReview: Date
  interval: number
  easeFactor: number
  repetitions: number
  deckId: string
  deck?: FlashcardDeck
}

export interface PrismaProjectMemberResult {
  id: string
  roleName: string
  permission: PermissionLevel
  joinedAt: Date
  projectId: string
  userId: string
  project?: Project
  user: User
}
