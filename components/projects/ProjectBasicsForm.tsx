
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface ProjectBasicsData {
  name: string;
  description: string;
  type: string;
  priority: string;
  clientName: string;
}

interface ProjectBasicsFormProps {
  initialData: ProjectBasicsData;
  onNext: (data: ProjectBasicsData) => void;
  onCancel: () => void;
}

export const ProjectBasicsForm = ({ initialData, onNext, onCancel }: ProjectBasicsFormProps) => {
  const [formData, setFormData] = useState<ProjectBasicsData>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    type: initialData?.type || "",
    priority: initialData?.priority || "",
    clientName: initialData?.clientName || ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const projectTypes = [
    "Web Development",
    "Mobile App", 
    "UI/UX Design",
    "E-commerce",
    "Custom Software",
    "Maintenance"
  ];

  const priorities = [
    { value: "low", label: "Low", color: "bg-green-100 text-green-800" },
    { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
    { value: "high", label: "High", color: "bg-orange-100 text-orange-800" },
    { value: "urgent", label: "Urgent", color: "bg-red-100 text-red-800" }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Project name is required";
    }
    
    if (!formData.type) {
      newErrors.type = "Project type is required";
    }
    
    if (!formData.priority) {
      newErrors.priority = "Priority level is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onNext(formData);
    }
  };

  const handleInputChange = (field: keyof ProjectBasicsData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Project Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter project name"
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <Label htmlFor="type" className="text-sm font-medium">
            Project Type <span className="text-red-500">*</span>
          </Label>
          <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
            <SelectTrigger className={errors.type ? "border-red-500" : ""}>
              <SelectValue placeholder="Select project type" />
            </SelectTrigger>
            <SelectContent>
              {projectTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.type && (
            <p className="text-sm text-red-500 mt-1">{errors.type}</p>
          )}
        </div>

        <div>
          <Label htmlFor="priority" className="text-sm font-medium">
            Priority Level <span className="text-red-500">*</span>
          </Label>
          <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
            <SelectTrigger className={errors.priority ? "border-red-500" : ""}>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              {priorities.map((priority) => (
                <SelectItem key={priority.value} value={priority.value}>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={priority.color}>
                      {priority.label}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.priority && (
            <p className="text-sm text-red-500 mt-1">{errors.priority}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="clientName" className="text-sm font-medium">
            Client/Company Name
          </Label>
          <Input
            id="clientName"
            value={formData.clientName}
            onChange={(e) => handleInputChange('clientName', e.target.value)}
            placeholder="Enter client or company name"
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="description" className="text-sm font-medium">
            Project Description
          </Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe the project goals, requirements, and scope..."
            rows={4}
          />
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          Next: Team Assignment
        </Button>
      </div>
    </form>
  );
};
