
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  Filter, 
  Plus, 
  Calendar, 
  DollarSign, 
  Users,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProjectListProps {
  onSelectProject: (project: any) => void;
}

export const ProjectList = ({ onSelectProject }: ProjectListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const projects = [
    {
      id: 1,
      name: "E-commerce Platform",
      description: "Full-stack e-commerce solution with payment integration",
      client: "TechCorp",
      status: "in-progress",
      progress: 85,
      budget: 120000,
      spent: 78000,
      startDate: "2023-10-15",
      endDate: "2024-01-15",
      team: [
        { name: "Alice Johnson", role: "Lead Developer", avatar: "AJ" },
        { name: "Bob Smith", role: "UI/UX Designer", avatar: "BS" },
        { name: "Carol White", role: "Backend Developer", avatar: "CW" },
      ],
      tags: ["React", "Node.js", "PostgreSQL", "Stripe"]
    },
    {
      id: 2,
      name: "Mobile Banking App",
      description: "Secure mobile banking application with biometric authentication",
      client: "FinanceFlow",
      status: "review",
      progress: 95,
      budget: 180000,
      spent: 165000,
      startDate: "2023-08-01",
      endDate: "2024-01-08",
      team: [
        { name: "David Brown", role: "Mobile Developer", avatar: "DB" },
        { name: "Eve Davis", role: "Security Expert", avatar: "ED" },
        { name: "Frank Wilson", role: "QA Engineer", avatar: "FW" },
      ],
      tags: ["React Native", "Biometrics", "Security", "Banking"]
    },
    {
      id: 3,
      name: "Analytics Dashboard",
      description: "Real-time analytics and reporting dashboard for business intelligence",
      client: "DataInsights",
      status: "planning",
      progress: 30,
      budget: 95000,
      spent: 15000,
      startDate: "2023-12-01",
      endDate: "2024-02-20",
      team: [
        { name: "Grace Lee", role: "Data Engineer", avatar: "GL" },
        { name: "Henry Chen", role: "Frontend Developer", avatar: "HC" },
      ],
      tags: ["Charts", "Real-time", "Analytics", "Dashboard"]
    },
    {
      id: 4,
      name: "CRM System",
      description: "Customer relationship management system with automation features",
      client: "SalesForce Pro",
      status: "completed",
      progress: 100,
      budget: 150000,
      spent: 142000,
      startDate: "2023-06-01",
      endDate: "2023-11-15",
      team: [
        { name: "Ivy Taylor", role: "Full-stack Developer", avatar: "IT" },
        { name: "Jack Miller", role: "Product Manager", avatar: "JM" },
      ],
      tags: ["CRM", "Automation", "Sales", "Integration"]
    },
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      "planning": "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
      "in-progress": "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      "review": "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
      "completed": "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      "on-hold": "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
    };
    return colors[status as keyof typeof colors] || colors.planning;
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || project.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Projects</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage and track all your software development projects
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search projects or clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-md text-sm"
          >
            <option value="all">All Status</option>
            <option value="planning">Planning</option>
            <option value="in-progress">In Progress</option>
            <option value="review">Review</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Project Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onSelectProject(project)}>
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{project.name}</CardTitle>
                  <CardDescription className="text-sm mb-3">
                    {project.description}
                  </CardDescription>
                  <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                    <span>Client: {project.client}</span>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status.replace("-", " ")}
                    </Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Project
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Project
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Progress</span>
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>

              {/* Budget & Timeline */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="font-medium">${project.spent.toLocaleString()}</p>
                    <p className="text-slate-500">of ${project.budget.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="font-medium">Due: {project.endDate}</p>
                    <p className="text-slate-500">Started: {project.startDate}</p>
                  </div>
                </div>
              </div>

              {/* Team */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium">Team ({project.team.length})</span>
                </div>
                <div className="flex -space-x-2">
                  {project.team.slice(0, 3).map((member, index) => (
                    <Avatar key={index} className="w-8 h-8 border-2 border-white">
                      <AvatarFallback className="text-xs bg-blue-600 text-white">
                        {member.avatar}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {project.team.length > 3 && (
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white flex items-center justify-center">
                      <span className="text-xs font-medium">+{project.team.length - 3}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {project.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {project.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{project.tags.length - 3} more
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
