import { RubricEngine, ConfigManager } from '@company/rubric-sdk';
import { Task, TaskPriority, TaskStatus } from '@/lib/types/notion';

// Enhanced task interface with rubric scores
export interface ScoredTask extends Task {
  rubricScores: {
    urgency: number;
    impact: number;
    effort: number;
    dependencies: number;
    totalScore: number;
  };
  priorityReason: string;
}

// Rubric criteria weights
export interface RubricCriteria {
  urgency: number;    // 0-10: How time-sensitive is this task?
  impact: number;     // 0-10: What's the business/user value?
  effort: number;     // 0-10: How complex/time-consuming? (inverted)
  dependencies: number; // 0-10: Does this block other tasks?
}

// Default rubric configuration
const DEFAULT_RUBRIC_CONFIG = {
  criteria: {
    urgency: { weight: 0.3, description: 'Time sensitivity and deadline pressure' },
    impact: { weight: 0.4, description: 'Business value and user impact' },
    effort: { weight: 0.2, description: 'Development complexity (lower effort = higher score)' },
    dependencies: { weight: 0.1, description: 'Blocking other tasks or critical path' }
  },
  scoreRanges: {
    urgent: { min: 8.0, color: 'red' },
    high: { min: 6.5, color: 'orange' },
    medium: { min: 4.0, color: 'yellow' },
    low: { min: 0, color: 'gray' }
  }
};

class RubricService {
  private engine: any;
  private config: any;

  constructor() {
    this.initializeEngine();
  }

  private initializeEngine() {
    try {
      this.engine = new RubricEngine(DEFAULT_RUBRIC_CONFIG);
      this.config = new ConfigManager();
    } catch (error) {
      console.warn('Rubric SDK not available, using fallback scoring');
      this.engine = null;
      this.config = null;
    }
  }

  // Score a single task using rubric criteria
  async scoreTask(task: Partial<Task>): Promise<ScoredTask['rubricScores']> {
    try {
      if (this.engine) {
        // Use rubric SDK for sophisticated scoring
        const evaluation = await this.engine.evaluate(task, {
          criteria: ['urgency', 'impact', 'effort', 'dependencies']
        });
        
        return {
          urgency: evaluation.scores.urgency || 0,
          impact: evaluation.scores.impact || 0,
          effort: 10 - (evaluation.scores.effort || 5), // Invert effort (less effort = higher score)
          dependencies: evaluation.scores.dependencies || 0,
          totalScore: evaluation.totalScore || 0
        };
      } else {
        // Fallback scoring logic
        return this.fallbackScoring(task);
      }
    } catch (error) {
      console.error('Error scoring task:', error);
      return this.fallbackScoring(task);
    }
  }

  // Fallback scoring when rubric SDK is not available
  private fallbackScoring(task: Partial<Task>): ScoredTask['rubricScores'] {
    let urgency = 5; // Default medium urgency
    let impact = 5; // Default medium impact
    let effort = 5; // Default medium effort
    let dependencies = 3; // Default low dependencies

    // Score urgency based on due date
    if (task.dueDate) {
      const dueDate = new Date(task.dueDate);
      const now = new Date();
      const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilDue <= 0) urgency = 10; // Overdue
      else if (daysUntilDue <= 1) urgency = 9; // Due today/tomorrow
      else if (daysUntilDue <= 3) urgency = 7; // Due this week
      else if (daysUntilDue <= 7) urgency = 5; // Due next week
      else urgency = 3; // Due later
    }

    // Score impact based on priority and tags
    if (task.priority === TaskPriority.URGENT) impact = 9;
    else if (task.priority === TaskPriority.HIGH) impact = 7;
    else if (task.priority === TaskPriority.MEDIUM) impact = 5;
    else if (task.priority === TaskPriority.LOW) impact = 3;

    // Adjust impact based on tags
    if (task.tags) {
      const impactfulTags = ['critical', 'user-facing', 'revenue', 'security', 'performance'];
      const hasImpactfulTag = task.tags.some(tag => 
        impactfulTags.some(impactfulTag => 
          tag.toLowerCase().includes(impactfulTag)
        )
      );
      if (hasImpactfulTag) impact = Math.min(10, impact + 2);
    }

    // Score effort based on estimated hours
    if (task.estimatedHours) {
      if (task.estimatedHours <= 1) effort = 9; // Very low effort
      else if (task.estimatedHours <= 4) effort = 7; // Low effort
      else if (task.estimatedHours <= 8) effort = 5; // Medium effort
      else if (task.estimatedHours <= 16) effort = 3; // High effort
      else effort = 1; // Very high effort
    }

    // Score dependencies based on status and description
    if (task.status === TaskStatus.BLOCKED) dependencies = 2;
    if (task.description) {
      const blockingKeywords = ['blocks', 'required for', 'prerequisite', 'dependency'];
      const hasBlockingKeyword = blockingKeywords.some(keyword =>
        task.description!.toLowerCase().includes(keyword)
      );
      if (hasBlockingKeyword) dependencies = Math.min(10, dependencies + 4);
    }

    const totalScore = (
      urgency * DEFAULT_RUBRIC_CONFIG.criteria.urgency.weight +
      impact * DEFAULT_RUBRIC_CONFIG.criteria.impact.weight +
      effort * DEFAULT_RUBRIC_CONFIG.criteria.effort.weight +
      dependencies * DEFAULT_RUBRIC_CONFIG.criteria.dependencies.weight
    );

    return {
      urgency,
      impact,
      effort,
      dependencies,
      totalScore: Math.round(totalScore * 100) / 100
    };
  }

  // Score multiple tasks and return them sorted by priority
  async scoreTasks(tasks: Partial<Task>[]): Promise<ScoredTask[]> {
    const scoredTasks: ScoredTask[] = [];

    for (const task of tasks) {
      const scores = await this.scoreTask(task);
      const priority = this.determinePriority(scores.totalScore);
      const reason = this.generatePriorityReason(scores);

      scoredTasks.push({
        ...task,
        priority,
        rubricScores: scores,
        priorityReason: reason
      } as ScoredTask);
    }

    // Sort by total score (highest first)
    return scoredTasks.sort((a, b) => b.rubricScores.totalScore - a.rubricScores.totalScore);
  }

  // Determine priority level based on total score
  private determinePriority(totalScore: number): TaskPriority {
    const { scoreRanges } = DEFAULT_RUBRIC_CONFIG;
    
    if (totalScore >= scoreRanges.urgent.min) return TaskPriority.URGENT;
    if (totalScore >= scoreRanges.high.min) return TaskPriority.HIGH;
    if (totalScore >= scoreRanges.medium.min) return TaskPriority.MEDIUM;
    return TaskPriority.LOW;
  }

  // Generate human-readable reason for priority assignment
  private generatePriorityReason(scores: ScoredTask['rubricScores']): string {
    const reasons = [];

    if (scores.urgency >= 8) reasons.push('high urgency');
    if (scores.impact >= 8) reasons.push('high business impact');
    if (scores.effort >= 8) reasons.push('low implementation effort');
    if (scores.dependencies >= 7) reasons.push('blocks other tasks');

    if (reasons.length === 0) {
      if (scores.urgency >= 6) reasons.push('moderate urgency');
      if (scores.impact >= 6) reasons.push('moderate impact');
      if (scores.effort >= 6) reasons.push('manageable effort');
    }

    return reasons.length > 0 
      ? `Priority based on: ${reasons.join(', ')}`
      : `Score: ${scores.totalScore}/10`;
  }

  // Compare multiple tasks using rubric SDK if available
  async compareTasks(tasks: Partial<Task>[]): Promise<ScoredTask[]> {
    try {
      if (this.engine && tasks.length > 1) {
        const comparison = await this.engine.compareMultiple(tasks, {
          criteria: ['urgency', 'impact', 'effort', 'dependencies']
        });
        
        return comparison.map((item: any, index: number) => ({
          ...tasks[index],
          rubricScores: {
            urgency: item.scores.urgency || 0,
            impact: item.scores.impact || 0,
            effort: 10 - (item.scores.effort || 5),
            dependencies: item.scores.dependencies || 0,
            totalScore: item.totalScore || 0
          },
          priority: this.determinePriority(item.totalScore || 0),
          priorityReason: this.generatePriorityReason({
            urgency: item.scores.urgency || 0,
            impact: item.scores.impact || 0,
            effort: 10 - (item.scores.effort || 5),
            dependencies: item.scores.dependencies || 0,
            totalScore: item.totalScore || 0
          })
        })) as ScoredTask[];
      } else {
        return this.scoreTasks(tasks);
      }
    } catch (error) {
      console.error('Error comparing tasks:', error);
      return this.scoreTasks(tasks);
    }
  }

  // Generate detailed scoring report
  async generateScoringReport(tasks: ScoredTask[]): Promise<string> {
    const report = [];
    report.push('# Task Priority Analysis Report\n');
    report.push(`Generated on: ${new Date().toLocaleString()}\n`);
    report.push(`Total tasks analyzed: ${tasks.length}\n`);

    // Summary statistics
    const urgentTasks = tasks.filter(t => t.priority === TaskPriority.URGENT).length;
    const highTasks = tasks.filter(t => t.priority === TaskPriority.HIGH).length;
    const mediumTasks = tasks.filter(t => t.priority === TaskPriority.MEDIUM).length;
    const lowTasks = tasks.filter(t => t.priority === TaskPriority.LOW).length;

    report.push('\n## Priority Distribution');
    report.push(`- Urgent: ${urgentTasks} tasks`);
    report.push(`- High: ${highTasks} tasks`);
    report.push(`- Medium: ${mediumTasks} tasks`);
    report.push(`- Low: ${lowTasks} tasks\n`);

    // Top 10 priority tasks
    report.push('## Top Priority Tasks\n');
    const topTasks = tasks.slice(0, 10);
    
    topTasks.forEach((task, index) => {
      report.push(`### ${index + 1}. ${task.title || 'Untitled Task'}`);
      report.push(`**Priority:** ${task.priority} (Score: ${task.rubricScores.totalScore})`);
      report.push(`**Reason:** ${task.priorityReason}`);
      report.push(`**Scores:** U:${task.rubricScores.urgency} I:${task.rubricScores.impact} E:${task.rubricScores.effort} D:${task.rubricScores.dependencies}`);
      if (task.dueDate) report.push(`**Due Date:** ${task.dueDate}`);
      report.push('');
    });

    return report.join('\n');
  }

  // Migrate current todos with scoring
  async migrateInternalTodos(): Promise<ScoredTask[]> {
    const internalTodos = [
      {
        title: 'Update layout for fixed navigation',
        description: 'Implement responsive navigation with proper mobile support and accessibility',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH,
        tags: ['ui', 'navigation', 'accessibility'],
        estimatedHours: 8,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 3 days from now
      },
      {
        title: 'Set up Notion task management integration',
        description: 'Connect to Notion workspace and create database structure for task management',
        status: TaskStatus.TODO,
        priority: TaskPriority.HIGH,
        tags: ['integration', 'notion', 'task-management'],
        estimatedHours: 12,
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 5 days from now
      },
      {
        title: 'Implement rubric system for task prioritization',
        description: 'Create scoring system for task evaluation based on urgency, impact, effort, and dependencies',
        status: TaskStatus.TODO,
        priority: TaskPriority.HIGH,
        tags: ['rubric', 'prioritization', 'scoring'],
        estimatedHours: 16,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 7 days from now
      },
      {
        title: 'Create sophisticated visual elements',
        description: 'Design and implement modern UI components with animations and micro-interactions',
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        tags: ['ui', 'design', 'animations'],
        estimatedHours: 20,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 14 days from now
      },
      {
        title: 'Implement modern typography and color schemes',
        description: 'Apply consistent typography system and color palette throughout the application',
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        tags: ['design', 'typography', 'colors'],
        estimatedHours: 6,
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 10 days from now
      }
    ];

    return this.scoreTasks(internalTodos);
  }
}

export default new RubricService();