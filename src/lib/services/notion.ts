import { Client } from '@notionhq/client';
import {
  Project,
  Task,
  TeamMember,
  NotionApiResponse,
  DatabaseQueryOptions,
  DatabaseCreateOptions,
  PageCreateOptions,
  ProjectStatus,
  TaskStatus,
  TaskPriority,
  NotionConnectionStatus,
  DashboardMetrics
} from '@/lib/types/notion';

class NotionService {
  private client: Client | null = null;
  private apiKey: string | null = null;

  constructor() {
    this.initialize();
  }

  private initialize() {
    const apiKey = process.env.NOTION_API_KEY;
    if (apiKey) {
      this.apiKey = apiKey;
      this.client = new Client({
        auth: apiKey,
      });
    }
  }

  // Check if Notion is connected
  isConnected(): boolean {
    return this.client !== null && this.apiKey !== null;
  }

  // Test connection and get workspace info
  async testConnection(): Promise<NotionApiResponse<NotionConnectionStatus>> {
    try {
      if (!this.client) {
        return {
          success: false,
          error: 'Notion API not configured. Please set NOTION_API_KEY environment variable.',
        };
      }

      // Test the connection by listing users
      const response = await this.client.users.list({});
      
      return {
        success: true,
        data: {
          isConnected: true,
          workspaceName: 'Connected Workspace',
          lastSync: new Date().toISOString(),
          syncStatus: 'idle',
        },
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to connect to Notion: ${error instanceof Error ? error.message : 'Unknown error'}`,
        data: {
          isConnected: false,
          syncStatus: 'error',
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  }

  // Create a new database for projects
  async createProjectsDatabase(parentPageId: string): Promise<NotionApiResponse<string>> {
    try {
      if (!this.client) {
        return { success: false, error: 'Notion client not initialized' };
      }

      const databaseOptions: DatabaseCreateOptions = {
        parent: {
          type: 'page_id',
          page_id: parentPageId,
        },
        title: [{
          type: 'text',
          text: {
            content: 'Tessellate Projects',
          },
        }] as any,
        properties: {
          'Name': {
            title: {},
          },
          'Status': {
            select: {
              options: [
                { name: ProjectStatus.NOT_STARTED, color: 'gray' },
                { name: ProjectStatus.IN_PROGRESS, color: 'blue' },
                { name: ProjectStatus.ON_HOLD, color: 'yellow' },
                { name: ProjectStatus.COMPLETED, color: 'green' },
                { name: ProjectStatus.CANCELLED, color: 'red' },
              ],
            },
          },
          'Priority': {
            select: {
              options: [
                { name: TaskPriority.LOW, color: 'gray' },
                { name: TaskPriority.MEDIUM, color: 'yellow' },
                { name: TaskPriority.HIGH, color: 'orange' },
                { name: TaskPriority.URGENT, color: 'red' },
              ],
            },
          },
          'Description': {
            rich_text: {},
          },
          'Start Date': {
            date: {},
          },
          'End Date': {
            date: {},
          },
          'Progress': {
            number: {
              format: 'percent',
            },
          },
          'Team Members': {
            multi_select: {},
          },
          'Tags': {
            multi_select: {},
          },
        },
        icon: {
          type: 'emoji',
          emoji: '🚀',
        },
      };

      const response = await this.client.databases.create(databaseOptions as any);
      return {
        success: true,
        data: response.id,
        message: 'Projects database created successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to create projects database: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  // Create a new database for tasks
  async createTasksDatabase(parentPageId: string): Promise<NotionApiResponse<string>> {
    try {
      if (!this.client) {
        return { success: false, error: 'Notion client not initialized' };
      }

      const databaseOptions: DatabaseCreateOptions = {
        parent: {
          type: 'page_id',
          page_id: parentPageId,
        },
        title: [{
          type: 'text',
          text: {
            content: 'Tessellate Tasks',
          },
        }] as any,
        properties: {
          'Title': {
            title: {},
          },
          'Status': {
            select: {
              options: [
                { name: TaskStatus.TODO, color: 'gray' },
                { name: TaskStatus.IN_PROGRESS, color: 'blue' },
                { name: TaskStatus.REVIEW, color: 'yellow' },
                { name: TaskStatus.DONE, color: 'green' },
                { name: TaskStatus.BLOCKED, color: 'red' },
              ],
            },
          },
          'Priority': {
            select: {
              options: [
                { name: TaskPriority.LOW, color: 'gray' },
                { name: TaskPriority.MEDIUM, color: 'yellow' },
                { name: TaskPriority.HIGH, color: 'orange' },
                { name: TaskPriority.URGENT, color: 'red' },
              ],
            },
          },
          'Description': {
            rich_text: {},
          },
          'Assignee': {
            people: {},
          },
          'Project': {
            relation: {
              database_id: '', // Will be set after projects database is created
            },
          },
          'Due Date': {
            date: {},
          },
          'Estimated Hours': {
            number: {},
          },
          'Actual Hours': {
            number: {},
          },
          'Tags': {
            multi_select: {},
          },
          'Urgency Score': {
            number: {
              format: 'number_with_commas',
            },
          },
          'Impact Score': {
            number: {
              format: 'number_with_commas',
            },
          },
          'Effort Score': {
            number: {
              format: 'number_with_commas',
            },
          },
          'Dependencies Score': {
            number: {
              format: 'number_with_commas',
            },
          },
          'Total Rubric Score': {
            number: {
              format: 'number_with_commas',
            },
          },
          'Priority Reason': {
            rich_text: {},
          },
        },
        icon: {
          type: 'emoji',
          emoji: '✅',
        },
      };

      const response = await this.client.databases.create(databaseOptions as any);
      return {
        success: true,
        data: response.id,
        message: 'Tasks database created successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to create tasks database: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  // Query projects from database
  async getProjects(databaseId: string, options?: DatabaseQueryOptions): Promise<NotionApiResponse<Project[]>> {
    try {
      if (!this.client) {
        return { success: false, error: 'Notion client not initialized' };
      }

      const response = await this.client.databases.query({
        database_id: databaseId,
        filter: options?.filter,
        sorts: options?.sorts,
        start_cursor: options?.startCursor,
        page_size: options?.pageSize || 100,
      });

      const projects: Project[] = response.results.map((page: any) => {
        const properties = page.properties;
        return {
          id: page.id,
          name: properties.Name?.title?.[0]?.text?.content || 'Untitled',
          description: properties.Description?.rich_text?.[0]?.text?.content || '',
          status: properties.Status?.select?.name || ProjectStatus.NOT_STARTED,
          startDate: properties['Start Date']?.date?.start,
          endDate: properties['End Date']?.date?.start,
          priority: properties.Priority?.select?.name || TaskPriority.MEDIUM,
          teamMembers: properties['Team Members']?.multi_select?.map((item: any) => item.name) || [],
          tags: properties.Tags?.multi_select?.map((item: any) => item.name) || [],
          progress: properties.Progress?.number || 0,
          url: page.url,
          createdAt: page.created_time,
          updatedAt: page.last_edited_time,
        };
      });

      return {
        success: true,
        data: projects,
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch projects: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  // Query tasks from database
  async getTasks(databaseId: string, options?: DatabaseQueryOptions): Promise<NotionApiResponse<Task[]>> {
    try {
      if (!this.client) {
        return { success: false, error: 'Notion client not initialized' };
      }

      const response = await this.client.databases.query({
        database_id: databaseId,
        filter: options?.filter,
        sorts: options?.sorts,
        start_cursor: options?.startCursor,
        page_size: options?.pageSize || 100,
      });

      const tasks: Task[] = response.results.map((page: any) => {
        const properties = page.properties;
        return {
          id: page.id,
          title: properties.Title?.title?.[0]?.text?.content || 'Untitled',
          description: properties.Description?.rich_text?.[0]?.text?.content || '',
          status: properties.Status?.select?.name || TaskStatus.TODO,
          priority: properties.Priority?.select?.name || TaskPriority.MEDIUM,
          assignee: properties.Assignee?.people?.[0]?.name,
          projectId: properties.Project?.relation?.[0]?.id,
          dueDate: properties['Due Date']?.date?.start,
          estimatedHours: properties['Estimated Hours']?.number,
          actualHours: properties['Actual Hours']?.number,
          tags: properties.Tags?.multi_select?.map((item: any) => item.name) || [],
          urgencyScore: properties['Urgency Score']?.number,
          impactScore: properties['Impact Score']?.number,
          effortScore: properties['Effort Score']?.number,
          dependenciesScore: properties['Dependencies Score']?.number,
          totalRubricScore: properties['Total Rubric Score']?.number,
          priorityReason: properties['Priority Reason']?.rich_text?.[0]?.text?.content,
          url: page.url,
          createdAt: page.created_time,
          updatedAt: page.last_edited_time,
        };
      });

      return {
        success: true,
        data: tasks,
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch tasks: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  // Create a new project
  async createProject(databaseId: string, project: Partial<Project>): Promise<NotionApiResponse<string>> {
    try {
      if (!this.client) {
        return { success: false, error: 'Notion client not initialized' };
      }

      const pageOptions: PageCreateOptions = {
        parent: {
          type: 'database_id',
          database_id: databaseId,
        },
        properties: {
          'Name': {
            title: [{
              text: {
                content: project.name || 'Untitled Project',
              },
            }],
          },
          'Status': {
            select: {
              name: project.status || ProjectStatus.NOT_STARTED,
            },
          },
          'Priority': {
            select: {
              name: project.priority || TaskPriority.MEDIUM,
            },
          },
          'Description': {
            rich_text: [{
              text: {
                content: project.description || '',
              },
            }],
          },
          'Progress': {
            number: project.progress || 0,
          },
          ...(project.startDate && {
            'Start Date': {
              date: {
                start: project.startDate,
              },
            },
          }),
          ...(project.endDate && {
            'End Date': {
              date: {
                start: project.endDate,
              },
            },
          }),
          ...(project.teamMembers && {
            'Team Members': {
              multi_select: project.teamMembers.map(member => ({ name: member })),
            },
          }),
          ...(project.tags && {
            'Tags': {
              multi_select: project.tags.map(tag => ({ name: tag })),
            },
          }),
        },
        icon: {
          type: 'emoji',
          emoji: '🚀',
        },
      };

      const response = await this.client.pages.create(pageOptions as any);
      return {
        success: true,
        data: response.id,
        message: 'Project created successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to create project: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  // Create a new task
  async createTask(databaseId: string, task: Partial<Task>): Promise<NotionApiResponse<string>> {
    try {
      if (!this.client) {
        return { success: false, error: 'Notion client not initialized' };
      }

      const pageOptions: PageCreateOptions = {
        parent: {
          type: 'database_id',
          database_id: databaseId,
        },
        properties: {
          'Title': {
            title: [{
              text: {
                content: task.title || 'Untitled Task',
              },
            }],
          },
          'Status': {
            select: {
              name: task.status || TaskStatus.TODO,
            },
          },
          'Priority': {
            select: {
              name: task.priority || TaskPriority.MEDIUM,
            },
          },
          'Description': {
            rich_text: [{
              text: {
                content: task.description || '',
              },
            }],
          },
          ...(task.dueDate && {
            'Due Date': {
              date: {
                start: task.dueDate,
              },
            },
          }),
          ...(task.estimatedHours && {
            'Estimated Hours': {
              number: task.estimatedHours,
            },
          }),
          ...(task.actualHours && {
            'Actual Hours': {
              number: task.actualHours,
            },
          }),
          ...(task.projectId && {
            'Project': {
              relation: [{
                id: task.projectId,
              }],
            },
          }),
          ...(task.tags && {
            'Tags': {
              multi_select: task.tags.map(tag => ({ name: tag })),
            },
          }),
          ...(task.urgencyScore !== undefined && {
            'Urgency Score': {
              number: task.urgencyScore,
            },
          }),
          ...(task.impactScore !== undefined && {
            'Impact Score': {
              number: task.impactScore,
            },
          }),
          ...(task.effortScore !== undefined && {
            'Effort Score': {
              number: task.effortScore,
            },
          }),
          ...(task.dependenciesScore !== undefined && {
            'Dependencies Score': {
              number: task.dependenciesScore,
            },
          }),
          ...(task.totalRubricScore !== undefined && {
            'Total Rubric Score': {
              number: task.totalRubricScore,
            },
          }),
          ...(task.priorityReason && {
            'Priority Reason': {
              rich_text: [{
                text: {
                  content: task.priorityReason,
                },
              }],
            },
          }),
        },
        icon: {
          type: 'emoji',
          emoji: '✅',
        },
      };

      const response = await this.client.pages.create(pageOptions as any);
      return {
        success: true,
        data: response.id,
        message: 'Task created successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to create task: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  // Update a project
  async updateProject(pageId: string, updates: Partial<Project>): Promise<NotionApiResponse<boolean>> {
    try {
      if (!this.client) {
        return { success: false, error: 'Notion client not initialized' };
      }

      const properties: any = {};
      
      if (updates.name) {
        properties['Name'] = {
          title: [{
            text: {
              content: updates.name,
            },
          }],
        };
      }

      if (updates.status) {
        properties['Status'] = {
          select: {
            name: updates.status,
          },
        };
      }

      if (updates.priority) {
        properties['Priority'] = {
          select: {
            name: updates.priority,
          },
        };
      }

      if (updates.description !== undefined) {
        properties['Description'] = {
          rich_text: [{
            text: {
              content: updates.description,
            },
          }],
        };
      }

      if (updates.progress !== undefined) {
        properties['Progress'] = {
          number: updates.progress,
        };
      }

      if (updates.startDate) {
        properties['Start Date'] = {
          date: {
            start: updates.startDate,
          },
        };
      }

      if (updates.endDate) {
        properties['End Date'] = {
          date: {
            start: updates.endDate,
          },
        };
      }

      if (updates.teamMembers) {
        properties['Team Members'] = {
          multi_select: updates.teamMembers.map(member => ({ name: member })),
        };
      }

      if (updates.tags) {
        properties['Tags'] = {
          multi_select: updates.tags.map(tag => ({ name: tag })),
        };
      }

      await this.client.pages.update({
        page_id: pageId,
        properties,
      });

      return {
        success: true,
        data: true,
        message: 'Project updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to update project: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  // Update a task
  async updateTask(pageId: string, updates: Partial<Task>): Promise<NotionApiResponse<boolean>> {
    try {
      if (!this.client) {
        return { success: false, error: 'Notion client not initialized' };
      }

      const properties: any = {};
      
      if (updates.title) {
        properties['Title'] = {
          title: [{
            text: {
              content: updates.title,
            },
          }],
        };
      }

      if (updates.status) {
        properties['Status'] = {
          select: {
            name: updates.status,
          },
        };
      }

      if (updates.priority) {
        properties['Priority'] = {
          select: {
            name: updates.priority,
          },
        };
      }

      if (updates.description !== undefined) {
        properties['Description'] = {
          rich_text: [{
            text: {
              content: updates.description,
            },
          }],
        };
      }

      if (updates.dueDate) {
        properties['Due Date'] = {
          date: {
            start: updates.dueDate,
          },
        };
      }

      if (updates.estimatedHours !== undefined) {
        properties['Estimated Hours'] = {
          number: updates.estimatedHours,
        };
      }

      if (updates.actualHours !== undefined) {
        properties['Actual Hours'] = {
          number: updates.actualHours,
        };
      }

      if (updates.projectId) {
        properties['Project'] = {
          relation: [{
            id: updates.projectId,
          }],
        };
      }

      if (updates.tags) {
        properties['Tags'] = {
          multi_select: updates.tags.map(tag => ({ name: tag })),
        };
      }

      if (updates.urgencyScore !== undefined) {
        properties['Urgency Score'] = {
          number: updates.urgencyScore,
        };
      }

      if (updates.impactScore !== undefined) {
        properties['Impact Score'] = {
          number: updates.impactScore,
        };
      }

      if (updates.effortScore !== undefined) {
        properties['Effort Score'] = {
          number: updates.effortScore,
        };
      }

      if (updates.dependenciesScore !== undefined) {
        properties['Dependencies Score'] = {
          number: updates.dependenciesScore,
        };
      }

      if (updates.totalRubricScore !== undefined) {
        properties['Total Rubric Score'] = {
          number: updates.totalRubricScore,
        };
      }

      if (updates.priorityReason) {
        properties['Priority Reason'] = {
          rich_text: [{
            text: {
              content: updates.priorityReason,
            },
          }],
        };
      }

      await this.client.pages.update({
        page_id: pageId,
        properties,
      });

      return {
        success: true,
        data: true,
        message: 'Task updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to update task: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  // Get dashboard metrics
  async getDashboardMetrics(projectsDatabaseId: string, tasksDatabaseId: string): Promise<NotionApiResponse<DashboardMetrics>> {
    try {
      if (!this.client) {
        return { success: false, error: 'Notion client not initialized' };
      }

      // Get projects
      const projectsResponse = await this.getProjects(projectsDatabaseId);
      if (!projectsResponse.success) {
        return { success: false, error: projectsResponse.error };
      }

      // Get tasks
      const tasksResponse = await this.getTasks(tasksDatabaseId);
      if (!tasksResponse.success) {
        return { success: false, error: tasksResponse.error };
      }

      const projects = projectsResponse.data || [];
      const tasks = tasksResponse.data || [];

      // Calculate metrics
      const activeProjects = projects.filter(p => p.status === ProjectStatus.IN_PROGRESS).length;
      const completedProjects = projects.filter(p => p.status === ProjectStatus.COMPLETED).length;
      const completedTasks = tasks.filter(t => t.status === TaskStatus.DONE).length;
      const inProgressTasks = tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length;
      
      // Calculate overdue tasks
      const today = new Date().toISOString().split('T')[0];
      const overdueTasks = tasks.filter(t => 
        t.dueDate && t.dueDate < today && t.status !== TaskStatus.DONE
      ).length;

      // Get unique team members
      const teamMembersSet = new Set<string>();
      projects.forEach(project => {
        project.teamMembers.forEach(member => teamMembersSet.add(member));
      });
      tasks.forEach(task => {
        if (task.assignee) teamMembersSet.add(task.assignee);
      });

      const metrics: DashboardMetrics = {
        totalProjects: projects.length,
        activeProjects,
        completedProjects,
        totalTasks: tasks.length,
        completedTasks,
        inProgressTasks,
        overdueTasks,
        teamMembers: teamMembersSet.size,
      };

      return {
        success: true,
        data: metrics,
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to get dashboard metrics: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }
}

export default new NotionService();