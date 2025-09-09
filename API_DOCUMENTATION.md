# Tessellate Notion Task Management API

This document describes the comprehensive API endpoints for managing tasks in Notion with integrated rubric-based prioritization.

## Overview

The Tessellate task management system provides:
- Notion workspace integration
- Automatic rubric-based task scoring and prioritization
- Task migration with intelligent scoring
- Automatic synchronization between systems
- Comprehensive task management operations

## Authentication

All API endpoints require a valid `NOTION_API_KEY` environment variable to be set. The API key should have access to create and manage databases and pages in your Notion workspace.

## Base URL

All endpoints are prefixed with `/api/notion/`

---

## Workspace Management

### Setup Workspace

**POST** `/api/notion/workspace`

Set up the Tessellate Notion workspace with databases and initial configuration.

#### Request Body

```json
{
  "action": "setup",
  "options": {
    "workspaceUrl": "https://www.notion.so/tessellate-25d1d37fdbe780118949e39b803f5690",
    "createDatabases": true,
    "migrateInternalTodos": true,
    "setupRubricSystem": true,
    "dryRun": false
  }
}
```

#### Quick Setup

```json
{
  "action": "quick-setup",
  "options": {
    "dryRun": false
  }
}
```

#### Response

```json
{
  "success": true,
  "data": {
    "success": true,
    "config": {
      "workspaceId": "25d1d37fdbe780118949e39b803f5690",
      "projectsDatabaseId": "database-id-projects",
      "tasksDatabaseId": "database-id-tasks"
    },
    "projectsDatabaseId": "database-id-projects",
    "tasksDatabaseId": "database-id-tasks",
    "migrationResult": {
      "totalTasks": 5,
      "successfulMigrations": 5,
      "failedMigrations": 0,
      "scoredTasks": [...],
      "migrationReport": "..."
    },
    "setupReport": "..."
  }
}
```

### Get Workspace Configuration

**GET** `/api/notion/workspace`

Retrieve the current workspace configuration.

#### Response

```json
{
  "success": true,
  "data": {
    "workspaceId": "25d1d37fdbe780118949e39b803f5690",
    "projectsDatabaseId": "database-id-projects",
    "tasksDatabaseId": "database-id-tasks"
  }
}
```

---

## Task Management

### Get Tasks

**GET** `/api/notion/tasks`

Retrieve tasks from a Notion database with optional rubric scoring.

#### Query Parameters

- `databaseId` (required): The Notion database ID
- `includeScoring` (optional): Set to `true` to include rubric scores
- `sortByPriority` (optional): Set to `true` to sort by priority score
- `filter` (optional): JSON filter object for Notion queries
- `sorts` (optional): JSON sorts array for Notion queries
- `pageSize` (optional): Number of results per page
- `startCursor` (optional): Pagination cursor

#### Examples

```bash
# Basic task retrieval
GET /api/notion/tasks?databaseId=your-db-id

# With rubric scoring and priority sorting
GET /api/notion/tasks?databaseId=your-db-id&includeScoring=true&sortByPriority=true
```

#### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "task-id",
      "title": "Update layout for fixed navigation",
      "description": "Implement responsive navigation...",
      "status": "In Progress",
      "priority": "High",
      "dueDate": "2024-01-15",
      "estimatedHours": 8,
      "tags": ["ui", "navigation"],
      "urgencyScore": 7.5,
      "impactScore": 8.2,
      "effortScore": 6.8,
      "dependenciesScore": 5.5,
      "totalRubricScore": 7.2,
      "priorityReason": "Priority based on: high impact, moderate urgency",
      "rubricScores": {
        "urgency": 7.5,
        "impact": 8.2,
        "effort": 6.8,
        "dependencies": 5.5,
        "totalScore": 7.2
      }
    }
  ],
  "message": "Retrieved 5 tasks with rubric scoring"
}
```

### Create Task

**POST** `/api/notion/tasks`

Create a new task with automatic rubric scoring.

#### Request Body

```json
{
  "databaseId": "your-database-id",
  "autoScore": true,
  "task": {
    "title": "Implement user authentication",
    "description": "Add secure login and registration system",
    "dueDate": "2024-02-01",
    "estimatedHours": 16,
    "tags": ["auth", "security", "backend"],
    "status": "To Do"
  }
}
```

#### Response

```json
{
  "success": true,
  "data": "page-id",
  "message": "Task created successfully with automatic rubric scoring"
}
```

### Update Task

**PUT** `/api/notion/tasks/[id]`

Update an existing task with optional score recalculation.

#### Request Body

```json
{
  "recalculateScore": true,
  "updates": {
    "status": "In Progress",
    "description": "Updated task description...",
    "estimatedHours": 12
  }
}
```

#### Response

```json
{
  "success": true,
  "data": true,
  "message": "Task updated successfully with recalculated rubric scores"
}
```

---

## Task Migration

### Migrate Tasks

**POST** `/api/notion/migrate`

Migrate tasks to Notion with rubric-based scoring and prioritization.

#### Internal Todos Migration

```json
{
  "type": "internal-todos",
  "options": {
    "tasksDatabaseId": "your-database-id",
    "includeRubricScores": true,
    "autoAssignPriority": true,
    "dryRun": false
  }
}
```

#### Custom Tasks Migration

```json
{
  "type": "custom-tasks",
  "options": {
    "tasksDatabaseId": "your-database-id",
    "includeRubricScores": true,
    "autoAssignPriority": true,
    "dryRun": false
  },
  "tasks": [
    {
      "title": "Task 1",
      "description": "Description...",
      "dueDate": "2024-01-20",
      "estimatedHours": 8
    }
  ]
}
```

#### Update Existing Task Scores

```json
{
  "type": "update-scores",
  "options": {
    "tasksDatabaseId": "your-database-id"
  }
}
```

#### Response

```json
{
  "success": true,
  "data": {
    "totalTasks": 5,
    "successfulMigrations": 5,
    "failedMigrations": 0,
    "scoredTasks": [...],
    "errors": [],
    "migrationReport": "# Task Migration Report..."
  },
  "message": "Migration completed: 5/5 tasks"
}
```

### Get Migration Status

**GET** `/api/notion/migrate?tasksDatabaseId=your-db-id`

Check the migration status of a database.

#### Response

```json
{
  "success": true,
  "data": {
    "hasRubricScores": true,
    "totalTasks": 25,
    "tasksWithScores": 25,
    "lastMigration": "2024-01-10T10:30:00Z"
  }
}
```

---

## Rubric System

### Score Tasks

**POST** `/api/notion/rubric`

Use the rubric system for task scoring and analysis.

#### Score Single Task

```json
{
  "action": "score-task",
  "task": {
    "title": "Fix security vulnerability",
    "description": "Critical security issue needs immediate attention",
    "dueDate": "2024-01-12",
    "estimatedHours": 4,
    "tags": ["security", "critical"]
  }
}
```

#### Score Multiple Tasks

```json
{
  "action": "score-tasks",
  "tasks": [
    { "title": "Task 1", "..." },
    { "title": "Task 2", "..." }
  ]
}
```

#### Compare Tasks

```json
{
  "action": "compare-tasks",
  "tasks": [
    { "title": "Task A", "..." },
    { "title": "Task B", "..." }
  ]
}
```

#### Generate Priority Report

```json
{
  "action": "generate-report",
  "tasks": [/* scored tasks array */]
}
```

#### Get Internal Todos

```json
{
  "action": "get-internal-todos"
}
```

### Get Rubric Configuration

**GET** `/api/notion/rubric`

#### Get Scoring Criteria

```bash
GET /api/notion/rubric?type=config
```

#### Response

```json
{
  "success": true,
  "data": {
    "criteria": {
      "urgency": {
        "weight": 0.3,
        "description": "Time sensitivity and deadline pressure",
        "scale": "Higher score for more urgent tasks"
      },
      "impact": {
        "weight": 0.4,
        "description": "Business value and user impact",
        "scale": "Higher score for greater business impact"
      },
      "effort": {
        "weight": 0.2,
        "description": "Development complexity (lower effort = higher score)",
        "scale": "Higher score for less effort required"
      },
      "dependencies": {
        "weight": 0.1,
        "description": "Blocking other tasks or critical path",
        "scale": "Higher score for tasks that unblock others"
      }
    },
    "scoreRanges": {
      "urgent": { "min": 8.0, "color": "red" },
      "high": { "min": 6.5, "color": "orange" },
      "medium": { "min": 4.0, "color": "yellow" },
      "low": { "min": 0, "color": "gray" }
    }
  }
}
```

---

## Automatic Synchronization

### Start Auto-Sync

**POST** `/api/notion/sync`

Start automatic synchronization between internal todos and Notion.

#### Request Body

```json
{
  "action": "start",
  "config": {
    "tasksDatabaseId": "your-database-id"
  },
  "options": {
    "syncInterval": 15,
    "autoScore": true,
    "bidirectionalSync": true,
    "conflictResolution": "merge"
  }
}
```

### Stop Auto-Sync

```json
{
  "action": "stop"
}
```

### Force Manual Sync

```json
{
  "action": "force-sync",
  "config": {
    "tasksDatabaseId": "your-database-id"
  },
  "options": {
    "autoScore": true,
    "bidirectionalSync": true
  }
}
```

### Get Sync Status

**GET** `/api/notion/sync`

#### Response

```json
{
  "success": true,
  "data": {
    "isActive": true,
    "lastSyncAt": "2024-01-10T15:30:00Z",
    "nextSyncAt": "2024-01-10T15:45:00Z",
    "syncInterval": 15,
    "tasksLastUpdated": 3,
    "errors": [],
    "successfulSyncs": 42,
    "failedSyncs": 1
  }
}
```

---

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error description"
}
```

Common HTTP status codes:
- `200` - Success
- `400` - Bad Request (missing parameters, invalid data)
- `500` - Internal Server Error

---

## Usage Examples

### Complete Workflow Example

```javascript
// 1. Set up workspace
const setupResponse = await fetch('/api/notion/workspace', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'quick-setup',
    options: { dryRun: false }
  })
});

const setup = await setupResponse.json();
const tasksDatabaseId = setup.data.tasksDatabaseId;

// 2. Start auto-sync
await fetch('/api/notion/sync', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'start',
    config: { tasksDatabaseId },
    options: {
      syncInterval: 15,
      autoScore: true,
      bidirectionalSync: true
    }
  })
});

// 3. Create a new task with scoring
await fetch('/api/notion/tasks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    databaseId: tasksDatabaseId,
    autoScore: true,
    task: {
      title: 'Implement dark mode',
      description: 'Add dark theme support across the application',
      dueDate: '2024-02-15',
      estimatedHours: 12,
      tags: ['ui', 'theme', 'accessibility']
    }
  })
});

// 4. Get prioritized task list
const tasksResponse = await fetch(
  `/api/notion/tasks?databaseId=${tasksDatabaseId}&includeScoring=true&sortByPriority=true`
);
const tasks = await tasksResponse.json();
```

---

## Environment Variables

Required environment variables:

```bash
NOTION_API_KEY=your_notion_integration_token
```

Optional environment variables:

```bash
RUBRIC_SDK_CONFIG_PATH=/path/to/rubric/config.yml
SYNC_DEFAULT_INTERVAL=15
AUTO_SCORE_ENABLED=true
```

---

## Notion Database Schema

The system creates databases with the following properties:

### Tasks Database

- **Title** (Title): Task name
- **Status** (Select): To Do, In Progress, Review, Done, Blocked
- **Priority** (Select): Low, Medium, High, Urgent
- **Description** (Rich Text): Task details
- **Assignee** (Person): Task assignee
- **Project** (Relation): Link to project
- **Due Date** (Date): Task deadline
- **Estimated Hours** (Number): Time estimate
- **Actual Hours** (Number): Time spent
- **Tags** (Multi-select): Task categories
- **Urgency Score** (Number): Rubric urgency score (0-10)
- **Impact Score** (Number): Rubric impact score (0-10)
- **Effort Score** (Number): Rubric effort score (0-10)
- **Dependencies Score** (Number): Rubric dependencies score (0-10)
- **Total Rubric Score** (Number): Combined rubric score
- **Priority Reason** (Rich Text): Explanation for priority assignment

This comprehensive API provides everything needed to integrate sophisticated task management with Notion, including automatic prioritization, scoring, and synchronization capabilities.