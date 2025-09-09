import { 
  DatabaseObjectResponse,
  PageObjectResponse,
  PartialDatabaseObjectResponse,
  PartialPageObjectResponse
} from '@notionhq/client/build/src/api-endpoints';

// Base Notion types
export type NotionDatabase = DatabaseObjectResponse | PartialDatabaseObjectResponse;
export type NotionPage = PageObjectResponse | PartialPageObjectResponse;

// Project status enum
export enum ProjectStatus {
  NOT_STARTED = 'Not Started',
  IN_PROGRESS = 'In Progress',
  ON_HOLD = 'On Hold',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled'
}

// Task priority enum
export enum TaskPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  URGENT = 'Urgent'
}

// Task status enum
export enum TaskStatus {
  TODO = 'To Do',
  IN_PROGRESS = 'In Progress',
  REVIEW = 'Review',
  DONE = 'Done',
  BLOCKED = 'Blocked'
}

// Project interface
export interface Project {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  startDate?: string;
  endDate?: string;
  priority: TaskPriority;
  teamMembers: string[];
  tags: string[];
  progress: number;
  url?: string;
  createdAt: string;
  updatedAt: string;
}

// Task interface
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: string;
  projectId?: string;
  projectName?: string;
  dueDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  tags: string[];
  url?: string;
  createdAt: string;
  updatedAt: string;
}

// Team member interface
export interface TeamMember {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  role?: string;
}

// Notion workspace configuration
export interface NotionWorkspaceConfig {
  workspaceId?: string;
  projectsDatabaseId?: string;
  tasksDatabaseId?: string;
  teamDatabaseId?: string;
}

// API response types
export interface NotionApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Database query options
export interface DatabaseQueryOptions {
  filter?: any;
  sorts?: any[];
  startCursor?: string;
  pageSize?: number;
}

// Database creation options
export interface DatabaseCreateOptions {
  parent: {
    type: 'page_id';
    page_id: string;
  };
  title: {
    type: 'title';
    title: {
      type: 'text';
      text: {
        content: string;
      };
    }[];
  }[];
  properties: Record<string, any>;
  icon?: {
    type: 'emoji';
    emoji: string;
  };
}

// Page creation options
export interface PageCreateOptions {
  parent: {
    type: 'database_id';
    database_id: string;
  };
  properties: Record<string, any>;
  children?: any[];
  icon?: {
    type: 'emoji';
    emoji: string;
  };
}

// Sync status
export interface SyncStatus {
  lastSyncAt?: string;
  isConnected: boolean;
  syncInProgress: boolean;
  errorMessage?: string;
}

// Dashboard metrics
export interface DashboardMetrics {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  teamMembers: number;
}

// Notion connection status
export interface NotionConnectionStatus {
  isConnected: boolean;
  workspaceName?: string;
  lastSync?: string;
  syncStatus: 'idle' | 'syncing' | 'error';
  errorMessage?: string;
}