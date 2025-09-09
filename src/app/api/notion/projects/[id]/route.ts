import { NextRequest, NextResponse } from 'next/server';
import notionService from '@/lib/services/notion';

interface RouteParams {
  params: {
    id: string;
  };
}

// PUT /api/notion/projects/[id] - Update a project
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const body = await request.json();
    const { updates } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Project ID is required',
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

    const result = await notionService.updateProject(id, updates);

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update project',
      },
      { status: 500 }
    );
  }
}