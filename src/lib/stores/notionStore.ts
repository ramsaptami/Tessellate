import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { NotionWorkspaceConfig, NotionConnectionStatus, Project, Task, DashboardMetrics } from '@/lib/types/notion';

interface NotionStore {
  // Configuration
  config: NotionWorkspaceConfig;
  setConfig: (config: Partial<NotionWorkspaceConfig>) => void;
  
  // Connection status
  connectionStatus: NotionConnectionStatus;
  setConnectionStatus: (status: Partial<NotionConnectionStatus>) => void;
  
  // Data
  projects: Project[];
  tasks: Task[];
  dashboardMetrics: DashboardMetrics | null;
  
  // Actions
  setProjects: (projects: Project[]) => void;
  setTasks: (tasks: Task[]) => void;
  setDashboardMetrics: (metrics: DashboardMetrics) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  removeProject: (id: string) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  removeTask: (id: string) => void;
  
  // Loading states
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  
  // Clear all data
  clearData: () => void;
}

const useNotionStore = create<NotionStore>()(
  persist(
    (set, get) => ({
      // Initial state
      config: {},
      connectionStatus: {
        isConnected: false,
        syncStatus: 'idle',
      },
      projects: [],
      tasks: [],
      dashboardMetrics: null,
      isLoading: false,

      // Configuration actions
      setConfig: (config) =>
        set((state) => ({
          config: { ...state.config, ...config },
        })),

      // Connection status actions
      setConnectionStatus: (status) =>
        set((state) => ({
          connectionStatus: { ...state.connectionStatus, ...status },
        })),

      // Data actions
      setProjects: (projects) => set({ projects }),
      
      setTasks: (tasks) => set({ tasks }),
      
      setDashboardMetrics: (dashboardMetrics) => set({ dashboardMetrics }),

      addProject: (project) =>
        set((state) => ({
          projects: [...state.projects, project],
        })),

      updateProject: (id, updates) =>
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id ? { ...project, ...updates } : project
          ),
        })),

      removeProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((project) => project.id !== id),
        })),

      addTask: (task) =>
        set((state) => ({
          tasks: [...state.tasks, task],
        })),

      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          ),
        })),

      removeTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),

      // Loading state
      setIsLoading: (isLoading) => set({ isLoading }),

      // Clear all data
      clearData: () =>
        set({
          config: {},
          connectionStatus: {
            isConnected: false,
            syncStatus: 'idle',
          },
          projects: [],
          tasks: [],
          dashboardMetrics: null,
        }),
    }),
    {
      name: 'notion-store',
      partialize: (state) => ({
        config: state.config,
        connectionStatus: state.connectionStatus,
      }),
    }
  )
);

export default useNotionStore;