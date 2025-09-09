import { NextRequest, NextResponse } from 'next/server';
import notionService from '@/lib/services/notion';

// GET /api/notion/tasks - Get all tasks
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const databaseId = searchParams.get('databaseId');

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
    const { databaseId, task } = body;

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

    const result = await notionService.createTask(databaseId, task);

    if (result.success) {
      return NextResponse.json(result);
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