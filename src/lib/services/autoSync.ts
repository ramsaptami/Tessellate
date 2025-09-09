import NotionService from './notion';
import RubricService from './rubric';
import TaskMigrationService, { MigrationResult } from './taskMigration';
import { Task, TaskStatus, NotionWorkspaceConfig, NotionApiResponse } from '@/lib/types/notion';

export interface SyncStatus {
  isActive: boolean;
  lastSyncAt?: Date;
  nextSyncAt?: Date;
  syncInterval: number; // in minutes
  tasksLastUpdated: number;
  errors: string[];
  successfulSyncs: number;
  failedSyncs: number;
}

export interface SyncOptions {
  syncInterval: number; // in minutes
  autoScore: boolean;
  bidirectionalSync: boolean; // sync changes back from Notion
  conflictResolution: 'notion-wins' | 'local-wins' | 'merge';
}

export interface SyncResult {
  success: boolean;
  tasksUpdated: number;
  tasksCreated: number;
  tasksDeleted: number;
  errors: string[];
  syncReport: string;
}

class AutoSyncService {
  private notionService = NotionService;
  private rubricService = RubricService;
  private migrationService = TaskMigrationService;
  
  private syncStatus: SyncStatus = {
    isActive: false,
    syncInterval: 15, // Default 15 minutes
    tasksLastUpdated: 0,
    errors: [],
    successfulSyncs: 0,
    failedSyncs: 0,
  };

  private syncTimer: NodeJS.Timeout | null = null;
  private taskChangeListeners: Array<(tasks: Task[]) => void> = [];

  // Start automatic syncing
  startAutoSync(config: NotionWorkspaceConfig, options: SyncOptions): NotionApiResponse<boolean> {
    try {
      if (!config.tasksDatabaseId) {
        return {
          success: false,
          error: 'Tasks database ID is required for auto-sync',
        };
      }

      this.stopAutoSync(); // Stop existing sync if running

      this.syncStatus.isActive = true;
      this.syncStatus.syncInterval = options.syncInterval;
      this.syncStatus.lastSyncAt = new Date();
      this.syncStatus.nextSyncAt = new Date(Date.now() + options.syncInterval * 60 * 1000);

      // Set up periodic sync
      this.syncTimer = setInterval(async () => {
        await this.performSync(config, options);
      }, options.syncInterval * 60 * 1000);

      // Perform initial sync
      this.performSync(config, options);

      console.log(`🔄 Auto-sync started with ${options.syncInterval} minute intervals`);

      return {
        success: true,
        data: true,
        message: `Auto-sync started successfully with ${options.syncInterval} minute intervals`,
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to start auto-sync: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  // Stop automatic syncing
  stopAutoSync(): NotionApiResponse<boolean> {
    try {
      if (this.syncTimer) {
        clearInterval(this.syncTimer);
        this.syncTimer = null;
      }

      this.syncStatus.isActive = false;
      this.syncStatus.nextSyncAt = undefined;

      console.log('⏹️ Auto-sync stopped');

      return {
        success: true,
        data: true,
        message: 'Auto-sync stopped successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to stop auto-sync: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  // Perform a single sync operation
  async performSync(config: NotionWorkspaceConfig, options: SyncOptions): Promise<SyncResult> {
    const result: SyncResult = {
      success: false,
      tasksUpdated: 0,
      tasksCreated: 0,
      tasksDeleted: 0,
      errors: [],
      syncReport: '',
    };

    try {
      console.log('🔄 Starting sync operation...');

      if (!config.tasksDatabaseId) {
        result.errors.push('Tasks database ID is required');
        return result;
      }

      // 1. Get current tasks from Notion
      const notionTasksResponse = await this.notionService.getTasks(config.tasksDatabaseId);
      if (!notionTasksResponse.success) {
        result.errors.push(`Failed to fetch Notion tasks: ${notionTasksResponse.error}`);
        this.syncStatus.failedSyncs++;
        return result;
      }

      const notionTasks = notionTasksResponse.data || [];
      console.log(`📊 Found ${notionTasks.length} tasks in Notion`);

      // 2. Get current internal todos
      const internalTodos = await this.getInternalTodos();
      console.log(`📝 Found ${internalTodos.length} internal todos`);

      // 3. Compare and sync new/updated tasks
      await this.syncTasksToNotion(config.tasksDatabaseId, internalTodos, notionTasks, options, result);

      // 4. If bidirectional sync is enabled, sync changes from Notion back
      if (options.bidirectionalSync) {
        await this.syncTasksFromNotion(notionTasks, options, result);
      }

      // 5. Update sync status
      this.syncStatus.lastSyncAt = new Date();
      this.syncStatus.nextSyncAt = new Date(Date.now() + this.syncStatus.syncInterval * 60 * 1000);
      this.syncStatus.tasksLastUpdated = result.tasksUpdated + result.tasksCreated + result.tasksDeleted;

      if (result.errors.length === 0) {
        this.syncStatus.successfulSyncs++;
        result.success = true;
      } else {
        this.syncStatus.failedSyncs++;
      }

      this.syncStatus.errors = result.errors;

      // 6. Generate sync report
      result.syncReport = this.generateSyncReport(result);

      console.log(`✅ Sync completed: ${result.tasksCreated} created, ${result.tasksUpdated} updated, ${result.tasksDeleted} deleted`);

      // 7. Notify listeners
      this.notifyTaskChangeListeners(notionTasks);

      return result;
    } catch (error) {
      const errorMsg = `Sync operation failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      result.errors.push(errorMsg);
      this.syncStatus.failedSyncs++;
      this.syncStatus.errors = result.errors;
      console.error(`❌ ${errorMsg}`);
      return result;
    }
  }

  // Sync tasks from internal todos to Notion
  private async syncTasksToNotion(
    tasksDatabaseId: string,
    internalTodos: Task[],
    notionTasks: Task[],
    options: SyncOptions,
    result: SyncResult
  ): Promise<void> {
    const notionTaskTitles = new Set(notionTasks.map(task => task.title));

    for (const todo of internalTodos) {
      try {
        if (!notionTaskTitles.has(todo.title)) {
          // New task - create in Notion
          let taskToCreate = todo;

          // Score the task if auto-scoring is enabled
          if (options.autoScore) {
            const scoredTasks = await this.rubricService.scoreTasks([todo]);
            if (scoredTasks.length > 0) {
              const scoredTask = scoredTasks[0];
              taskToCreate = {
                ...todo,
                priority: scoredTask.priority,
                urgencyScore: scoredTask.rubricScores.urgency,
                impactScore: scoredTask.rubricScores.impact,
                effortScore: scoredTask.rubricScores.effort,
                dependenciesScore: scoredTask.rubricScores.dependencies,
                totalRubricScore: scoredTask.rubricScores.totalScore,
                priorityReason: scoredTask.priorityReason,
              };
            }
          }

          const createResult = await this.notionService.createTask(tasksDatabaseId, taskToCreate);
          if (createResult.success) {
            result.tasksCreated++;
            console.log(`➕ Created new task: ${todo.title}`);
          } else {
            result.errors.push(`Failed to create task "${todo.title}": ${createResult.error}`);
          }
        } else {
          // Existing task - check if it needs updates
          const existingTask = notionTasks.find(task => task.title === todo.title);
          if (existingTask && this.taskNeedsUpdate(todo, existingTask)) {
            const updates = this.prepareTaskUpdates(todo, existingTask, options);
            
            const updateResult = await this.notionService.updateTask(existingTask.id, updates);
            if (updateResult.success) {
              result.tasksUpdated++;
              console.log(`📝 Updated task: ${todo.title}`);
            } else {
              result.errors.push(`Failed to update task "${todo.title}": ${updateResult.error}`);
            }
          }
        }
      } catch (error) {
        result.errors.push(`Error processing task "${todo.title}": ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }

  // Sync tasks from Notion back to internal system
  private async syncTasksFromNotion(
    notionTasks: Task[],
    options: SyncOptions,
    result: SyncResult
  ): Promise<void> {
    // This would update the internal todo system based on changes in Notion
    // For now, we'll just log what would happen
    
    const updatedTasks = notionTasks.filter(task => {
      const lastUpdated = new Date(task.updatedAt);
      const lastSync = this.syncStatus.lastSyncAt || new Date(0);
      return lastUpdated > lastSync;
    });

    if (updatedTasks.length > 0) {
      console.log(`📥 Would sync ${updatedTasks.length} updated tasks from Notion`);
      // In a real implementation, this would update the internal todo system
    }
  }

  // Check if a task needs updating
  private taskNeedsUpdate(internal: Task, notion: Task): boolean {
    return (
      internal.status !== notion.status ||
      internal.priority !== notion.priority ||
      internal.description !== notion.description ||
      internal.dueDate !== notion.dueDate ||
      internal.estimatedHours !== notion.estimatedHours ||
      JSON.stringify(internal.tags) !== JSON.stringify(notion.tags)
    );
  }

  // Prepare task updates based on conflict resolution strategy
  private prepareTaskUpdates(internal: Task, notion: Task, options: SyncOptions): Partial<Task> {
    const updates: Partial<Task> = {};

    switch (options.conflictResolution) {
      case 'local-wins':
        // Local changes override Notion
        if (internal.status !== notion.status) updates.status = internal.status;
        if (internal.priority !== notion.priority) updates.priority = internal.priority;
        if (internal.description !== notion.description) updates.description = internal.description;
        if (internal.dueDate !== notion.dueDate) updates.dueDate = internal.dueDate;
        if (internal.estimatedHours !== notion.estimatedHours) updates.estimatedHours = internal.estimatedHours;
        if (JSON.stringify(internal.tags) !== JSON.stringify(notion.tags)) updates.tags = internal.tags;
        break;

      case 'notion-wins':
        // Notion changes override local (minimal updates)
        // Only update if local has newer information
        break;

      case 'merge':
      default:
        // Smart merge - prefer most recent updates
        const internalUpdated = new Date(internal.updatedAt);
        const notionUpdated = new Date(notion.updatedAt);
        
        if (internalUpdated > notionUpdated) {
          if (internal.status !== notion.status) updates.status = internal.status;
          if (internal.priority !== notion.priority) updates.priority = internal.priority;
          if (internal.description !== notion.description) updates.description = internal.description;
        }
        break;
    }

    return updates;
  }

  // Get current internal todos
  private async getInternalTodos(): Promise<Task[]> {
    // This would get todos from your internal system
    // For now, return the migrated todos
    try {
      const scoredTodos = await this.rubricService.migrateInternalTodos();
      return scoredTodos.map(todo => ({
        id: '', // Internal todos don't have Notion IDs yet
        title: todo.title,
        description: todo.description,
        status: todo.status,
        priority: todo.priority,
        dueDate: todo.dueDate,
        estimatedHours: todo.estimatedHours,
        actualHours: todo.actualHours,
        tags: todo.tags || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
    } catch (error) {
      console.error('Error getting internal todos:', error);
      return [];
    }
  }

  // Get current sync status
  getSyncStatus(): SyncStatus {
    return { ...this.syncStatus };
  }

  // Add task change listener
  addTaskChangeListener(listener: (tasks: Task[]) => void): void {
    this.taskChangeListeners.push(listener);
  }

  // Remove task change listener
  removeTaskChangeListener(listener: (tasks: Task[]) => void): void {
    const index = this.taskChangeListeners.indexOf(listener);
    if (index > -1) {
      this.taskChangeListeners.splice(index, 1);
    }
  }

  // Notify task change listeners
  private notifyTaskChangeListeners(tasks: Task[]): void {
    this.taskChangeListeners.forEach(listener => {
      try {
        listener(tasks);
      } catch (error) {
        console.error('Error notifying task change listener:', error);
      }
    });
  }

  // Force a manual sync
  async forceSync(config: NotionWorkspaceConfig, options?: Partial<SyncOptions>): Promise<SyncResult> {
    const defaultOptions: SyncOptions = {
      syncInterval: 15,
      autoScore: true,
      bidirectionalSync: true,
      conflictResolution: 'merge',
    };

    const syncOptions = { ...defaultOptions, ...options };
    return this.performSync(config, syncOptions);
  }

  // Generate sync report
  private generateSyncReport(result: SyncResult): string {
    const report = [];
    
    report.push(`# Sync Report - ${new Date().toLocaleString()}`);
    report.push('');
    report.push('## Summary');
    report.push(`- Status: ${result.success ? '✅ Success' : '❌ Failed'}`);
    report.push(`- Tasks Created: ${result.tasksCreated}`);
    report.push(`- Tasks Updated: ${result.tasksUpdated}`);
    report.push(`- Tasks Deleted: ${result.tasksDeleted}`);
    report.push(`- Total Changes: ${result.tasksCreated + result.tasksUpdated + result.tasksDeleted}`);
    
    if (result.errors.length > 0) {
      report.push('');
      report.push('## Errors');
      result.errors.forEach((error, index) => {
        report.push(`${index + 1}. ${error}`);
      });
    }

    report.push('');
    report.push('## Sync Status');
    report.push(`- Active: ${this.syncStatus.isActive ? 'Yes' : 'No'}`);
    report.push(`- Interval: ${this.syncStatus.syncInterval} minutes`);
    report.push(`- Successful Syncs: ${this.syncStatus.successfulSyncs}`);
    report.push(`- Failed Syncs: ${this.syncStatus.failedSyncs}`);
    report.push(`- Last Sync: ${this.syncStatus.lastSyncAt?.toLocaleString() || 'Never'}`);
    report.push(`- Next Sync: ${this.syncStatus.nextSyncAt?.toLocaleString() || 'Not scheduled'}`);

    return report.join('\n');
  }

  // Clean up resources
  destroy(): void {
    this.stopAutoSync();
    this.taskChangeListeners = [];
  }
}

export default new AutoSyncService();