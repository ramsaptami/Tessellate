import NotionService from './notion';
import RubricService, { ScoredTask } from './rubric';
import { Task, TaskStatus, TaskPriority, NotionApiResponse } from '@/lib/types/notion';

export interface MigrationResult {
  totalTasks: number;
  successfulMigrations: number;
  failedMigrations: number;
  scoredTasks: ScoredTask[];
  errors: string[];
  migrationReport: string;
}

export interface MigrationOptions {
  tasksDatabaseId: string;
  includeRubricScores: boolean;
  autoAssignPriority: boolean;
  dryRun?: boolean;
}

class TaskMigrationService {
  private notionService = NotionService;
  private rubricService = RubricService;

  // Migrate internal todos to Notion with rubric scoring
  async migrateInternalTodos(options: MigrationOptions): Promise<MigrationResult> {
    const result: MigrationResult = {
      totalTasks: 0,
      successfulMigrations: 0,
      failedMigrations: 0,
      scoredTasks: [],
      errors: [],
      migrationReport: ''
    };

    try {
      // Get internal todos and score them
      console.log('🔄 Migrating internal todos with rubric scoring...');
      const scoredTasks = await this.rubricService.migrateInternalTodos();
      
      result.totalTasks = scoredTasks.length;
      result.scoredTasks = scoredTasks;

      console.log(`📊 Scored ${scoredTasks.length} tasks using rubric system`);

      // Sort by priority score for better visualization
      scoredTasks.sort((a, b) => b.rubricScores.totalScore - a.rubricScores.totalScore);

      // Migrate each task to Notion
      for (const scoredTask of scoredTasks) {
        try {
          if (options.dryRun) {
            console.log(`🔍 [DRY RUN] Would migrate: ${scoredTask.title} (Score: ${scoredTask.rubricScores.totalScore})`);
            result.successfulMigrations++;
            continue;
          }

          // Convert ScoredTask to Notion task format
          const notionTask: Partial<Task> = {
            title: scoredTask.title,
            description: scoredTask.description,
            status: scoredTask.status,
            priority: options.autoAssignPriority ? scoredTask.priority : scoredTask.priority,
            dueDate: scoredTask.dueDate,
            estimatedHours: scoredTask.estimatedHours,
            actualHours: scoredTask.actualHours,
            tags: scoredTask.tags || [],
            urgencyScore: options.includeRubricScores ? scoredTask.rubricScores.urgency : undefined,
            impactScore: options.includeRubricScores ? scoredTask.rubricScores.impact : undefined,
            effortScore: options.includeRubricScores ? scoredTask.rubricScores.effort : undefined,
            dependenciesScore: options.includeRubricScores ? scoredTask.rubricScores.dependencies : undefined,
            totalRubricScore: options.includeRubricScores ? scoredTask.rubricScores.totalScore : undefined,
            priorityReason: options.includeRubricScores ? scoredTask.priorityReason : undefined,
          };

          const createResult = await this.notionService.createTask(options.tasksDatabaseId, notionTask);
          
          if (createResult.success) {
            result.successfulMigrations++;
            console.log(`✅ Migrated: ${scoredTask.title} (ID: ${createResult.data})`);
          } else {
            result.failedMigrations++;
            result.errors.push(`Failed to migrate "${scoredTask.title}": ${createResult.error}`);
            console.error(`❌ Failed to migrate: ${scoredTask.title} - ${createResult.error}`);
          }
        } catch (error) {
          result.failedMigrations++;
          const errorMsg = `Error migrating "${scoredTask.title}": ${error instanceof Error ? error.message : 'Unknown error'}`;
          result.errors.push(errorMsg);
          console.error(`❌ ${errorMsg}`);
        }
      }

      // Generate migration report
      result.migrationReport = await this.generateMigrationReport(result, options);
      
      return result;
    } catch (error) {
      result.errors.push(`Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return result;
    }
  }

  // Migrate custom tasks with rubric scoring
  async migrateTasks(tasks: Partial<Task>[], options: MigrationOptions): Promise<MigrationResult> {
    const result: MigrationResult = {
      totalTasks: tasks.length,
      successfulMigrations: 0,
      failedMigrations: 0,
      scoredTasks: [],
      errors: [],
      migrationReport: ''
    };

    try {
      // Score the tasks
      const scoredTasks = await this.rubricService.scoreTasks(tasks);
      result.scoredTasks = scoredTasks;

      console.log(`📊 Scored ${scoredTasks.length} custom tasks using rubric system`);

      // Migrate each scored task
      for (const scoredTask of scoredTasks) {
        try {
          if (options.dryRun) {
            console.log(`🔍 [DRY RUN] Would migrate: ${scoredTask.title} (Score: ${scoredTask.rubricScores.totalScore})`);
            result.successfulMigrations++;
            continue;
          }

          const notionTask: Partial<Task> = {
            ...scoredTask,
            urgencyScore: options.includeRubricScores ? scoredTask.rubricScores.urgency : undefined,
            impactScore: options.includeRubricScores ? scoredTask.rubricScores.impact : undefined,
            effortScore: options.includeRubricScores ? scoredTask.rubricScores.effort : undefined,
            dependenciesScore: options.includeRubricScores ? scoredTask.rubricScores.dependencies : undefined,
            totalRubricScore: options.includeRubricScores ? scoredTask.rubricScores.totalScore : undefined,
            priorityReason: options.includeRubricScores ? scoredTask.priorityReason : undefined,
            priority: options.autoAssignPriority ? scoredTask.priority : (scoredTask.priority || TaskPriority.MEDIUM),
          };

          const createResult = await this.notionService.createTask(options.tasksDatabaseId, notionTask);
          
          if (createResult.success) {
            result.successfulMigrations++;
            console.log(`✅ Migrated: ${scoredTask.title} (ID: ${createResult.data})`);
          } else {
            result.failedMigrations++;
            result.errors.push(`Failed to migrate "${scoredTask.title}": ${createResult.error}`);
            console.error(`❌ Failed to migrate: ${scoredTask.title} - ${createResult.error}`);
          }
        } catch (error) {
          result.failedMigrations++;
          const errorMsg = `Error migrating "${scoredTask.title}": ${error instanceof Error ? error.message : 'Unknown error'}`;
          result.errors.push(errorMsg);
          console.error(`❌ ${errorMsg}`);
        }
      }

      result.migrationReport = await this.generateMigrationReport(result, options);
      return result;
    } catch (error) {
      result.errors.push(`Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return result;
    }
  }

  // Update existing Notion tasks with rubric scores
  async updateTasksWithScores(tasksDatabaseId: string): Promise<MigrationResult> {
    const result: MigrationResult = {
      totalTasks: 0,
      successfulMigrations: 0,
      failedMigrations: 0,
      scoredTasks: [],
      errors: [],
      migrationReport: ''
    };

    try {
      // Get existing tasks from Notion
      const tasksResponse = await this.notionService.getTasks(tasksDatabaseId);
      
      if (!tasksResponse.success || !tasksResponse.data) {
        result.errors.push(`Failed to fetch existing tasks: ${tasksResponse.error}`);
        return result;
      }

      const existingTasks = tasksResponse.data;
      result.totalTasks = existingTasks.length;

      // Score the existing tasks
      const scoredTasks = await this.rubricService.scoreTasks(existingTasks);
      result.scoredTasks = scoredTasks;

      console.log(`📊 Rescored ${scoredTasks.length} existing tasks`);

      // Update each task with new scores
      for (const scoredTask of scoredTasks) {
        try {
          if (!scoredTask.id) {
            result.errors.push(`Task "${scoredTask.title}" has no ID, skipping update`);
            continue;
          }

          const updates: Partial<Task> = {
            priority: scoredTask.priority,
            urgencyScore: scoredTask.rubricScores.urgency,
            impactScore: scoredTask.rubricScores.impact,
            effortScore: scoredTask.rubricScores.effort,
            dependenciesScore: scoredTask.rubricScores.dependencies,
            totalRubricScore: scoredTask.rubricScores.totalScore,
            priorityReason: scoredTask.priorityReason,
          };

          const updateResult = await this.notionService.updateTask(scoredTask.id, updates);
          
          if (updateResult.success) {
            result.successfulMigrations++;
            console.log(`✅ Updated scores for: ${scoredTask.title}`);
          } else {
            result.failedMigrations++;
            result.errors.push(`Failed to update "${scoredTask.title}": ${updateResult.error}`);
            console.error(`❌ Failed to update: ${scoredTask.title} - ${updateResult.error}`);
          }
        } catch (error) {
          result.failedMigrations++;
          const errorMsg = `Error updating "${scoredTask.title}": ${error instanceof Error ? error.message : 'Unknown error'}`;
          result.errors.push(errorMsg);
          console.error(`❌ ${errorMsg}`);
        }
      }

      result.migrationReport = await this.generateMigrationReport(result, {
        tasksDatabaseId,
        includeRubricScores: true,
        autoAssignPriority: true
      });

      return result;
    } catch (error) {
      result.errors.push(`Update failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return result;
    }
  }

  // Generate detailed migration report
  private async generateMigrationReport(result: MigrationResult, options: MigrationOptions): Promise<string> {
    const report = [];
    
    report.push('# Task Migration Report');
    report.push(`Generated on: ${new Date().toLocaleString()}`);
    report.push(`Database ID: ${options.tasksDatabaseId}`);
    
    if (options.dryRun) {
      report.push('**Mode:** Dry Run (no actual changes made)');
    }
    
    report.push('');

    // Summary
    report.push('## Summary');
    report.push(`- Total tasks processed: ${result.totalTasks}`);
    report.push(`- Successful migrations: ${result.successfulMigrations}`);
    report.push(`- Failed migrations: ${result.failedMigrations}`);
    report.push(`- Success rate: ${result.totalTasks > 0 ? Math.round((result.successfulMigrations / result.totalTasks) * 100) : 0}%`);
    report.push('');

    // Rubric Analysis
    if (result.scoredTasks.length > 0) {
      report.push('## Rubric Scoring Analysis');
      
      const avgScore = result.scoredTasks.reduce((sum, task) => sum + task.rubricScores.totalScore, 0) / result.scoredTasks.length;
      const highPriorityTasks = result.scoredTasks.filter(t => t.priority === TaskPriority.URGENT || t.priority === TaskPriority.HIGH).length;
      
      report.push(`- Average rubric score: ${Math.round(avgScore * 100) / 100}`);
      report.push(`- High priority tasks: ${highPriorityTasks} of ${result.totalTasks}`);
      
      // Top 5 highest scored tasks
      const topTasks = result.scoredTasks
        .sort((a, b) => b.rubricScores.totalScore - a.rubricScores.totalScore)
        .slice(0, 5);
      
      report.push('');
      report.push('### Top Priority Tasks');
      topTasks.forEach((task, index) => {
        report.push(`${index + 1}. **${task.title}** (Score: ${task.rubricScores.totalScore})`);
        report.push(`   - Priority: ${task.priority}`);
        report.push(`   - Reason: ${task.priorityReason}`);
      });
      report.push('');
    }

    // Errors
    if (result.errors.length > 0) {
      report.push('## Errors Encountered');
      result.errors.forEach((error, index) => {
        report.push(`${index + 1}. ${error}`);
      });
      report.push('');
    }

    // Recommendations
    report.push('## Recommendations');
    if (result.failedMigrations > 0) {
      report.push('- Review failed migrations and address underlying issues');
      report.push('- Consider running the migration again for failed tasks');
    }
    
    if (options.includeRubricScores) {
      report.push('- Use rubric scores to prioritize task execution');
      report.push('- Review low-scoring tasks to determine if they should be deprioritized');
    }
    
    report.push('- Set up automatic syncing to keep tasks updated');
    report.push('- Configure team notifications for high-priority tasks');

    return report.join('\n');
  }

  // Get migration status
  async getMigrationStatus(tasksDatabaseId: string): Promise<{
    hasRubricScores: boolean;
    totalTasks: number;
    tasksWithScores: number;
    lastMigration?: string;
  }> {
    try {
      const tasksResponse = await this.notionService.getTasks(tasksDatabaseId);
      
      if (!tasksResponse.success || !tasksResponse.data) {
        return {
          hasRubricScores: false,
          totalTasks: 0,
          tasksWithScores: 0,
        };
      }

      const tasks = tasksResponse.data;
      const tasksWithScores = tasks.filter(task => task.totalRubricScore !== undefined).length;

      return {
        hasRubricScores: tasksWithScores > 0,
        totalTasks: tasks.length,
        tasksWithScores,
        lastMigration: tasks.length > 0 ? tasks[0].updatedAt : undefined,
      };
    } catch (error) {
      console.error('Error getting migration status:', error);
      return {
        hasRubricScores: false,
        totalTasks: 0,
        tasksWithScores: 0,
      };
    }
  }
}

export default new TaskMigrationService();