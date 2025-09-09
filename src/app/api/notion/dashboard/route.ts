import { NextRequest, NextResponse } from 'next/server';
import notionService from '@/lib/services/notion';

// GET /api/notion/dashboard - Get dashboard metrics from Notion
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectsDatabaseId = searchParams.get('projectsDatabaseId');
    const tasksDatabaseId = searchParams.get('tasksDatabaseId');

    if (!projectsDatabaseId || !tasksDatabaseId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Both projectsDatabaseId and tasksDatabaseId are required',
        },
        { status: 400 }
      );
    }

    const result = await notionService.getDashboardMetrics(projectsDatabaseId, tasksDatabaseId);

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch dashboard metrics',
      },
      { status: 500 }
    );
  }
}