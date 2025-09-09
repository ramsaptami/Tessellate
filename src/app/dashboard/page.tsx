'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, BarChart3, Target, List, TrendingUp, Github, Users, Clock } from 'lucide-react';
import AccessControl from '@/components/shared/AccessControl';

interface TaskMetrics {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
}

interface ProjectStats {
  activeProjects: number;
  teamMembers: number;
  weeklyCommits: number;
  codeQuality: number;
}

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [taskMetrics, setTaskMetrics] = useState<TaskMetrics>({
    total: 24,
    completed: 18,
    inProgress: 4,
    pending: 2
  });
  
  const [projectStats, setProjectStats] = useState<ProjectStats>({
    activeProjects: 3,
    teamMembers: 8,
    weeklyCommits: 47,
    codeQuality: 94
  });

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const refreshData = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-muted-foreground">Loading project dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <AccessControl>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Project Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                  Comprehensive project management and analytics overview
                </p>
              </div>
              <button
                onClick={refreshData}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh Data
              </button>
            </div>
          </div>
        </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projectStats.activeProjects}</div>
              <p className="text-xs text-muted-foreground">All systems running</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projectStats.teamMembers}</div>
              <p className="text-xs text-muted-foreground">Contributors active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Weekly Commits</CardTitle>
              <Github className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projectStats.weeklyCommits}</div>
              <p className="text-xs text-muted-foreground">+12% from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Code Quality</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projectStats.codeQuality}%</div>
              <p className="text-xs text-muted-foreground">Excellent rating</p>
            </CardContent>
          </Card>
        </div>

        {/* Task Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <List className="h-5 w-5" />
                Task Overview
              </CardTitle>
              <CardDescription>Current status of all project tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Completed</span>
                  <span className="text-sm font-bold text-green-600">{taskMetrics.completed}</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${(taskMetrics.completed / taskMetrics.total) * 100}%` }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">In Progress</span>
                  <span className="text-sm font-bold text-blue-600">{taskMetrics.inProgress}</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(taskMetrics.inProgress / taskMetrics.total) * 100}%` }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Pending</span>
                  <span className="text-sm font-bold text-amber-600">{taskMetrics.pending}</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-amber-600 h-2 rounded-full" 
                    style={{ width: `${(taskMetrics.pending / taskMetrics.total) * 100}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Project Health
              </CardTitle>
              <CardDescription>Overall project metrics and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground font-medium">Completion Rate</p>
                    <p className="text-2xl font-bold text-green-600">
                      {Math.round((taskMetrics.completed / taskMetrics.total) * 100)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground font-medium">Velocity</p>
                    <p className="text-2xl font-bold text-blue-600">8.2</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground font-medium">Bug Rate</p>
                    <p className="text-2xl font-bold text-amber-600">0.3%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground font-medium">Uptime</p>
                    <p className="text-2xl font-bold text-green-600">99.9%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activities
            </CardTitle>
            <CardDescription>Latest project updates and activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Authentication system deployed successfully</p>
                  <p className="text-xs text-muted-foreground">2 hours ago • Production</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Code review completed for dashboard updates</p>
                  <p className="text-xs text-muted-foreground">4 hours ago • Development</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Database migration scheduled for tonight</p>
                  <p className="text-xs text-muted-foreground">6 hours ago • Operations</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
    </AccessControl>
  );
}