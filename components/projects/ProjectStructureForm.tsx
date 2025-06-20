
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NotionStyleEditor } from "./NotionStyleEditor";
import { Badge } from "@/components/ui/badge";
import { 
  Layout, 
  Smartphone, 
  Palette, 
  FileText,
  CheckCircle 
} from "lucide-react";

interface ProjectStructureFormProps {
  initialData: any;
  onNext: (data: any) => void;
  onPrevious: () => void;
  onCreateProject: () => void;
}

export const ProjectStructureForm = ({ initialData, onNext, onPrevious, onCreateProject }: ProjectStructureFormProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState(initialData.template || "");
  const [customBlocks, setCustomBlocks] = useState(initialData.blocks || []);
  const [isCreating, setIsCreating] = useState(false);

  const templates = [
    {
      id: "blank",
      name: "Blank Project",
      description: "Start with an empty project structure",
      icon: FileText,
      blocks: []
    },
    {
      id: "web-dev",
      name: "Web Development Template", 
      description: "Standard web development project with phases",
      icon: Layout,
      blocks: [
        { type: "heading", content: { text: "Project Overview", level: 1 } },
        { type: "paragraph", content: { text: "This project involves developing a modern web application." } },
        { type: "heading", content: { text: "Development Phases", level: 2 } },
        { type: "todoList", content: { items: ["Planning & Research", "Design & Wireframes", "Frontend Development", "Backend Development", "Testing & QA", "Deployment"] } }
      ]
    },
    {
      id: "mobile-app",
      name: "Mobile App Template",
      description: "Mobile application development structure", 
      icon: Smartphone,
      blocks: [
        { type: "heading", content: { text: "Mobile App Development", level: 1 } },
        { type: "heading", content: { text: "Target Platforms", level: 2 } },
        { type: "bulletList", content: { items: ["iOS (iPhone/iPad)", "Android", "Cross-platform"] } }
      ]
    },
    {
      id: "design",
      name: "Design Project Template",
      description: "UI/UX and design project structure",
      icon: Palette,
      blocks: [
        { type: "heading", content: { text: "Design Project", level: 1 } },
        { type: "heading", content: { text: "Design Deliverables", level: 2 } },
        { type: "todoList", content: { items: ["User Research", "Wireframes", "Visual Design", "Prototypes", "Style Guide"] } }
      ]
    }
  ];

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template.id);
    setCustomBlocks(template.blocks || []);
  };

  const handleBlocksChange = (blocks) => {
    setCustomBlocks(blocks);
  };

  const handleCreateProject = async () => {
    setIsCreating(true);
    try {
      const structureData = {
        template: selectedTemplate,
        blocks: customBlocks
      };
      onNext(structureData);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-lg font-semibold mb-4 block">
          Choose Project Template
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((template) => (
            <Card 
              key={template.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedTemplate === template.id 
                  ? "ring-2 ring-blue-500 border-blue-500" 
                  : "border-slate-200"
              }`}
              onClick={() => handleTemplateSelect(template)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <template.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base">{template.name}</CardTitle>
                    <p className="text-sm text-slate-600 mt-1">{template.description}</p>
                  </div>
                  {selectedTemplate === template.id && (
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  )}
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      <div className="border-t pt-6">
        <Label className="text-lg font-semibold mb-4 block">
          Customize Project Structure
        </Label>
        <p className="text-sm text-slate-600 mb-4">
          Add custom content blocks to your project. Type "/" to add new blocks like headings, lists, custom fields, and more.
        </p>
        
        <Card>
          <CardContent className="p-6">
            <NotionStyleEditor 
              initialBlocks={customBlocks}
              onChange={handleBlocksChange}
            />
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between pt-6 border-t">
        <Button type="button" variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button 
          onClick={handleCreateProject}
          disabled={isCreating}
          className="bg-green-600 hover:bg-green-700"
        >
          {isCreating ? "Creating Project..." : "Create Project"}
        </Button>
      </div>
    </div>
  );
};
