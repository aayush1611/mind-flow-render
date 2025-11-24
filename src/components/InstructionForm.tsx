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
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { GripVertical, Plus, Trash2, ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface WorkflowStep {
  id: string;
  content: string;
}

interface InstructionFormData {
  heading: string;
  status: "active" | "inactive";
  priority: "high" | "medium" | "low";
  workflowSteps: WorkflowStep[];
}

interface InstructionFormProps {
  initialData?: InstructionFormData;
  onSave: (data: InstructionFormData) => void;
  onCancel: () => void;
}

export const InstructionForm = ({
  initialData,
  onSave,
  onCancel,
}: InstructionFormProps) => {
  const isEditMode = !!initialData;
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<InstructionFormData>(
    initialData || {
      heading: "",
      status: "active",
      priority: "medium",
      workflowSteps: [{ id: crypto.randomUUID(), content: "" }],
    }
  );

  const addWorkflowStep = () => {
    setFormData({
      ...formData,
      workflowSteps: [
        ...formData.workflowSteps,
        { id: crypto.randomUUID(), content: "" },
      ],
    });
  };

  const removeWorkflowStep = (id: string) => {
    if (formData.workflowSteps.length > 1) {
      setFormData({
        ...formData,
        workflowSteps: formData.workflowSteps.filter((step) => step.id !== id),
      });
    }
  };

  const updateWorkflowStep = (id: string, content: string) => {
    setFormData({
      ...formData,
      workflowSteps: formData.workflowSteps.map((step) =>
        step.id === id ? { ...step, content } : step
      ),
    });
  };

  const handleNext = () => {
    if (step === 1 && !formData.heading.trim()) {
      toast({
        title: "Heading required",
        description: "Please enter a heading for the instruction",
        variant: "destructive",
      });
      return;
    }
    setStep(step + 1);
  };

  const handleSave = () => {
    if (!formData.heading.trim()) {
      toast({
        title: "Heading required",
        description: "Please enter a heading for the instruction",
        variant: "destructive",
      });
      return;
    }
    if (formData.workflowSteps.some((s) => !s.content.trim())) {
      toast({
        title: "Empty workflow steps",
        description: "Please fill in all workflow steps or remove empty ones",
        variant: "destructive",
      });
      return;
    }
    onSave(formData);
    toast({
      title: "Success",
      description: initialData
        ? "Instruction updated successfully"
        : "Instruction created successfully",
    });
  };

  // Edit mode - show all fields at once
  if (isEditMode) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">Edit Instruction</h2>
            <p className="text-sm text-muted-foreground">
              Update instruction details and workflow steps
            </p>
          </div>
        </div>

        <Card className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="heading">Instruction Heading *</Label>
            <Input
              id="heading"
              placeholder="Enter instruction heading"
              value={formData.heading}
              onChange={(e) =>
                setFormData({ ...formData, heading: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "active" | "inactive") =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: "high" | "medium" | "low") =>
                  setFormData({ ...formData, priority: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Workflow Steps</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addWorkflowStep}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Step
            </Button>
          </div>

          <div className="space-y-3">
            {formData.workflowSteps.map((workflowStep, index) => (
              <Card key={workflowStep.id} className="p-4">
                <div className="flex gap-3 items-start">
                  <GripVertical className="h-5 w-5 text-muted-foreground mt-2 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Label className="text-sm text-muted-foreground">
                      Step {index + 1}
                    </Label>
                    <Textarea
                      placeholder="Describe this workflow step..."
                      value={workflowStep.content}
                      onChange={(e) =>
                        updateWorkflowStep(workflowStep.id, e.target.value)
                      }
                      rows={3}
                    />
                  </div>
                  {formData.workflowSteps.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeWorkflowStep(workflowStep.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Update Instruction</Button>
        </div>
      </div>
    );
  }

  // Add mode - multi-stepper form

  return (
    <div className="h-full flex flex-col">
      {/* Fixed Header */}
      <div className="shrink-0 space-y-4 pb-4 border-b">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">
              {initialData ? "Edit Instruction" : "Add New Instruction"}
            </h2>
            <p className="text-sm text-muted-foreground">
              Step {step} of 2 - {step === 1 ? "Basic Information" : "Workflow Steps"}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <div
            className={`h-2 flex-1 rounded-full ${
              step >= 1 ? "bg-primary" : "bg-muted"
            }`}
          />
          <div
            className={`h-2 flex-1 rounded-full ${
              step >= 2 ? "bg-primary" : "bg-muted"
            }`}
          />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto py-6">
        {step === 1 && (
          <Card className="p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="heading">Instruction Heading *</Label>
              <Input
                id="heading"
                placeholder="Enter instruction heading"
                value={formData.heading}
                onChange={(e) =>
                  setFormData({ ...formData, heading: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "active" | "inactive") =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: "high" | "medium" | "low") =>
                    setFormData({ ...formData, priority: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Workflow Steps</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addWorkflowStep}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Step
              </Button>
            </div>

            <div className="space-y-3">
              {formData.workflowSteps.map((workflowStep, index) => (
                <Card key={workflowStep.id} className="p-3">
                  <div className="flex gap-3 items-start">
                    <GripVertical className="h-4 w-4 text-muted-foreground mt-2 flex-shrink-0" />
                    <div className="flex-1 space-y-1">
                      <Label className="text-xs text-muted-foreground">
                        Step {index + 1}
                      </Label>
                      <Textarea
                        placeholder="Describe this workflow step..."
                        value={workflowStep.content}
                        onChange={(e) =>
                          updateWorkflowStep(workflowStep.id, e.target.value)
                        }
                        rows={2}
                        className="min-h-[60px]"
                      />
                    </div>
                    {formData.workflowSteps.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeWorkflowStep(workflowStep.id)}
                        className="text-destructive hover:text-destructive h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fixed Bottom */}
      <div className="shrink-0 flex justify-between pt-4 border-t">
        <Button variant="outline" onClick={step === 1 ? onCancel : () => setStep(1)}>
          {step === 1 ? "Cancel" : "Back"}
        </Button>
        {step === 1 ? (
          <Button onClick={handleNext}>Next</Button>
        ) : (
          <Button onClick={handleSave}>
            {initialData ? "Update Instruction" : "Create Instruction"}
          </Button>
        )}
      </div>
    </div>
  );
};
