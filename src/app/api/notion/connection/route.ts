import { NextRequest, NextResponse } from 'next/server';
import notionService from '@/lib/services/notion';

// GET /api/notion/connection - Test Notion connection
export async function GET() {
  try {
    const connectionStatus = await notionService.testConnection();
    return NextResponse.json(connectionStatus);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to test Notion connection',
        data: {
          isConnected: false,
          syncStatus: 'error',
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}