import { useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useNotionStore from '@/lib/stores/notionStore';
import { 
  NotionApiResponse, 
  NotionConnectionStatus, 
  Project, 
  Task, 
  DashboardMetrics 
} from '@/lib/types/notion';

// Query keys
const QUERY_KEYS = {
  connection: ['notion', 'connection'],
  projects: (databaseId: string) => ['notion', 'projects', databaseId],
  tasks: (databaseId: string) => ['notion', 'tasks', databaseId],
  dashboard: (projectsDb: string, tasksDb: string) => ['notion', 'dashboard', projectsDb, tasksDb],
};

export function useNotionConnection() {
  const { setConnectionStatus } = useNotionStore();

  return useQuery({
    queryKey: QUERY_KEYS.connection,
    queryFn: async (): Promise<NotionConnectionStatus> => {
      const response = await fetch('/api/notion/connection');
      const data: NotionApiResponse<NotionConnectionStatus> = await response.json();
      
      if (data.success && data.data) {
        setConnectionStatus(data.data);
        return data.data;
      } else {
        const errorStatus: NotionConnectionStatus = {
          isConnected: false,
          syncStatus: 'error',
          errorMessage: data.error || 'Connection failed',
        };
        setConnectionStatus(errorStatus);
        return errorStatus;
      }
    },
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    retry: 3,
  });
}

export function useNotionProjects(databaseId?: string) {
  const { setProjects } = useNotionStore();

  return useQuery({
    queryKey: QUERY_KEYS.projects(databaseId || ''),
    queryFn: async (): Promise<Project[]> => {
      if (!databaseId) return [];
      
      const response = await fetch(`/api/notion/projects?databaseId=${databaseId}`);
      const data: NotionApiResponse<Project[]> = await response.json();
      
      if (data.success && data.data) {
        setProjects(data.data);
        return data.data;
      } else {
        throw new Error(data.error || 'Failed to fetch projects');
      }
    },
    enabled: !!databaseId,
    staleTime: 2 * 60 * 1000, // Consider data fresh for 2 minutes
  });
}

export function useNotionTasks(databaseId?: string) {
  const { setTasks } = useNotionStore();

  return useQuery({
    queryKey: QUERY_KEYS.tasks(databaseId || ''),
    queryFn: async (): Promise<Task[]> => {
      if (!databaseId) return [];
      
      const response = await fetch(`/api/notion/tasks?databaseId=${databaseId}`);
      const data: NotionApiResponse<Task[]> = await response.json();
      
      if (data.success && data.data) {
        setTasks(data.data);
        return data.data;
      } else {
        throw new Error(data.error || 'Failed to fetch tasks');
      }
    },
    enabled: !!databaseId,
    staleTime: 2 * 60 * 1000, // Consider data fresh for 2 minutes
  });
}

export function useNotionDashboard(projectsDatabaseId?: string, tasksDatabaseId?: string) {
  const { setDashboardMetrics } = useNotionStore();

  return useQuery({
    queryKey: QUERY_KEYS.dashboard(projectsDatabaseId || '', tasksDatabaseId || ''),
    queryFn: async (): Promise<DashboardMetrics> => {
      if (!projectsDatabaseId || !tasksDatabaseId) {
        throw new Error('Both database IDs are required');
      }
      
      const response = await fetch(
        `/api/notion/dashboard?projectsDatabaseId=${projectsDatabaseId}&tasksDatabaseId=${tasksDatabaseId}`
      );
      const data: NotionApiResponse<DashboardMetrics> = await response.json();
      
      if (data.success && data.data) {
        setDashboardMetrics(data.data);
        return data.data;
      } else {
        throw new Error(data.error || 'Failed to fetch dashboard metrics');
      }
    },
    enabled: !!(projectsDatabaseId && tasksDatabaseId),
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
}

export function useCreateNotionDatabase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ parentPageId, type }: { parentPageId: string; type: 'projects' | 'tasks' }) => {
      const response = await fetch('/api/notion/databases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parentPageId, type }),
      });
      
      const data: NotionApiResponse<string> = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to create database');
      }
      
      return data.data!;
    },
    onSuccess: () => {
      // Invalidate connection query to refresh status
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.connection });
    },
  });
}

export function useCreateNotionProject(databaseId?: string) {
  const queryClient = useQueryClient();
  const { addProject } = useNotionStore();

  return useMutation({
    mutationFn: async (project: Partial<Project>) => {
      if (!databaseId) {
        throw new Error('Database ID is required');
      }
      
      const response = await fetch('/api/notion/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ databaseId, project }),
      });
      
      const data: NotionApiResponse<string> = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to create project');
      }
      
      return data.data!;
    },
    onSuccess: (projectId) => {
      // Invalidate projects query to refetch data
      if (databaseId) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects(databaseId) });
      }
    },
  });
}

export function useUpdateNotionProject() {
  const queryClient = useQueryClient();
  const { updateProject, config } = useNotionStore();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Project> }) => {
      const response = await fetch(`/api/notion/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates }),
      });
      
      const data: NotionApiResponse<boolean> = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to update project');
      }
      
      return data.data!;
    },
    onSuccess: (_, { id, updates }) => {
      // Optimistically update the store
      updateProject(id, updates);
      
      // Invalidate related queries
      if (config.projectsDatabaseId) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects(config.projectsDatabaseId) });
      }
    },
  });
}

export function useCreateNotionTask(databaseId?: string) {
  const queryClient = useQueryClient();
  const { addTask } = useNotionStore();

  return useMutation({
    mutationFn: async (task: Partial<Task>) => {
      if (!databaseId) {
        throw new Error('Database ID is required');
      }
      
      const response = await fetch('/api/notion/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ databaseId, task }),
      });
      
      const data: NotionApiResponse<string> = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to create task');
      }
      
      return data.data!;
    },
    onSuccess: () => {
      // Invalidate tasks query to refetch data
      if (databaseId) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tasks(databaseId) });
      }
    },
  });
}

export function useUpdateNotionTask() {
  const queryClient = useQueryClient();
  const { updateTask, config } = useNotionStore();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Task> }) => {
      const response = await fetch(`/api/notion/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates }),
      });
      
      const data: NotionApiResponse<boolean> = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to update task');
      }
      
      return data.data!;
    },
    onSuccess: (_, { id, updates }) => {
      // Optimistically update the store
      updateTask(id, updates);
      
      // Invalidate related queries
      if (config.tasksDatabaseId) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tasks(config.tasksDatabaseId) });
      }
    },
  });
}

export function useNotionSync() {
  const queryClient = useQueryClient();
  const { config, setConnectionStatus } = useNotionStore();

  const syncData = useCallback(async () => {
    try {
      setConnectionStatus({ syncStatus: 'syncing' });
      
      // Refetch all data
      await Promise.all([
        queryClient.refetchQueries({ queryKey: QUERY_KEYS.connection }),
        config.projectsDatabaseId && 
          queryClient.refetchQueries({ queryKey: QUERY_KEYS.projects(config.projectsDatabaseId) }),
        config.tasksDatabaseId && 
          queryClient.refetchQueries({ queryKey: QUERY_KEYS.tasks(config.tasksDatabaseId) }),
        config.projectsDatabaseId && config.tasksDatabaseId &&
          queryClient.refetchQueries({ 
            queryKey: QUERY_KEYS.dashboard(config.projectsDatabaseId, config.tasksDatabaseId) 
          }),
      ].filter(Boolean));
      
      setConnectionStatus({ 
        syncStatus: 'idle',
        lastSync: new Date().toISOString(),
      });
    } catch (error) {
      setConnectionStatus({ 
        syncStatus: 'error',
        errorMessage: error instanceof Error ? error.message : 'Sync failed',
      });
    }
  }, [queryClient, config, setConnectionStatus]);

  return { syncData };
}