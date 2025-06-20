import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ProjectBasicsForm } from "./ProjectBasicsForm";
import { TeamAssignmentForm } from "./TeamAssignmentForm";
import { TimelineBudgetForm } from "./TimelineBudgetForm";
import { ProjectStructureForm } from "./ProjectStructureForm";
import { X } from "lucide-react";

interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectCreated?: (project: any) => void;
}

export const CreateProjectModal = ({ open, onOpenChange, onProjectCreated }: CreateProjectModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [projectData, setProjectData] = useState({
    basics: {
      name: "",
      description: "",
      type: "",
      priority: "",
      clientName: ""
    },
    team: {
      projectManager: "",
      developers: [],
      designers: [],
      qaTester: []
    },
    timeline: {
      startDate: "",
      endDate: "",
      estimatedHours: "",
      budget: "",
      billingType: "fixed",
      paymentTerms: ""
    },
    structure: {
      template: "",
      blocks: []
    }
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const stepTitles = {
    1: "Project Basics",
    2: "Team Assignment", 
    3: "Timeline & Budget",
    4: "Project Structure"
  };

  const handleNext = (stepData: any) => {
    const stepKey = currentStep === 1 ? 'basics' : 
                   currentStep === 2 ? 'team' :
                   currentStep === 3 ? 'timeline' : 'structure';
    
    setProjectData(prev => ({
      ...prev,
      [stepKey]: stepData
    }));

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleCreateProject();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreateProject = async () => {
    try {
      // TODO: API call to create project
      console.log('Creating project:', projectData);
      
      // Mock success
      const newProject = {
        id: Date.now(),
        name: projectData.basics.name,
        ...projectData
      };
      
      onProjectCreated?.(newProject);
      onOpenChange(false);
      
      // Reset for next time
      setCurrentStep(1);
      setProjectData({
        basics: { name: "", description: "", type: "", priority: "", clientName: "" },
        team: { projectManager: "", developers: [], designers: [], qaTester: [] },
        timeline: { startDate: "", endDate: "", estimatedHours: "", budget: "", billingType: "fixed", paymentTerms: "" },
        structure: { template: "", blocks: [] }
      });
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ProjectBasicsForm 
            initialData={projectData.basics}
            onNext={handleNext}
            onCancel={() => onOpenChange(false)}
          />
        );
      case 2:
        return (
          <TeamAssignmentForm
            initialData={projectData.team}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 3:
        return (
          <TimelineBudgetForm
            initialData={projectData.timeline}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 4:
        return (
          <ProjectStructureForm
            initialData={projectData.structure}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onCreateProject={handleCreateProject}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">
              Create New Project
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="w-6 h-6 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Step {currentStep} of {totalSteps}: {stepTitles[currentStep]}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        </DialogHeader>

        <div className="mt-6">
          {renderCurrentStep()}
        </div>
      </DialogContent>
    </Dialog>
  );
};
