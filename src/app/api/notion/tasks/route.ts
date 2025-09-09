import { NextRequest, NextResponse } from 'next/server';
import notionService from '@/lib/services/notion';
import rubricService from '@/lib/services/rubric';

// GET /api/notion/tasks - Get all tasks
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const databaseId = searchParams.get('databaseId');
    const includeScoring = searchParams.get('includeScoring') === 'true';
    const sortByPriority = searchParams.get('sortByPriority') === 'true';

    if (!databaseId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Database ID is required',
        },
        { status: 400 }
      );
    }

    // Parse query options
    const filter = searchParams.get('filter') ? JSON.parse(searchParams.get('filter')!) : undefined;
    const sorts = searchParams.get('sorts') ? JSON.parse(searchParams.get('sorts')!) : undefined;
    const startCursor = searchParams.get('startCursor') || undefined;
    const pageSize = searchParams.get('pageSize') ? parseInt(searchParams.get('pageSize')!) : undefined;

    const result = await notionService.getTasks(databaseId, {
      filter,
      sorts,
      startCursor,
      pageSize,
    });

    // If rubric scoring is requested, enhance tasks with scores
    if (result.success && result.data && includeScoring) {
      try {
        const scoredTasks = await rubricService.scoreTasks(result.data);
        
        // Sort by priority score if requested
        if (sortByPriority) {
          scoredTasks.sort((a, b) => b.rubricScores.totalScore - a.rubricScores.totalScore);
        }

        result.data = scoredTasks;
        result.message = `Retrieved ${scoredTasks.length} tasks with rubric scoring`;
      } catch (scoringError) {
        console.error('Error adding rubric scores:', scoringError);
        // Continue without scoring rather than failing the entire request
      }
    }

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch tasks',
      },
      { status: 500 }
    );
  }
}

// POST /api/notion/tasks - Create a new task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { databaseId, task, autoScore = true } = body;

    if (!databaseId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Database ID is required',
        },
        { status: 400 }
      );
    }

    if (!task || !task.title) {
      return NextResponse.json(
        {
          success: false,
          error: 'Task title is required',
        },
        { status: 400 }
      );
    }

    let taskToCreate = task;

    // Add automatic rubric scoring if requested
    if (autoScore) {
      try {
        const scoredTasks = await rubricService.scoreTasks([task]);
        if (scoredTasks.length > 0) {
          const scoredTask = scoredTasks[0];
          taskToCreate = {
            ...task,
            priority: scoredTask.priority,
            urgencyScore: scoredTask.rubricScores.urgency,
            impactScore: scoredTask.rubricScores.impact,
            effortScore: scoredTask.rubricScores.effort,
            dependenciesScore: scoredTask.rubricScores.dependencies,
            totalRubricScore: scoredTask.rubricScores.totalScore,
            priorityReason: scoredTask.priorityReason,
          };
        }
      } catch (scoringError) {
        console.error('Error scoring task:', scoringError);
        // Continue with original task if scoring fails
      }
    }

    const result = await notionService.createTask(databaseId, taskToCreate);

    if (result.success) {
      const response = {
        ...result,
        message: autoScore ? 
          'Task created successfully with automatic rubric scoring' : 
          'Task created successfully'
      };
      return NextResponse.json(response);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create task',
      },
      { status: 500 }
    );
  }
}