import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CreateProjectModal } from "@/components/projects/CreateProjectModal";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { 
  LayoutDashboard, 
  FolderOpen, 
  CheckSquare, 
  DollarSign, 
  Users, 
  Plus,
  ChevronRight,
  ChevronDown,
  FileText
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  selectedProject: any;
  onSelectProject: (project: any) => void;
}

export const Sidebar = ({ activeTab, onTabChange, selectedProject, onSelectProject }: SidebarProps) => {
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "create-project", label: "Create Project", icon: FileText },
    { id: "projects", label: "Projects", icon: FolderOpen },
    { id: "tasks", label: "Tasks", icon: CheckSquare },
    { id: "financial", label: "Financial", icon: DollarSign },
    { id: "team", label: "Team", icon: Users },
  ];

  const projects = [
    { id: 1, name: "E-commerce Platform", status: "in-progress", color: "bg-blue-500" },
    { id: 2, name: "Mobile Banking App", status: "review", color: "bg-purple-500" },
    { id: 3, name: "Analytics Dashboard", status: "planning", color: "bg-orange-500" },
    { id: 4, name: "CRM System", status: "completed", color: "bg-green-500" },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "planning": { label: "Planning", variant: "secondary" as const },
      "in-progress": { label: "In Progress", variant: "default" as const },
      "review": { label: "Review", variant: "destructive" as const },
      "completed": { label: "Completed", variant: "outline" as const },
    };
    
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.planning;
  };

  const handleProjectCreated = (project: any) => {
    console.log('New project created from sidebar:', project);
    // TODO: Add to projects list and select it
    onSelectProject(project);
    onTabChange('projects');
  };

  return (
    <div className="w-64 h-screen bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">PM</span>
          </div>
          <div>
            <h1 className="font-semibold text-slate-900 dark:text-white">ProjectHub</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Software Company</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => (
          <Button
            key={item.id}
            variant={activeTab === item.id ? "default" : "ghost"}
            className={`w-full justify-start gap-3 ${
              activeTab === item.id 
                ? "bg-blue-600 text-white hover:bg-blue-700" 
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
            }`}
            onClick={() => onTabChange(item.id)}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </Button>
        ))}

        {/* Projects Section */}
        <div className="pt-6">
          <Button
            variant="ghost"
            className="w-full justify-between text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 mb-2"
            onClick={() => setIsProjectsExpanded(!isProjectsExpanded)}
          >
            <span className="text-sm font-medium">Projects</span>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="w-6 h-6 p-0 hover:bg-slate-200 dark:hover:bg-slate-600"
                onClick={(e) => {
                  e.stopPropagation();
                  onTabChange('create-project');
                }}
              >
                <Plus className="w-3 h-3" />
              </Button>
              {isProjectsExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </div>
          </Button>

          {isProjectsExpanded && (
            <div className="space-y-1 pl-2">
              {projects.map((project) => {
                const statusConfig = getStatusBadge(project.status);
                return (
                  <div
                    key={project.id}
                    className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors ${
                      selectedProject?.id === project.id
                        ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                        : "hover:bg-slate-50 dark:hover:bg-slate-700"
                    }`}
                    onClick={() => onSelectProject(project)}
                  >
                    <div className={`w-3 h-3 rounded-full ${project.color}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {project.name}
                      </p>
                      <Badge 
                        variant={statusConfig.variant}
                        className="text-xs mt-1"
                      >
                        {statusConfig.label}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-blue-600 text-white">JD</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                John Doe
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Project Manager
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>

      <CreateProjectModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onProjectCreated={handleProjectCreated}
      />
    </div>
  );
};
