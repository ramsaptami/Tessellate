import { NextRequest, NextResponse } from 'next/server';
import notionService from '@/lib/services/notion';
import rubricService from '@/lib/services/rubric';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// PUT /api/notion/tasks/[id] - Update a task
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { updates, recalculateScore = false } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Task ID is required',
        },
        { status: 400 }
      );
    }

    if (!updates) {
      return NextResponse.json(
        {
          success: false,
          error: 'Updates are required',
        },
        { status: 400 }
      );
    }

    let updatesToApply = updates;

    // Recalculate rubric score if requested or if key fields changed
    if (recalculateScore || 
        updates.description !== undefined || 
        updates.dueDate !== undefined || 
        updates.estimatedHours !== undefined ||
        updates.tags !== undefined) {
      try {
        const scoredTasks = await rubricService.scoreTasks([updates]);
        if (scoredTasks.length > 0) {
          const scoredTask = scoredTasks[0];
          updatesToApply = {
            ...updates,
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
        console.error('Error recalculating rubric score:', scoringError);
        // Continue with original updates if scoring fails
      }
    }

    const result = await notionService.updateTask(id, updatesToApply);

    if (result.success) {
      const response = {
        ...result,
        message: recalculateScore || 
          (updates.description !== undefined || updates.dueDate !== undefined) ? 
          'Task updated successfully with recalculated rubric scores' : 
          'Task updated successfully'
      };
      return NextResponse.json(response);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update task',
      },
      { status: 500 }
    );
  }
}