import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface TeamAssignmentFormProps {
  initialData: any;
  onNext: (data: any) => void;
  onPrevious: () => void;
}

export const TeamAssignmentForm = ({ initialData, onNext, onPrevious }: TeamAssignmentFormProps) => {
  const [formData, setFormData] = useState({
    projectManager: initialData.projectManager || "",
    developers: initialData.developers || [],
    designers: initialData.designers || [],
    qaTester: initialData.qaTester || []
  });

  // Mock team members data
  const teamMembers = [
    { id: 1, name: "Alice Johnson", role: "Project Manager", hourlyRate: 85, avatar: "AJ" },
    { id: 2, name: "Bob Smith", role: "Senior Developer", hourlyRate: 75, avatar: "BS" },
    { id: 3, name: "Carol White", role: "Full Stack Developer", hourlyRate: 70, avatar: "CW" },
    { id: 4, name: "David Brown", role: "Frontend Developer", hourlyRate: 65, avatar: "DB" },
    { id: 5, name: "Eve Davis", role: "UI/UX Designer", hourlyRate: 60, avatar: "ED" },
    { id: 6, name: "Frank Miller", role: "Graphic Designer", hourlyRate: 55, avatar: "FM" },
    { id: 7, name: "Grace Lee", role: "QA Tester", hourlyRate: 50, avatar: "GL" },
    { id: 8, name: "Henry Wilson", role: "DevOps Engineer", hourlyRate: 80, avatar: "HW" }
  ];

  const projectManagers = teamMembers.filter(member => member.role.includes("Manager"));
  const developers = teamMembers.filter(member => member.role.includes("Developer"));
  const designers = teamMembers.filter(member => member.role.includes("Designer"));
  const qaTesters = teamMembers.filter(member => member.role.includes("QA"));

  const handleRoleSelection = (role: string, memberId: number, checked: boolean | string) => {
    const isChecked = checked === true;
    setFormData(prev => ({
      ...prev,
      [role]: isChecked 
        ? [...prev[role], memberId]
        : prev[role].filter(id => id !== memberId)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(formData);
  };

  const renderMemberCard = (member, role: string) => (
    <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50">
      <div className="flex items-center gap-3">
        <Checkbox
          checked={formData[role]?.includes(member.id)}
          onCheckedChange={(checked) => handleRoleSelection(role, member.id, checked)}
        />
        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-blue-600 text-white text-xs">
            {member.avatar}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-sm">{member.name}</p>
          <p className="text-xs text-slate-600">{member.role}</p>
        </div>
      </div>
      <Badge variant="outline" className="text-xs">
        ${member.hourlyRate}/hr
      </Badge>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label className="text-sm font-medium mb-3 block">
            Project Manager <span className="text-red-500">*</span>
          </Label>
          <Select value={formData.projectManager} onValueChange={(value) => setFormData(prev => ({ ...prev, projectManager: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select project manager" />
            </SelectTrigger>
            <SelectContent>
              {projectManagers.map((member) => (
                <SelectItem key={member.id} value={member.id.toString()}>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="bg-blue-600 text-white text-xs">
                        {member.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <span>{member.name}</span>
                    <Badge variant="outline" className="ml-auto">
                      ${member.hourlyRate}/hr
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium mb-3 block">
            Developers
          </Label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {developers.map((member) => renderMemberCard(member, 'developers'))}
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium mb-3 block">
            Designers
          </Label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {designers.map((member) => renderMemberCard(member, 'designers'))}
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium mb-3 block">
            QA Testers
          </Label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {qaTesters.map((member) => renderMemberCard(member, 'qaTester'))}
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button type="button" variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          Next: Timeline & Budget
        </Button>
      </div>
    </form>
  );
};
