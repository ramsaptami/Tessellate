import { NextRequest, NextResponse } from 'next/server';
import notionService from '@/lib/services/notion';

// GET /api/notion/projects - Get all projects
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

    const result = await notionService.getProjects(databaseId, {
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
        error: 'Failed to fetch projects',
      },
      { status: 500 }
    );
  }
}

// POST /api/notion/projects - Create a new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { databaseId, project } = body;

    if (!databaseId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Database ID is required',
        },
        { status: 400 }
      );
    }

    if (!project || !project.name) {
      return NextResponse.json(
        {
          success: false,
          error: 'Project name is required',
        },
        { status: 400 }
      );
    }

    const result = await notionService.createProject(databaseId, project);

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create project',
      },
      { status: 500 }
    );
  }
}