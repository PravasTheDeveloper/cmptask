"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProjectDashboard from '@/components/dashboard/ProjectDashboard';
import { Sidebar } from '@/components/global/SideBar';

export default function Home() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedProject, setSelectedProject] = useState(null);

  const handleNavigation = (tab: string) => {
    if (tab === 'create-project') {
      router.push('/create-project');
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Fixed Sidebar - Hidden on mobile, visible on desktop */}
      <div className="fixed left-0 top-0 z-40 hidden lg:block">
        <Sidebar 
          activeTab={activeTab}
          onTabChange={handleNavigation}
          selectedProject={selectedProject}
          onSelectProject={setSelectedProject}
        />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 w-full">
        {/* Mobile Header - Show on mobile only */}
        <div className="lg:hidden bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4">
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

        {/* Content */}
        <div className="w-full">
          {activeTab === "dashboard" && <ProjectDashboard onNavigate={handleNavigation} />}
          {activeTab === "projects" && (
            <div className="p-6">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Projects</h1>
              <p className="text-slate-600 dark:text-slate-400">Projects content will go here</p>
            </div>
          )}
          {activeTab === "tasks" && (
            <div className="p-6">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Tasks</h1>
              <p className="text-slate-600 dark:text-slate-400">Tasks content will go here</p>
            </div>
          )}
          {activeTab === "financial" && (
            <div className="p-6">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Financial</h1>
              <p className="text-slate-600 dark:text-slate-400">Financial content will go here</p>
            </div>
          )}
          {activeTab === "team" && (
            <div className="p-6">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Team</h1>
              <p className="text-slate-600 dark:text-slate-400">Team content will go here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
