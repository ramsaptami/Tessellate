import { NextRequest, NextResponse } from 'next/server';
import notionService from '@/lib/services/notion';

// POST /api/notion/databases - Create Notion databases
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { parentPageId, type } = body;

    if (!parentPageId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Parent page ID is required',
        },
        { status: 400 }
      );
    }

    if (!type || !['projects', 'tasks'].includes(type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Database type must be "projects" or "tasks"',
        },
        { status: 400 }
      );
    }

    let result;
    if (type === 'projects') {
      result = await notionService.createProjectsDatabase(parentPageId);
    } else {
      result = await notionService.createTasksDatabase(parentPageId);
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
        error: 'Failed to create database',
      },
      { status: 500 }
    );
  }
}