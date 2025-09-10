'use client';

import { useState } from 'react';
import { Settings, Database, Plus, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateNotionDatabase } from '@/lib/hooks/useNotion';
import useNotionStore from '@/lib/stores/notionStore';

export default function NotionSetup() {
  const [parentPageId, setParentPageId] = useState('');
  const [isCreatingProjects, setIsCreatingProjects] = useState(false);
  const [isCreatingTasks, setIsCreatingTasks] = useState(false);
  
  const createDatabase = useCreateNotionDatabase();
  const { config, setConfig } = useNotionStore();

  const handleCreateProjectsDatabase = async () => {
    if (!parentPageId.trim()) {
      alert('Please enter a parent page ID');
      return;
    }

    setIsCreatingProjects(true);
    try {
      const databaseId = await createDatabase.mutateAsync({
        parentPageId: parentPageId.trim(),
        type: 'projects'
      });
      
      setConfig({ projectsDatabaseId: databaseId });
      alert('Projects database created successfully!');
    } catch (error) {
      alert(`Failed to create projects database: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsCreatingProjects(false);
    }
  };

  const handleCreateTasksDatabase = async () => {
    if (!parentPageId.trim()) {
      alert('Please enter a parent page ID');
      return;
    }

    setIsCreatingTasks(true);
    try {
      const databaseId = await createDatabase.mutateAsync({
        parentPageId: parentPageId.trim(),
        type: 'tasks'
      });
      
      setConfig({ tasksDatabaseId: databaseId });
      alert('Tasks database created successfully!');
    } catch (error) {
      alert(`Failed to create tasks database: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsCreatingTasks(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Notion Setup
        </CardTitle>
        <CardDescription>
          Configure your Notion workspace integration for project management.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Instructions */}
        <div className="bg-muted p-4 rounded-lg">
          <h4 className="font-medium mb-2">Setup Instructions:</h4>
          <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
            <li>Create a new page in your Notion workspace</li>
            <li>Copy the page ID from the URL (e.g., the ID after the last "/" in the URL)</li>
            <li>Paste it below and create the databases</li>
            <li>Grant the Tessellate integration access to your page</li>
          </ol>
          <a
            href="https://developers.notion.com/docs/create-a-notion-integration"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-2 text-sm text-sky-600 hover:text-blue-800"
          >
            Learn more about Notion integrations
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        {/* Parent Page ID Input */}
        <div>
          <label htmlFor="parentPageId" className="block text-sm font-medium mb-2">
            Parent Page ID
          </label>
          <input
            id="parentPageId"
            type="text"
            value={parentPageId}
            onChange={(e) => setParentPageId(e.target.value)}
            placeholder="e.g., 12345678-1234-5678-9abc-123456789012"
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          />
          <p className="text-xs text-muted-foreground mt-1">
            The page where your project databases will be created
          </p>
        </div>

        {/* Database Creation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Projects Database */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Database className="h-4 w-4" />
              <h4 className="font-medium">Projects Database</h4>
            </div>
            {config.projectsDatabaseId ? (
              <div className="space-y-2">
                <p className="text-sm text-emerald-600">✓ Database created</p>
                <p className="text-xs text-muted-foreground font-mono break-all">
                  {config.projectsDatabaseId}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Not configured</p>
                <button
                  onClick={handleCreateProjectsDatabase}
                  disabled={!parentPageId.trim() || isCreatingProjects}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors disabled:opacity-50"
                >
                  <Plus className={`h-3 w-3 ${isCreatingProjects ? 'animate-spin' : ''}`} />
                  Create Database
                </button>
              </div>
            )}
          </div>

          {/* Tasks Database */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Database className="h-4 w-4" />
              <h4 className="font-medium">Tasks Database</h4>
            </div>
            {config.tasksDatabaseId ? (
              <div className="space-y-2">
                <p className="text-sm text-emerald-600">✓ Database created</p>
                <p className="text-xs text-muted-foreground font-mono break-all">
                  {config.tasksDatabaseId}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Not configured</p>
                <button
                  onClick={handleCreateTasksDatabase}
                  disabled={!parentPageId.trim() || isCreatingTasks}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors disabled:opacity-50"
                >
                  <Plus className={`h-3 w-3 ${isCreatingTasks ? 'animate-spin' : ''}`} />
                  Create Database
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Manual Configuration */}
        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">Manual Configuration</h4>
          <p className="text-sm text-muted-foreground mb-3">
            If you already have databases, you can enter their IDs manually:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="projectsDbId" className="block text-xs font-medium mb-1">
                Projects Database ID
              </label>
              <input
                id="projectsDbId"
                type="text"
                value={config.projectsDatabaseId || ''}
                onChange={(e) => setConfig({ projectsDatabaseId: e.target.value })}
                placeholder="Database ID"
                className="w-full px-2 py-1 text-xs border border-border rounded bg-background"
              />
            </div>
            
            <div>
              <label htmlFor="tasksDbId" className="block text-xs font-medium mb-1">
                Tasks Database ID
              </label>
              <input
                id="tasksDbId"
                type="text"
                value={config.tasksDatabaseId || ''}
                onChange={(e) => setConfig({ tasksDatabaseId: e.target.value })}
                placeholder="Database ID"
                className="w-full px-2 py-1 text-xs border border-border rounded bg-background"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}