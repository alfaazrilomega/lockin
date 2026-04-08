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

// Role on a workspace: OWNER (creator) or MEMBER (invited)
export type WorkspaceRole = 'OWNER' | 'MEMBER'

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

export interface Workspace {
  id: string
  name: string
  slug: string
  description: string | null
  ownerId: string
  owner?: User
  members?: WorkspaceMember[]
  createdAt: Date
  updatedAt: Date
}

export interface WorkspaceMember {
  id: string
  permission: PermissionLevel
  joinedAt: Date
  workspaceId: string
  userId: string
  workspace?: Workspace
  user: User
}

// DTO returned by the API — includes computed role fields
export interface WorkspaceMemberDTO {
  id: string | null          // null when entry represents the owner (not in members table)
  userId: string
  name: string
  email: string
  avatarUrl: string | null
  permission: PermissionLevel | null  // null for owner
  isOwner: boolean
  joinedAt: Date | null      // null for owner
}

export interface WorkspaceMembersResponse {
  members: WorkspaceMemberDTO[]
  currentUserRole: WorkspaceRole
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

export interface PrismaWorkspaceResult {
  id: string
  name: string
  slug: string
  description: string | null
  ownerId: string
  createdAt: Date
  updatedAt: Date
  owner?: User
  members?: PrismaWorkspaceMemberResult[]
}

export interface PrismaWorkspaceMemberResult {
  id: string
  permission: PermissionLevel
  joinedAt: Date
  workspaceId: string
  userId: string
  workspace?: Workspace
  user: User
}

export interface PrismaSharedResourceResult {
  id: string
  itemType: 'PROJECT' | 'NOTE'
  senderId: string
  receiverId: string
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED'
  permission: 'VIEW' | 'COPY'
  projectId: string | null
  noteId: string | null
  createdAt: Date
  updatedAt: Date
  sender?: User
  receiver?: User
  project?: Project | null
  note?: Note | null
}
