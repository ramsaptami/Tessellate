import { NextRequest, NextResponse } from 'next/server';
import RubricService, { ScoredTask } from '@/lib/services/rubric';
import { Task } from '@/lib/types/notion';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, task, tasks } = body;

    if (!action) {
      return NextResponse.json(
        { error: 'Action is required' },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case 'score-task':
        if (!task) {
          return NextResponse.json(
            { error: 'task is required for scoring' },
            { status: 400 }
          );
        }
        result = await RubricService.scoreTask(task);
        break;

      case 'score-tasks':
        if (!tasks || !Array.isArray(tasks)) {
          return NextResponse.json(
            { error: 'tasks array is required for batch scoring' },
            { status: 400 }
          );
        }
        result = await RubricService.scoreTasks(tasks);
        break;

      case 'compare-tasks':
        if (!tasks || !Array.isArray(tasks)) {
          return NextResponse.json(
            { error: 'tasks array is required for comparison' },
            { status: 400 }
          );
        }
        result = await RubricService.compareTasks(tasks);
        break;

      case 'generate-report':
        if (!tasks || !Array.isArray(tasks)) {
          return NextResponse.json(
            { error: 'scored tasks array is required for report generation' },
            { status: 400 }
          );
        }
        result = await RubricService.generateScoringReport(tasks);
        break;

      case 'get-internal-todos':
        result = await RubricService.migrateInternalTodos();
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: score-task, score-tasks, compare-tasks, generate-report, or get-internal-todos' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: result,
    });

  } catch (error) {
    console.error('Rubric API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Rubric operation failed' 
      },
      { status: 500 }
    );
  }
}

// GET endpoint for rubric criteria and configuration
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'config';

    let result;

    switch (type) {
      case 'config':
        result = {
          criteria: {
            urgency: { 
              weight: 0.3, 
              description: 'Time sensitivity and deadline pressure',
              scale: 'Higher score for more urgent tasks'
            },
            impact: { 
              weight: 0.4, 
              description: 'Business value and user impact',
              scale: 'Higher score for greater business impact'
            },
            effort: { 
              weight: 0.2, 
              description: 'Development complexity (lower effort = higher score)',
              scale: 'Higher score for less effort required'
            },
            dependencies: { 
              weight: 0.1, 
              description: 'Blocking other tasks or critical path',
              scale: 'Higher score for tasks that unblock others'
            }
          },
          scoreRanges: {
            urgent: { min: 8.0, color: 'red', description: 'Critical priority tasks' },
            high: { min: 6.5, color: 'orange', description: 'High priority tasks' },
            medium: { min: 4.0, color: 'yellow', description: 'Medium priority tasks' },
            low: { min: 0, color: 'gray', description: 'Low priority tasks' }
          }
        };
        break;

      case 'examples':
        result = {
          examples: [
            {
              title: 'Fix critical security vulnerability',
              expectedScores: { urgency: 10, impact: 9, effort: 6, dependencies: 8 },
              expectedPriority: 'Urgent',
              reasoning: 'Security issues are always high urgency and impact'
            },
            {
              title: 'Update documentation',
              expectedScores: { urgency: 3, impact: 4, effort: 8, dependencies: 2 },
              expectedPriority: 'Low',
              reasoning: 'Important but not urgent, low effort but low dependencies'
            },
            {
              title: 'Implement user authentication',
              expectedScores: { urgency: 7, impact: 9, effort: 4, dependencies: 9 },
              expectedPriority: 'High',
              reasoning: 'High impact feature that blocks other user features'
            }
          ]
        };
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid type. Use: config or examples' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: result,
    });

  } catch (error) {
    console.error('Rubric config API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get rubric configuration' 
      },
      { status: 500 }
    );
  }
}