'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle } from 'lucide-react';
import NotionConnectionStatus from './NotionConnectionStatus';
import NotionSetup from './NotionSetup';
import NotionProjectsList from './NotionProjectsList';
import NotionTasksList from './NotionTasksList';
import { useNotionConnection, useNotionDashboard } from '@/lib/hooks/useNotion';
import useNotionStore from '@/lib/stores/notionStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function NotionDashboard() {
  const { config, connectionStatus } = useNotionStore();
  const { data: connection } = useNotionConnection();
  const { 
    data: metrics, 
    isLoading: metricsLoading, 
    error: metricsError 
  } = useNotionDashboard(config.projectsDatabaseId, config.tasksDatabaseId);

  const [activeTab, setActiveTab] = useState('overview');

  // Check if Notion is properly configured
  const isConfigured = config.projectsDatabaseId && config.tasksDatabaseId;
  const isConnected = connection?.isConnected && connectionStatus.isConnected;

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <NotionConnectionStatus />

      {/* Main Content */}
      {!isConnected ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              Notion Integration Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                To use Notion integration features, you need to:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>Set up your NOTION_API_KEY environment variable</li>
                <li>Create a Notion integration in your workspace</li>
                <li>Configure your project and task databases</li>
              </ol>
              {!process.env.NOTION_API_KEY && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-amber-800 text-sm">
                    <strong>Environment Variable Missing:</strong> Make sure to set NOTION_API_KEY in your environment variables.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : !isConfigured ? (
        <NotionSetup />
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="setup">Setup</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {metricsLoading ? (
              <Card>
                <CardContent className="py-8">
                  <div className="text-center text-muted-foreground">
                    Loading dashboard metrics...
                  </div>
                </CardContent>
              </Card>
            ) : metricsError ? (
              <Card>
                <CardContent className="py-8">
                  <div className="text-center text-red-600">
                    Error loading metrics: {metricsError.message}
                  </div>
                </CardContent>
              </Card>
            ) : metrics ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Projects Overview */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.totalProjects}</div>
                    <p className="text-xs text-muted-foreground">
                      {metrics.activeProjects} active
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {metrics.totalProjects > 0 
                        ? Math.round((metrics.completedProjects / metrics.totalProjects) * 100)
                        : 0
                      }%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {metrics.completedProjects} completed
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.totalTasks}</div>
                    <p className="text-xs text-muted-foreground">
                      {metrics.inProgressTasks} in progress
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.teamMembers}</div>
                    <p className="text-xs text-muted-foreground">
                      Active contributors
                    </p>
                  </CardContent>
                </Card>

                {/* Task Status Overview */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Task Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Completed</span>
                        <span className="text-sm font-medium text-green-600">
                          {metrics.completedTasks}
                        </span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                          style={{ 
                            width: `${metrics.totalTasks > 0 ? (metrics.completedTasks / metrics.totalTasks) * 100 : 0}%` 
                          }}
                        />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">In Progress</span>
                        <span className="text-sm font-medium text-blue-600">
                          {metrics.inProgressTasks}
                        </span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                          style={{ 
                            width: `${metrics.totalTasks > 0 ? (metrics.inProgressTasks / metrics.totalTasks) * 100 : 0}%` 
                          }}
                        />
                      </div>

                      {metrics.overdueTasks > 0 && (
                        <>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Overdue</span>
                            <span className="text-sm font-medium text-red-600">
                              {metrics.overdueTasks}
                            </span>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-2">
                            <div 
                              className="bg-red-600 h-2 rounded-full transition-all duration-300" 
                              style={{ 
                                width: `${metrics.totalTasks > 0 ? (metrics.overdueTasks / metrics.totalTasks) * 100 : 0}%` 
                              }}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Active Projects</p>
                        <p className="text-lg font-semibold text-blue-600">
                          {metrics.activeProjects}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Completed</p>
                        <p className="text-lg font-semibold text-green-600">
                          {metrics.completedProjects}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Task Progress</p>
                        <p className="text-lg font-semibold">
                          {metrics.totalTasks > 0 
                            ? Math.round((metrics.completedTasks / metrics.totalTasks) * 100)
                            : 0
                          }%
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Contributors</p>
                        <p className="text-lg font-semibold">
                          {metrics.teamMembers}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="py-8">
                  <div className="text-center text-muted-foreground">
                    No metrics available. Make sure your databases are properly configured and have data.
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="projects">
            <NotionProjectsList />
          </TabsContent>

          <TabsContent value="tasks">
            <NotionTasksList />
          </TabsContent>

          <TabsContent value="setup">
            <NotionSetup />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}