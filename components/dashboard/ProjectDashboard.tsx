"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CreateProjectModal } from "@/components/projects/CreateProjectModal";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Calendar,
  Target,
  Plus,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

interface ProjectDashboardProps {
  onNavigate?: (tab: string) => void;
}

export default function ProjectDashboard({ onNavigate }: ProjectDashboardProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const revenueData = [
    { month: "Jan", revenue: 45000, profit: 12000 },
    { month: "Feb", revenue: 52000, profit: 15000 },
    { month: "Mar", revenue: 48000, profit: 11000 },
    { month: "Apr", revenue: 61000, profit: 18000 },
    { month: "May", revenue: 55000, profit: 16000 },
    { month: "Jun", revenue: 67000, profit: 22000 },
  ];

  const projectStatusData = [
    { name: "Completed", value: 8, color: "#10b981" },
    { name: "In Progress", value: 12, color: "#3b82f6" },
    { name: "Planning", value: 5, color: "#f59e0b" },
    { name: "On Hold", value: 2, color: "#ef4444" },
  ];

  const stats = [
    {
      title: "Total Revenue",
      value: "$328,000",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20"
    },
    {
      title: "Active Projects",
      value: "17",
      change: "+2",
      trend: "up",
      icon: Target,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20"
    },
    {
      title: "Team Members",
      value: "24",
      change: "+3",
      trend: "up",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20"
    },
    {
      title: "Avg. Project Time",
      value: "8.2 weeks",
      change: "-1.3 weeks",
      trend: "down",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20"
    },
  ];

  const recentProjects = [
    {
      id: 1,
      name: "E-commerce Platform",
      client: "TechCorp",
      progress: 85,
      status: "in-progress",
      dueDate: "2024-01-15",
      team: 5,
      budget: 75000,
      priority: "high"
    },
    {
      id: 2,
      name: "Mobile Banking App",
      client: "FinanceFlow",
      progress: 95,
      status: "review",
      dueDate: "2024-01-08",
      team: 8,
      budget: 120000,
      priority: "urgent"
    },
    {
      id: 3,
      name: "Analytics Dashboard",
      client: "DataInsights",
      progress: 30,
      status: "planning",
      dueDate: "2024-02-20",
      team: 4,
      budget: 45000,
      priority: "medium"
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case "in-progress":
        return <Clock className="w-4 h-4 text-blue-600" />;
      case "review":
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      default:
        return <Calendar className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "completed": "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      "in-progress": "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      "review": "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
      "planning": "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
      "on-hold": "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
    };
    
    return statusConfig[status] || statusConfig["planning"];
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      "urgent": "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
      "high": "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400", 
      "medium": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      "low": "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
    };
    
    return priorityConfig[priority] || priorityConfig["medium"];
  };

  const handleProjectCreated = (project: any) => {
    console.log('New project created:', project);
    setShowCreateModal(false);
    // TODO: Add to projects list, show success message, redirect to project
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              {selectedProject ? selectedProject.name : "Dashboard Overview"}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              {selectedProject 
                ? `Project insights and analytics` 
                : "Welcome back! Here's what's happening with your projects."
              }
            </p>
          </div>
          <Button 
            onClick={() => onNavigate?.('create-project')}
            className="bg-blue-600 hover:bg-blue-700 shadow-sm"
            size="lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                      {stat.value}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      {stat.trend === "up" ? (
                        <ArrowUpRight className="w-4 h-4 text-green-600" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-600" />
                      )}
                      <p className={`text-sm ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                        {stat.change} from last month
                      </p>
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <Card className="border-0 shadow-sm lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Revenue & Profit Trends
              </CardTitle>
              <CardDescription>
                Monthly revenue and profit over the last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="month" 
                    className="text-sm"
                  />
                  <YAxis 
                    className="text-sm"
                    tickFormatter={(value) => `$${value / 1000}k`}
                  />
                  <Tooltip 
                    formatter={(value: number, name: string) => [
                      `$${value.toLocaleString()}`, 
                      name === 'revenue' ? 'Revenue' : 'Profit'
                    ]}
                    labelStyle={{ color: '#374151' }}
                    contentStyle={{ 
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="profit" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Project Status Chart */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Project Status</CardTitle>
              <CardDescription>
                Current distribution of all projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={projectStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {projectStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Legend */}
              <div className="mt-4 space-y-2">
                {projectStatusData.map((entry, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-slate-600 dark:text-slate-400">
                        {entry.name}
                      </span>
                    </div>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {entry.value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Projects */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Projects</CardTitle>
                <CardDescription>
                  Latest project updates and progress
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                View All Projects
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <div 
                  key={project.id} 
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(project.status)}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-slate-900 dark:text-white">
                            {project.name}
                          </h4>
                          <Badge 
                            variant="secondary" 
                            className={getPriorityBadge(project.priority)}
                          >
                            {project.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Client: {project.client} • Team: {project.team} members • Budget: ${project.budget.toLocaleString()}
                        </p>
                        <Badge 
                          variant="secondary" 
                          className={`mt-1 ${getStatusBadge(project.status)}`}
                        >
                          {project.status.replace('-', ' ')}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-4 sm:mt-0">
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {project.progress}% Complete
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Due: {new Date(project.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Progress value={project.progress} className="w-24" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Create Project Modal */}
        <CreateProjectModal
          open={showCreateModal}
          onOpenChange={setShowCreateModal}
          onProjectCreated={handleProjectCreated}
        />
      </div>
    </div>
  );
}