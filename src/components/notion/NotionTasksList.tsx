'use client';

import { useState } from 'react';
import { Plus, MoreHorizontal, ExternalLink, User, Calendar, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNotionTasks, useCreateNotionTask, useUpdateNotionTask } from '@/lib/hooks/useNotion';
import useNotionStore from '@/lib/stores/notionStore';
import { Task, TaskStatus, TaskPriority } from '@/lib/types/notion';

export default function NotionTasksList() {
  const { config } = useNotionStore();
  const { data: tasks, isLoading, error } = useNotionTasks(config.tasksDatabaseId);
  const createTask = useCreateNotionTask(config.tasksDatabaseId);
  const updateTask = useUpdateNotionTask();
  
  const [isCreating, setIsCreating] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleCreateTask = async () => {
    if (!newTaskTitle.trim()) return;

    setIsCreating(true);
    try {
      await createTask.mutateAsync({
        title: newTaskTitle.trim(),
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        description: '',
        tags: [],
      });
      setNewTaskTitle('');
    } catch (error) {
      console.error('Failed to create task:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      await updateTask.mutateAsync({ id: taskId, updates });
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.TODO:
        return 'bg-gray-100 text-gray-800';
      case TaskStatus.IN_PROGRESS:
        return 'bg-blue-100 text-blue-800';
      case TaskStatus.REVIEW:
        return 'bg-yellow-100 text-yellow-800';
      case TaskStatus.DONE:
        return 'bg-green-100 text-green-800';
      case TaskStatus.BLOCKED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.LOW:
        return 'bg-gray-100 text-gray-600';
      case TaskPriority.MEDIUM:
        return 'bg-blue-100 text-blue-600';
      case TaskPriority.HIGH:
        return 'bg-orange-100 text-orange-600';
      case TaskPriority.URGENT:
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const isTaskOverdue = (task: Task) => {
    if (!task.dueDate) return false;
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    return dueDate < today && task.status !== TaskStatus.DONE;
  };

  if (!config.tasksDatabaseId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Please configure your Notion tasks database to view tasks.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">
            Error loading tasks: {error.message}
          </p>
        </CardContent>
      </Card>
    );
  }

  // Group tasks by status
  const tasksByStatus = tasks?.reduce((acc, task) => {
    if (!acc[task.status]) {
      acc[task.status] = [];
    }
    acc[task.status].push(task);
    return acc;
  }, {} as Record<TaskStatus, Task[]>);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Tasks</CardTitle>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Task title..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCreateTask();
              }
            }}
            className="px-2 py-1 text-sm border border-border rounded bg-background"
          />
          <button
            onClick={handleCreateTask}
            disabled={!newTaskTitle.trim() || isCreating}
            className="flex items-center gap-1 px-2 py-1 text-sm bg-primary text-primary-foreground hover:bg-primary/90 rounded transition-colors disabled:opacity-50"
          >
            <Plus className={`h-3 w-3 ${isCreating ? 'animate-spin' : ''}`} />
            Add
          </button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center text-muted-foreground py-8">
            Loading tasks...
          </div>
        ) : tasks && tasks.length > 0 ? (
          <div className="space-y-6">
            {/* Task Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-muted p-3 rounded-lg">
                <div className="text-lg font-bold">{tasks.filter(t => t.status === TaskStatus.TODO).length}</div>
                <div className="text-xs text-muted-foreground">To Do</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-lg font-bold text-blue-700">{tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length}</div>
                <div className="text-xs text-blue-600">In Progress</div>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <div className="text-lg font-bold text-yellow-700">{tasks.filter(t => t.status === TaskStatus.REVIEW).length}</div>
                <div className="text-xs text-yellow-600">Review</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-lg font-bold text-green-700">{tasks.filter(t => t.status === TaskStatus.DONE).length}</div>
                <div className="text-xs text-green-600">Done</div>
              </div>
            </div>

            {/* Recent Tasks */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Recent Tasks</h4>
              {tasks
                .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                .slice(0, 10)
                .map((task) => (
                  <div key={task.id} className="border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="font-medium text-sm">{task.title}</h5>
                          {task.url && (
                            <a
                              href={task.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                          {isTaskOverdue(task) && (
                            <span className="text-red-600 text-xs font-medium">OVERDUE</span>
                          )}
                        </div>
                        {task.description && (
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                            {task.description}
                          </p>
                        )}
                      </div>
                      <button className="text-muted-foreground hover:text-foreground">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <span className={`px-2 py-1 rounded-full ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                      
                      <span className={`px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>

                      {task.assignee && (
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">{task.assignee}</span>
                        </div>
                      )}

                      {task.dueDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className={`${isTaskOverdue(task) ? 'text-red-600' : 'text-muted-foreground'}`}>
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}

                      {(task.estimatedHours || task.actualHours) && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {task.actualHours ? `${task.actualHours}h` : `~${task.estimatedHours}h`}
                          </span>
                        </div>
                      )}
                    </div>

                    {task.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {task.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-1.5 py-0.5 text-xs bg-secondary text-secondary-foreground rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {task.projectName && (
                      <div className="mt-2 pt-2 border-t">
                        <span className="text-xs text-muted-foreground">
                          Project: {task.projectName}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            No tasks found. Create your first task above.
          </div>
        )}
      </CardContent>
    </Card>
  );
}