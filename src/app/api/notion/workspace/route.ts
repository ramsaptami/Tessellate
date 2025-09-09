import { NextRequest, NextResponse } from 'next/server';
import NotionWorkspaceSetupService, { WorkspaceSetupOptions } from '@/lib/services/notionWorkspaceSetup';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, options } = body;

    if (!action) {
      return NextResponse.json(
        { error: 'Action is required' },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case 'setup':
        if (!options?.workspaceUrl) {
          return NextResponse.json(
            { error: 'workspaceUrl is required for setup' },
            { status: 400 }
          );
        }

        const setupOptions: WorkspaceSetupOptions = {
          workspaceUrl: options.workspaceUrl,
          createDatabases: options.createDatabases ?? true,
          migrateInternalTodos: options.migrateInternalTodos ?? true,
          setupRubricSystem: options.setupRubricSystem ?? true,
          dryRun: options.dryRun ?? false,
        };

        result = await NotionWorkspaceSetupService.setupTessellateWorkspace(setupOptions);
        break;

      case 'quick-setup':
        const dryRun = options?.dryRun ?? false;
        result = await NotionWorkspaceSetupService.quickSetupTessellateWorkspace(dryRun);
        break;

      case 'check':
        if (!options?.workspaceUrl) {
          return NextResponse.json(
            { error: 'workspaceUrl is required for check' },
            { status: 400 }
          );
        }
        result = await NotionWorkspaceSetupService.checkWorkspaceSetup(options.workspaceUrl);
        break;

      case 'setup-auto-sync':
        if (!options?.config) {
          return NextResponse.json(
            { error: 'config is required for auto-sync setup' },
            { status: 400 }
          );
        }
        result = await NotionWorkspaceSetupService.setupAutoSync(options.config);
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: setup, quick-setup, check, or setup-auto-sync' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: result,
    });

  } catch (error) {
    console.error('Workspace API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Workspace operation failed' 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const config = NotionWorkspaceSetupService.getWorkspaceConfig();
    
    return NextResponse.json({
      success: true,
      data: config,
    });

  } catch (error) {
    console.error('Workspace config API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get workspace config' 
      },
      { status: 500 }
    );
  }
}