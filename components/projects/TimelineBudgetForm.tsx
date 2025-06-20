
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "lucide-react";

interface TimelineBudgetData {
  startDate: string;
  endDate: string;
  estimatedHours: string;
  budget: string;
  billingType: string;
  paymentTerms: string;
}

interface TimelineBudgetFormProps {
  initialData: TimelineBudgetData;
  onNext: (data: TimelineBudgetData) => void;
  onPrevious: () => void;
}

export const TimelineBudgetForm = ({ initialData, onNext, onPrevious }: TimelineBudgetFormProps) => {
  const [formData, setFormData] = useState<TimelineBudgetData>({
    startDate: initialData?.startDate || "",
    endDate: initialData?.endDate || "",
    estimatedHours: initialData?.estimatedHours || "",
    budget: initialData?.budget || "",
    billingType: initialData?.billingType || "fixed",
    paymentTerms: initialData?.paymentTerms || ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const billingTypes = [
    { value: "fixed", label: "Fixed Price", description: "One-time payment for the entire project" },
    { value: "hourly", label: "Hourly Rate", description: "Payment based on time tracked" },
    { value: "milestone", label: "Milestone-based", description: "Payment tied to project milestones" },
    { value: "retainer", label: "Retainer", description: "Monthly recurring payment" }
  ];

  const paymentTermsOptions = [
    "Net 15",
    "Net 30", 
    "Net 45",
    "Upon Completion",
    "50% Upfront, 50% on Completion"
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }
    
    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    }
    
    if (formData.startDate && formData.endDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
      newErrors.endDate = "End date must be after start date";
    }
    
    if (!formData.estimatedHours || Number(formData.estimatedHours) <= 0) {
      newErrors.estimatedHours = "Estimated hours must be greater than 0";
    }
    
    if (!formData.budget || Number(formData.budget) <= 0) {
      newErrors.budget = "Budget must be greater than 0";
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

  const handleInputChange = (field: keyof TimelineBudgetData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="startDate" className="text-sm font-medium">
            Start Date <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              className={errors.startDate ? "border-red-500" : ""}
            />
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
          {errors.startDate && (
            <p className="text-sm text-red-500 mt-1">{errors.startDate}</p>
          )}
        </div>

        <div>
          <Label htmlFor="endDate" className="text-sm font-medium">
            Expected End Date <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              className={errors.endDate ? "border-red-500" : ""}
            />
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
          {errors.endDate && (
            <p className="text-sm text-red-500 mt-1">{errors.endDate}</p>
          )}
        </div>

        <div>
          <Label htmlFor="estimatedHours" className="text-sm font-medium">
            Estimated Hours <span className="text-red-500">*</span>
          </Label>
          <Input
            id="estimatedHours"
            type="number"
            value={formData.estimatedHours}
            onChange={(e) => handleInputChange('estimatedHours', e.target.value)}
            placeholder="Enter estimated hours"
            min="1"
            className={errors.estimatedHours ? "border-red-500" : ""}
          />
          {errors.estimatedHours && (
            <p className="text-sm text-red-500 mt-1">{errors.estimatedHours}</p>
          )}
        </div>

        <div>
          <Label htmlFor="budget" className="text-sm font-medium">
            Project Budget <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">$</span>
            <Input
              id="budget"
              type="number"
              value={formData.budget}
              onChange={(e) => handleInputChange('budget', e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              className={`pl-8 ${errors.budget ? "border-red-500" : ""}`}
            />
          </div>
          {errors.budget && (
            <p className="text-sm text-red-500 mt-1">{errors.budget}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <Label className="text-sm font-medium mb-3 block">
            Billing Type
          </Label>
          <RadioGroup 
            value={formData.billingType} 
            onValueChange={(value) => handleInputChange('billingType', value)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {billingTypes.map((type) => (
              <div key={type.value} className="flex items-start space-x-3">
                <RadioGroupItem value={type.value} id={type.value} className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor={type.value} className="font-medium cursor-pointer">
                    {type.label}
                  </Label>
                  <p className="text-sm text-slate-600 mt-1">{type.description}</p>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="paymentTerms" className="text-sm font-medium">
            Payment Terms
          </Label>
          <Select value={formData.paymentTerms} onValueChange={(value) => handleInputChange('paymentTerms', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select payment terms" />
            </SelectTrigger>
            <SelectContent>
              {paymentTermsOptions.map((term) => (
                <SelectItem key={term} value={term}>
                  {term}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button type="button" variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          Next: Project Structure
        </Button>
      </div>
    </form>
  );
};
