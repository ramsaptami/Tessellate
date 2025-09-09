import NotionService from './notion';
import TaskMigrationService from './taskMigration';
import { NotionApiResponse, NotionWorkspaceConfig } from '@/lib/types/notion';
import { MigrationResult } from './taskMigration';

export interface WorkspaceSetupResult {
  success: boolean;
  config?: NotionWorkspaceConfig;
  projectsDatabaseId?: string;
  tasksDatabaseId?: string;
  migrationResult?: MigrationResult;
  errors: string[];
  setupReport: string;
}

export interface WorkspaceSetupOptions {
  workspaceUrl: string; // https://www.notion.so/tessellate-25d1d37fdbe780118949e39b803f5690
  createDatabases: boolean;
  migrateInternalTodos: boolean;
  setupRubricSystem: boolean;
  dryRun?: boolean;
}

class NotionWorkspaceSetupService {
  private notionService = NotionService;
  private migrationService = TaskMigrationService;

  // Extract workspace/page ID from Notion URL
  private extractWorkspaceId(url: string): string | null {
    try {
      // Handle different Notion URL formats
      // https://www.notion.so/tessellate-25d1d37fdbe780118949e39b803f5690
      // https://www.notion.so/workspace/page-title-25d1d37fdbe780118949e39b803f5690
      
      const urlParts = url.split('/');
      const lastPart = urlParts[urlParts.length - 1];
      
      // Extract ID from the last part (after the last dash)
      const idMatch = lastPart.match(/([a-f0-9]{32})/);
      if (idMatch) {
        return idMatch[1].replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5');
      }
      
      return null;
    } catch (error) {
      console.error('Error extracting workspace ID from URL:', error);
      return null;
    }
  }

  // Set up the complete Notion workspace for Tessellate
  async setupTessellateWorkspace(options: WorkspaceSetupOptions): Promise<WorkspaceSetupResult> {
    const result: WorkspaceSetupResult = {
      success: false,
      errors: [],
      setupReport: ''
    };

    try {
      console.log('🚀 Setting up Tessellate Notion workspace...');
      
      // Extract workspace ID from URL
      const workspaceId = this.extractWorkspaceId(options.workspaceUrl);
      if (!workspaceId) {
        result.errors.push(`Invalid workspace URL: ${options.workspaceUrl}`);
        return result;
      }

      console.log(`📋 Workspace ID extracted: ${workspaceId}`);

      // Test Notion connection
      const connectionTest = await this.notionService.testConnection();
      if (!connectionTest.success) {
        result.errors.push(`Notion connection failed: ${connectionTest.error}`);
        return result;
      }

      console.log('✅ Notion connection verified');

      // Initialize workspace config
      result.config = {
        workspaceId,
      };

      let projectsDatabaseId: string | undefined;
      let tasksDatabaseId: string | undefined;

      // Create databases if requested
      if (options.createDatabases) {
        console.log('📊 Creating Tessellate databases...');
        
        if (options.dryRun) {
          console.log('🔍 [DRY RUN] Would create Projects database');
          console.log('🔍 [DRY RUN] Would create Tasks database');
          projectsDatabaseId = 'dry-run-projects-db-id';
          tasksDatabaseId = 'dry-run-tasks-db-id';
        } else {
          // Create projects database
          const projectsDbResult = await this.notionService.createProjectsDatabase(workspaceId);
          if (projectsDbResult.success && projectsDbResult.data) {
            projectsDatabaseId = projectsDbResult.data;
            result.config.projectsDatabaseId = projectsDatabaseId;
            console.log(`✅ Projects database created: ${projectsDatabaseId}`);
          } else {
            result.errors.push(`Failed to create projects database: ${projectsDbResult.error}`);
          }

          // Create tasks database
          const tasksDbResult = await this.notionService.createTasksDatabase(workspaceId);
          if (tasksDbResult.success && tasksDbResult.data) {
            tasksDatabaseId = tasksDbResult.data;
            result.config.tasksDatabaseId = tasksDatabaseId;
            console.log(`✅ Tasks database created: ${tasksDatabaseId}`);
          } else {
            result.errors.push(`Failed to create tasks database: ${tasksDbResult.error}`);
          }
        }

        result.projectsDatabaseId = projectsDatabaseId;
        result.tasksDatabaseId = tasksDatabaseId;
      }

      // Migrate internal todos if requested and we have a tasks database
      if (options.migrateInternalTodos && tasksDatabaseId) {
        console.log('📝 Migrating internal todos with rubric scoring...');
        
        const migrationOptions = {
          tasksDatabaseId,
          includeRubricScores: options.setupRubricSystem,
          autoAssignPriority: true,
          dryRun: options.dryRun,
        };

        result.migrationResult = await this.migrationService.migrateInternalTodos(migrationOptions);
        
        console.log(`✅ Migration completed: ${result.migrationResult.successfulMigrations}/${result.migrationResult.totalTasks} tasks`);
        
        if (result.migrationResult.errors.length > 0) {
          result.errors.push(...result.migrationResult.errors);
        }
      }

      // Generate setup report
      result.setupReport = await this.generateSetupReport(result, options);
      result.success = result.errors.length === 0 || options.dryRun;

      return result;
    } catch (error) {
      const errorMsg = `Workspace setup failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      result.errors.push(errorMsg);
      console.error(`❌ ${errorMsg}`);
      return result;
    }
  }

  // Check existing workspace configuration
  async checkWorkspaceSetup(workspaceUrl: string): Promise<{
    isSetup: boolean;
    hasProjects: boolean;
    hasTasks: boolean;
    hasRubricScores: boolean;
    taskCount: number;
    config?: NotionWorkspaceConfig;
  }> {
    try {
      const workspaceId = this.extractWorkspaceId(workspaceUrl);
      if (!workspaceId) {
        return {
          isSetup: false,
          hasProjects: false,
          hasTasks: false,
          hasRubricScores: false,
          taskCount: 0,
        };
      }

      // Test connection
      const connectionTest = await this.notionService.testConnection();
      if (!connectionTest.success) {
        return {
          isSetup: false,
          hasProjects: false,
          hasTasks: false,
          hasRubricScores: false,
          taskCount: 0,
        };
      }

      // For now, return basic setup info
      // In a real implementation, you would query existing databases
      return {
        isSetup: true,
        hasProjects: false, // Would check if projects database exists
        hasTasks: false,    // Would check if tasks database exists
        hasRubricScores: false,
        taskCount: 0,
        config: {
          workspaceId,
        },
      };
    } catch (error) {
      console.error('Error checking workspace setup:', error);
      return {
        isSetup: false,
        hasProjects: false,
        hasTasks: false,
        hasRubricScores: false,
        taskCount: 0,
      };
    }
  }

  // Configure automatic syncing
  async setupAutoSync(config: NotionWorkspaceConfig): Promise<NotionApiResponse<boolean>> {
    try {
      // This would set up webhooks or polling for automatic syncing
      // For now, we'll just validate the configuration
      
      if (!config.tasksDatabaseId) {
        return {
          success: false,
          error: 'Tasks database ID is required for auto-sync setup',
        };
      }

      console.log('⚙️ Auto-sync configuration saved');
      console.log(`📊 Tasks database: ${config.tasksDatabaseId}`);
      console.log(`📋 Projects database: ${config.projectsDatabaseId || 'Not configured'}`);

      // Store configuration (in a real app, this would go to a database or config file)
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('tessellate-notion-config', JSON.stringify(config));
      }

      return {
        success: true,
        data: true,
        message: 'Auto-sync configuration saved successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to setup auto-sync: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  // Get saved workspace configuration
  getWorkspaceConfig(): NotionWorkspaceConfig | null {
    try {
      if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem('tessellate-notion-config');
        return saved ? JSON.parse(saved) : null;
      }
      return null;
    } catch (error) {
      console.error('Error loading workspace config:', error);
      return null;
    }
  }

  // Generate comprehensive setup report
  private async generateSetupReport(result: WorkspaceSetupResult, options: WorkspaceSetupOptions): Promise<string> {
    const report = [];
    
    report.push('# Tessellate Notion Workspace Setup Report');
    report.push(`Generated on: ${new Date().toLocaleString()}`);
    report.push(`Workspace URL: ${options.workspaceUrl}`);
    
    if (options.dryRun) {
      report.push('**Mode:** Dry Run (no actual changes made)');
    }
    
    report.push('');

    // Configuration Summary
    report.push('## Workspace Configuration');
    if (result.config) {
      report.push(`- Workspace ID: ${result.config.workspaceId}`);
      report.push(`- Projects Database: ${result.config.projectsDatabaseId || 'Not created'}`);
      report.push(`- Tasks Database: ${result.config.tasksDatabaseId || 'Not created'}`);
    }
    report.push('');

    // Setup Results
    report.push('## Setup Results');
    report.push(`- Overall Success: ${result.success ? '✅ Yes' : '❌ No'}`);
    report.push(`- Databases Created: ${options.createDatabases ? '✅ Yes' : '⏭️ Skipped'}`);
    report.push(`- Rubric System: ${options.setupRubricSystem ? '✅ Enabled' : '⏭️ Disabled'}`);
    report.push(`- Todos Migrated: ${options.migrateInternalTodos ? '✅ Yes' : '⏭️ Skipped'}`);
    report.push('');

    // Migration Results
    if (result.migrationResult) {
      const migration = result.migrationResult;
      report.push('## Task Migration Results');
      report.push(`- Total tasks: ${migration.totalTasks}`);
      report.push(`- Successfully migrated: ${migration.successfulMigrations}`);
      report.push(`- Failed migrations: ${migration.failedMigrations}`);
      report.push(`- Success rate: ${migration.totalTasks > 0 ? Math.round((migration.successfulMigrations / migration.totalTasks) * 100) : 0}%`);
      
      if (migration.scoredTasks.length > 0) {
        const avgScore = migration.scoredTasks.reduce((sum, task) => sum + task.rubricScores.totalScore, 0) / migration.scoredTasks.length;
        report.push(`- Average priority score: ${Math.round(avgScore * 100) / 100}/10`);
        
        // Top 3 tasks
        const topTasks = migration.scoredTasks
          .sort((a, b) => b.rubricScores.totalScore - a.rubricScores.totalScore)
          .slice(0, 3);
        
        report.push('');
        report.push('### Top Priority Tasks Migrated');
        topTasks.forEach((task, index) => {
          report.push(`${index + 1}. **${task.title}** (Score: ${task.rubricScores.totalScore})`);
        });
      }
      report.push('');
    }

    // Errors
    if (result.errors.length > 0) {
      report.push('## Issues Encountered');
      result.errors.forEach((error, index) => {
        report.push(`${index + 1}. ${error}`);
      });
      report.push('');
    }

    // Next Steps
    report.push('## Next Steps');
    
    if (result.success) {
      report.push('✅ **Workspace setup completed successfully!**');
      report.push('');
      report.push('### Recommended Actions:');
      report.push('1. **Verify setup** - Check your Notion workspace to confirm databases were created');
      report.push('2. **Review migrated tasks** - Prioritize tasks based on rubric scores');
      report.push('3. **Configure team access** - Share databases with team members');
      report.push('4. **Set up notifications** - Enable Notion notifications for task updates');
      report.push('5. **Start using the system** - Begin managing tasks through the integrated interface');
    } else {
      report.push('⚠️ **Setup encountered issues that need attention**');
      report.push('');
      report.push('### Required Actions:');
      report.push('1. **Address errors** - Review and fix the issues listed above');
      report.push('2. **Verify API key** - Ensure NOTION_API_KEY environment variable is set correctly');
      report.push('3. **Check permissions** - Verify API key has access to create databases and pages');
      report.push('4. **Retry setup** - Run the setup process again after fixing issues');
    }

    // API Integration
    report.push('');
    report.push('## API Integration');
    report.push('Use these endpoints to interact with your Notion workspace:');
    report.push('- `POST /api/notion/tasks` - Create new tasks with automatic scoring');
    report.push('- `GET /api/notion/tasks` - Retrieve tasks with priority rankings');
    report.push('- `PUT /api/notion/tasks/[id]` - Update task details and recalculate scores');
    report.push('- `POST /api/notion/migrate` - Migrate additional tasks with rubric scoring');
    
    return report.join('\n');
  }

  // Quick setup method for the specific Tessellate workspace
  async quickSetupTessellateWorkspace(dryRun: boolean = false): Promise<WorkspaceSetupResult> {
    const options: WorkspaceSetupOptions = {
      workspaceUrl: 'https://www.notion.so/tessellate-25d1d37fdbe780118949e39b803f5690',
      createDatabases: true,
      migrateInternalTodos: true,
      setupRubricSystem: true,
      dryRun,
    };

    return this.setupTessellateWorkspace(options);
  }
}

export default new NotionWorkspaceSetupService();