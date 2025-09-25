'use client';

// Icons will be imported when needed

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { CRMLayout } from '@/components/layout/crm-layout';
// Define proper types for tasks and projects
interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority?: string;
  due_date?: string;
  estimated_hours?: number;
  actual_hours?: number;
  tags?: string[];
  completed_date?: string;
  project_id?: string;
  assignee_id?: string;
  assignee?: {
    name: string;
  };
  projects?: {
    name: string;
    status: string;
  };
}

interface Project {
  id: string;
  name: string;
  description?: string;
  status: string;
  end_date?: string;
}

interface Team {
  id: string;
  name: string;
}
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export default function TeamTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'board' | 'calendar'>('list');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterAssignee, setFilterAssignee] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const supabase = createClient();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch tasks with related data
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select(`
          *,
          projects (
            name,
            status
          ),
          teams:assignee_id (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (tasksError) throw tasksError;

      // Fetch projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .order('name');

      if (projectsError) throw projectsError;

      // Fetch teams
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (teamsError) throw teamsError;

      setTasks(tasksData || []);
      setProjects(projectsData || []);
      setTeams(teamsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesAssignee = filterAssignee === 'all' || task.assignee_id === filterAssignee;
    
    return matchesSearch && matchesStatus && matchesAssignee;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      'todo': 'bg-gray-100 text-gray-800',
      'doing': 'bg-blue-100 text-blue-800',
      'review': 'bg-yellow-100 text-yellow-800',
      'done': 'bg-green-100 text-green-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'high': 'bg-red-100 text-red-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'low': 'bg-green-100 text-green-800'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTaskStats = () => {
    const stats = tasks.reduce((acc, task) => {
      acc[task.status || 'unknown'] = (acc[task.status || 'unknown'] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      total: tasks.length,
      todo: stats.todo || 0,
      doing: stats.doing || 0,
      review: stats.review || 0,
      done: stats.done || 0
    };
  };

  const stats = getTaskStats();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && !tasks.find(t => t.id === dueDate)?.completed_date;
  };

  return (
    <CRMLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Team Tasks</h1>
            <p className="text-gray-600">Manage team tasks and project assignments</p>
          </div>
          <div className="flex space-x-3">
            <Button>
              Add Task
            </Button>
            <Button variant="outline">
              Create Project
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-600">Total Tasks</p>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.todo}</p>
              <p className="text-sm text-gray-600">To Do</p>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.doing}</p>
              <p className="text-sm text-gray-600">In Progress</p>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{stats.review}</p>
              <p className="text-sm text-gray-600">In Review</p>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{stats.done}</p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
          </Card>
        </div>

        {/* Filters and View Controls */}
        <Card className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="todo">To Do</option>
                <option value="doing">In Progress</option>
                <option value="review">In Review</option>
                <option value="done">Completed</option>
              </select>
              
              <select 
                value={filterAssignee} 
                onChange={(e) => setFilterAssignee(e.target.value)}
                className="w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Assignees</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
              
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  List
                </Button>
                <Button
                  variant={viewMode === 'board' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('board')}
                >
                  Board
                </Button>
                <Button
                  variant={viewMode === 'calendar' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('calendar')}
                >
                  Calendar
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Tasks List */}
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading tasks...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <Card key={task.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{task.title}</h3>
                      <Badge className={getStatusColor(task.status || 'todo')}>
                        {task.status || 'todo'}
                      </Badge>
                      {task.priority && (
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                      )}
                    </div>
                    
                    {task.description && (
                      <p className="text-gray-600 mb-2">{task.description}</p>
                    )}
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      {task.projects?.name && (
                        <span>📁 {task.projects.name}</span>
                      )}
                      {task.due_date && (
                        <span className={isOverdue(task.due_date) ? 'text-red-600' : ''}>
                          📅 Due: {formatDate(task.due_date)}
                        </span>
                      )}
                      {task.estimated_hours && (
                        <span>⏱️ {task.estimated_hours}h estimated</span>
                      )}
                      {task.actual_hours && (
                        <span>⏱️ {task.actual_hours}h actual</span>
                      )}
                    </div>
                    
                    {task.tags && task.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {task.tags.map((tag: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col space-y-2 ml-4">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {filteredTasks.length === 0 && !loading && (
          <Card className="p-8 text-center">
            <p className="text-gray-500">No tasks found</p>
            <Button className="mt-4">
              Create Your First Task
            </Button>
          </Card>
        )}

        {/* Projects Overview */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.slice(0, 6).map((project) => {
              const projectTasks = tasks.filter(task => task.project_id === project.id);
              const completedTasks = projectTasks.filter(task => task.status === 'done').length;
              const progress = projectTasks.length > 0 ? (completedTasks / projectTasks.length) * 100 : 0;
              
              return (
                <Card key={project.id} className="p-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">{project.name}</h4>
                    {project.description && (
                      <p className="text-sm text-gray-600">{project.description}</p>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        {completedTasks}/{projectTasks.length} tasks
                      </span>
                      <span className="text-gray-500">
                        {Math.round(progress)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    {project.end_date && (
                      <p className="text-xs text-gray-500">
                        Due: {formatDate(project.end_date)}
                      </p>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </Card>
      </div>
    </CRMLayout>
  );
}
