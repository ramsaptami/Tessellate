# Notion API Integration for Tessellate

This document provides a comprehensive guide to the Notion API integration implemented in the Tessellate project management application.

## Overview

The Notion integration allows Tessellate to sync with Notion workspaces for enhanced project management capabilities, including:

- **Project Management**: Create and manage projects with status tracking, priority levels, and team assignments
- **Task Management**: Track tasks with detailed metadata including assignees, due dates, and time estimates
- **Real-time Sync**: Bidirectional synchronization between Tessellate and Notion
- **Dashboard Analytics**: Comprehensive metrics and insights from your Notion data
- **Team Collaboration**: Seamless collaboration through Notion's powerful features

## Architecture

### Components Structure
```
src/
├── lib/
│   ├── types/notion.ts           # TypeScript type definitions
│   ├── services/notion.ts        # Core Notion API service
│   ├── stores/notionStore.ts     # Zustand state management
│   └── hooks/useNotion.ts        # React hooks for data fetching
├── components/notion/
│   ├── NotionDashboard.tsx       # Main dashboard component
│   ├── NotionConnectionStatus.tsx # Connection status indicator
│   ├── NotionSetup.tsx          # Initial setup wizard
│   ├── NotionProjectsList.tsx    # Projects management interface
│   ├── NotionTasksList.tsx       # Tasks management interface
│   └── NotionErrorBoundary.tsx   # Error handling component
└── app/api/notion/
    ├── connection/route.ts       # Connection testing endpoint
    ├── databases/route.ts        # Database creation endpoints
    ├── projects/route.ts         # Projects CRUD operations
    ├── tasks/route.ts           # Tasks CRUD operations
    └── dashboard/route.ts        # Dashboard metrics endpoint
```

## Setup Instructions

### 1. Environment Configuration

Add the following environment variable to your `.env.local` file:

```bash
NOTION_API_KEY=your_notion_integration_key_here
```

### 2. Create a Notion Integration

1. Visit [Notion Integrations](https://www.notion.so/my-integrations)
2. Click "New integration"
3. Fill in the basic information:
   - **Name**: Tessellate Integration
   - **Logo**: (optional)
   - **Associated workspace**: Select your workspace
4. Click "Submit"
5. Copy the "Internal Integration Secret" - this is your `NOTION_API_KEY`

### 3. Set up Databases

The integration requires two databases in your Notion workspace:

#### Projects Database
- **Name**: Project title
- **Status**: Select property (Not Started, In Progress, On Hold, Completed, Cancelled)
- **Priority**: Select property (Low, Medium, High, Urgent)
- **Description**: Rich text
- **Start Date**: Date property
- **End Date**: Date property
- **Progress**: Number property (percentage)
- **Team Members**: Multi-select property
- **Tags**: Multi-select property

#### Tasks Database
- **Title**: Task title
- **Status**: Select property (To Do, In Progress, Review, Done, Blocked)
- **Priority**: Select property (Low, Medium, High, Urgent)
- **Description**: Rich text
- **Assignee**: Person property
- **Project**: Relation to Projects database
- **Due Date**: Date property
- **Estimated Hours**: Number property
- **Actual Hours**: Number property
- **Tags**: Multi-select property

### 4. Grant Access

For each database:
1. Click the "..." menu in the top right
2. Select "Add connections"
3. Choose your Tessellate integration

## API Endpoints

### Connection Management
- `GET /api/notion/connection` - Test connection status
- `POST /api/notion/databases` - Create new databases

### Projects Management
- `GET /api/notion/projects?databaseId={id}` - Fetch all projects
- `POST /api/notion/projects` - Create new project
- `PUT /api/notion/projects/[id]` - Update project

### Tasks Management
- `GET /api/notion/tasks?databaseId={id}` - Fetch all tasks
- `POST /api/notion/tasks` - Create new task
- `PUT /api/notion/tasks/[id]` - Update task

### Dashboard Metrics
- `GET /api/notion/dashboard?projectsDatabaseId={id}&tasksDatabaseId={id}` - Get dashboard metrics

## Usage Examples

### Basic Integration Setup

```typescript
import { useNotionConnection, useNotionProjects } from '@/lib/hooks/useNotion';
import useNotionStore from '@/lib/stores/notionStore';

function MyComponent() {
  const { data: connection } = useNotionConnection();
  const { config } = useNotionStore();
  const { data: projects } = useNotionProjects(config.projectsDatabaseId);

  return (
    <div>
      <p>Connected: {connection?.isConnected ? 'Yes' : 'No'}</p>
      <p>Projects: {projects?.length || 0}</p>
    </div>
  );
}
```

### Creating Projects

```typescript
import { useCreateNotionProject } from '@/lib/hooks/useNotion';
import { ProjectStatus, TaskPriority } from '@/lib/types/notion';

function CreateProject() {
  const createProject = useCreateNotionProject(databaseId);

  const handleCreate = async () => {
    await createProject.mutateAsync({
      name: 'New Project',
      status: ProjectStatus.NOT_STARTED,
      priority: TaskPriority.MEDIUM,
      description: 'Project description',
      teamMembers: ['John Doe', 'Jane Smith'],
      tags: ['development', 'frontend']
    });
  };

  return <button onClick={handleCreate}>Create Project</button>;
}
```

### Managing Tasks

```typescript
import { useCreateNotionTask, useUpdateNotionTask } from '@/lib/hooks/useNotion';
import { TaskStatus, TaskPriority } from '@/lib/types/notion';

function TaskManager() {
  const createTask = useCreateNotionTask(tasksDatabaseId);
  const updateTask = useUpdateNotionTask();

  const createNewTask = async () => {
    await createTask.mutateAsync({
      title: 'Implement feature X',
      status: TaskStatus.TODO,
      priority: TaskPriority.HIGH,
      description: 'Detailed task description',
      dueDate: '2024-12-31',
      estimatedHours: 8,
      tags: ['feature', 'frontend']
    });
  };

  const markTaskComplete = async (taskId: string) => {
    await updateTask.mutateAsync({
      id: taskId,
      updates: { status: TaskStatus.DONE }
    });
  };

  return (
    <div>
      <button onClick={createNewTask}>Create Task</button>
      <button onClick={() => markTaskComplete('task-id')}>
        Mark Complete
      </button>
    </div>
  );
}
```

## State Management

The integration uses Zustand for state management with persistence:

```typescript
import useNotionStore from '@/lib/stores/notionStore';

function MyComponent() {
  const { 
    config, 
    connectionStatus, 
    projects, 
    tasks,
    setConfig,
    addProject,
    updateTask 
  } = useNotionStore();

  // Update configuration
  const updateConfig = () => {
    setConfig({
      projectsDatabaseId: 'new-database-id',
      tasksDatabaseId: 'another-database-id'
    });
  };

  return <div><!-- component JSX --></div>;
}
```

## Error Handling

The integration includes comprehensive error handling:

1. **Connection Errors**: Network issues, invalid API keys
2. **Authentication Errors**: Expired tokens, insufficient permissions
3. **Database Errors**: Missing databases, invalid database schemas
4. **Rate Limiting**: Automatic retry with exponential backoff
5. **Data Validation**: Client-side and server-side validation

### Error Boundary Usage

```typescript
import NotionErrorBoundary from '@/components/notion/NotionErrorBoundary';

function App() {
  return (
    <NotionErrorBoundary>
      <NotionDashboard />
    </NotionErrorBoundary>
  );
}
```

## Performance Considerations

- **Caching**: React Query handles data caching with configurable stale times
- **Pagination**: Large datasets are paginated automatically
- **Optimistic Updates**: UI updates immediately for better UX
- **Background Sync**: Data syncs periodically in the background
- **Rate Limiting**: Respects Notion's API rate limits

## Troubleshooting

### Common Issues

1. **"Notion client not initialized"**
   - Check that `NOTION_API_KEY` is set correctly
   - Restart the development server after adding the environment variable

2. **"Database not found"**
   - Verify database IDs are correct
   - Ensure the integration has access to the databases

3. **"Insufficient permissions"**
   - Check that the Notion integration is connected to your databases
   - Verify the integration has the correct capabilities enabled

4. **Rate limiting errors**
   - The integration automatically handles rate limits with retries
   - If persistent, consider reducing the frequency of API calls

### Debug Mode

Enable debug logging by setting:
```bash
NODE_ENV=development
DEBUG=notion:*
```

## Security Considerations

- **API Key Protection**: Never expose the Notion API key in client-side code
- **Data Validation**: All inputs are validated on both client and server
- **Error Sanitization**: Error messages don't expose sensitive information
- **Rate Limiting**: Built-in protection against abuse

## Contributing

When contributing to the Notion integration:

1. Follow the existing TypeScript patterns
2. Add proper error handling for new features
3. Include unit tests for new functionality
4. Update this documentation for new features
5. Test thoroughly with different Notion workspace configurations

## License

This Notion integration is part of the Tessellate project and follows the same licensing terms.