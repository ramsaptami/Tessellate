'use client';

import { useState } from 'react';
import { Plus, MoreHorizontal, ExternalLink, Calendar, Users, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNotionProjects, useCreateNotionProject, useUpdateNotionProject } from '@/lib/hooks/useNotion';
import useNotionStore from '@/lib/stores/notionStore';
import { Project, ProjectStatus, TaskPriority } from '@/lib/types/notion';

export default function NotionProjectsList() {
  const { config } = useNotionStore();
  const { data: projects, isLoading, error } = useNotionProjects(config.projectsDatabaseId);
  const createProject = useCreateNotionProject(config.projectsDatabaseId);
  const updateProject = useUpdateNotionProject();
  
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;

    setIsCreating(true);
    try {
      await createProject.mutateAsync({
        name: newProjectName.trim(),
        status: ProjectStatus.NOT_STARTED,
        priority: TaskPriority.MEDIUM,
        description: '',
        progress: 0,
        teamMembers: [],
        tags: [],
      });
      setNewProjectName('');
    } catch (error) {
      console.error('Failed to create project:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateProject = async (projectId: string, updates: Partial<Project>) => {
    try {
      await updateProject.mutateAsync({ id: projectId, updates });
    } catch (error) {
      console.error('Failed to update project:', error);
    }
  };

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.NOT_STARTED:
        return 'bg-gray-100 text-gray-800';
      case ProjectStatus.IN_PROGRESS:
        return 'bg-blue-100 text-blue-800';
      case ProjectStatus.ON_HOLD:
        return 'bg-yellow-100 text-yellow-800';
      case ProjectStatus.COMPLETED:
        return 'bg-green-100 text-green-800';
      case ProjectStatus.CANCELLED:
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
        return 'bg-blue-100 text-sky-600';
      case TaskPriority.HIGH:
        return 'bg-orange-100 text-orange-600';
      case TaskPriority.URGENT:
        return 'bg-red-100 text-rose-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  if (!config.projectsDatabaseId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Please configure your Notion projects database to view projects.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-rose-600">
            Error loading projects: {error.message}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Projects</CardTitle>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Project name..."
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCreateProject();
              }
            }}
            className="px-2 py-1 text-sm border border-border rounded bg-background"
          />
          <button
            onClick={handleCreateProject}
            disabled={!newProjectName.trim() || isCreating}
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
            Loading projects...
          </div>
        ) : projects && projects.length > 0 ? (
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{project.name}</h4>
                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sky-600 hover:text-blue-800"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                    {project.description && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {project.description}
                      </p>
                    )}
                  </div>
                  <button className="text-muted-foreground hover:text-foreground">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <span className={`px-2 py-1 rounded-full ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                  
                  <span className={`px-2 py-1 rounded-full ${getPriorityColor(project.priority)}`}>
                    {project.priority}
                  </span>

                  {project.progress !== undefined && (
                    <div className="flex items-center gap-1">
                      <Target className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {Math.round(project.progress * 100)}%
                      </span>
                    </div>
                  )}

                  {project.teamMembers.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {project.teamMembers.length} members
                      </span>
                    </div>
                  )}

                  {(project.startDate || project.endDate) && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {project.startDate && new Date(project.startDate).toLocaleDateString()}
                        {project.startDate && project.endDate && ' - '}
                        {project.endDate && new Date(project.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                {project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {project.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-1.5 py-0.5 text-xs bg-secondary text-secondary-foreground rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Progress Bar */}
                {project.progress !== undefined && project.progress > 0 && (
                  <div className="mt-2">
                    <div className="w-full bg-secondary rounded-full h-1.5">
                      <div
                        className="bg-primary h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            No projects found. Create your first project above.
          </div>
        )}
      </CardContent>
    </Card>
  );
}