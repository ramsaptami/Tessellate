import { NextRequest, NextResponse } from 'next/server';
import TaskMigrationService, { MigrationOptions } from '@/lib/services/taskMigration';
import { Task } from '@/lib/types/notion';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, options, tasks } = body;

    if (!type || !options?.tasksDatabaseId) {
      return NextResponse.json(
        { error: 'Migration type and tasks database ID are required' },
        { status: 400 }
      );
    }

    const migrationOptions: MigrationOptions = {
      tasksDatabaseId: options.tasksDatabaseId,
      includeRubricScores: options.includeRubricScores ?? true,
      autoAssignPriority: options.autoAssignPriority ?? true,
      dryRun: options.dryRun ?? false,
    };

    let result;

    switch (type) {
      case 'internal-todos':
        result = await TaskMigrationService.migrateInternalTodos(migrationOptions);
        break;
      
      case 'custom-tasks':
        if (!tasks || !Array.isArray(tasks)) {
          return NextResponse.json(
            { error: 'Tasks array is required for custom task migration' },
            { status: 400 }
          );
        }
        result = await TaskMigrationService.migrateTasks(tasks, migrationOptions);
        break;
      
      case 'update-scores':
        result = await TaskMigrationService.updateTasksWithScores(migrationOptions.tasksDatabaseId);
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid migration type. Use: internal-todos, custom-tasks, or update-scores' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: `Migration completed: ${result.successfulMigrations}/${result.totalTasks} tasks`,
    });

  } catch (error) {
    console.error('Migration API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Migration failed' 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tasksDatabaseId = searchParams.get('tasksDatabaseId');

    if (!tasksDatabaseId) {
      return NextResponse.json(
        { error: 'tasksDatabaseId parameter is required' },
        { status: 400 }
      );
    }

    const status = await TaskMigrationService.getMigrationStatus(tasksDatabaseId);

    return NextResponse.json({
      success: true,
      data: status,
    });

  } catch (error) {
    console.error('Migration status API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get migration status' 
      },
      { status: 500 }
    );
  }
}