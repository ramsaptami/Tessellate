import { NextRequest, NextResponse } from 'next/server';
import AutoSyncService, { SyncOptions } from '@/lib/services/autoSync';
import { NotionWorkspaceConfig } from '@/lib/types/notion';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, config, options } = body;

    if (!action) {
      return NextResponse.json(
        { error: 'Action is required' },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case 'start':
        if (!config?.tasksDatabaseId) {
          return NextResponse.json(
            { error: 'config with tasksDatabaseId is required to start sync' },
            { status: 400 }
          );
        }

        const syncOptions: SyncOptions = {
          syncInterval: options?.syncInterval ?? 15, // 15 minutes default
          autoScore: options?.autoScore ?? true,
          bidirectionalSync: options?.bidirectionalSync ?? true,
          conflictResolution: options?.conflictResolution ?? 'merge',
        };

        result = AutoSyncService.startAutoSync(config, syncOptions);
        break;

      case 'stop':
        result = AutoSyncService.stopAutoSync();
        break;

      case 'force-sync':
        if (!config?.tasksDatabaseId) {
          return NextResponse.json(
            { error: 'config with tasksDatabaseId is required for force sync' },
            { status: 400 }
          );
        }
        result = await AutoSyncService.forceSync(config, options);
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: start, stop, or force-sync' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: result,
    });

  } catch (error) {
    console.error('Sync API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Sync operation failed' 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const status = AutoSyncService.getSyncStatus();
    
    return NextResponse.json({
      success: true,
      data: status,
    });

  } catch (error) {
    console.error('Sync status API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get sync status' 
      },
      { status: 500 }
    );
  }
}