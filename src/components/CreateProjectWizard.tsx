import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, ChevronLeft, ChevronRight, FileText, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreateProjectWizardProps {
  onClose: () => void;
  onComplete: (projectData: { name: string; description: string }) => void;
}

export default function CreateProjectWizard({ onClose, onComplete }: CreateProjectWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const steps = [
    { number: 1, label: "Project Name" },
    { number: 2, label: "Project Description" },
    { number: 3, label: "Review & Create" },
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete({ name: projectName, description: projectDescription });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background border rounded-2xl shadow-elegant max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-primary">Create New Project</h1>
            <p className="text-muted-foreground">
              Set up a new project to organize your knowledge sources and conversations
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-semibold">Step {currentStep} of {totalSteps}</span>
              <span className="text-muted-foreground">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Step Indicators */}
          <div className="flex justify-between items-center">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col items-center flex-1">
                <div
                  className={cn(
                    "w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg transition-colors",
                    currentStep >= step.number
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {step.number}
                </div>
                <p
                  className={cn(
                    "mt-2 text-sm font-medium",
                    currentStep >= step.number ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </p>
              </div>
            ))}
          </div>

          {/* Content Card */}
          <div className="border rounded-xl p-6 bg-card shadow-sm space-y-6">
            {currentStep === 1 && (
              <>
                <div className="flex items-start gap-4 bg-primary/5 p-4 rounded-lg">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Project Name</h3>
                    <p className="text-sm text-muted-foreground">
                      Give your project a clear, descriptive name
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">
                    Project Name <span className="text-destructive">*</span>
                  </label>
                  <Input
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="e.g., Customer Support Bot, Code Documentation..."
                    className="text-base"
                  />
                  <p className="text-sm text-muted-foreground">
                    Choose a unique name that describes your project's purpose
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                    <Lightbulb className="w-4 h-4" />
                    <span className="font-semibold">Naming Tips:</span>
                  </div>
                  <ul className="space-y-1 text-sm text-blue-600 dark:text-blue-400 list-disc list-inside">
                    <li>Use descriptive names (e.g., "Q&A Bot for HR Policies")</li>
                    <li>Avoid special characters except hyphens and underscores</li>
                    <li>Keep it concise but meaningful</li>
                  </ul>
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <div className="flex items-start gap-4 bg-primary/5 p-4 rounded-lg">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Project Description</h3>
                    <p className="text-sm text-muted-foreground">
                      Describe the purpose and scope of this project
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Description (Optional)</label>
                  <Textarea
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    placeholder="Describe what this project is about, its goals, and what kind of knowledge sources it will use..."
                    className="min-h-[150px] text-base"
                  />
                  <p className="text-sm text-muted-foreground">
                    A clear description helps team members understand the project's purpose
                  </p>
                </div>
              </>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-start gap-4 bg-primary/5 p-4 rounded-lg">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Review & Create</h3>
                    <p className="text-sm text-muted-foreground">
                      Review your project details before creating
                    </p>
                  </div>
                </div>

                <div className="space-y-4 border rounded-lg p-4 bg-muted/30">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase">
                      Project Name
                    </label>
                    <p className="text-lg font-semibold text-foreground">{projectName}</p>
                  </div>
                  {projectDescription && (
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase">
                        Description
                      </label>
                      <p className="text-sm text-foreground">{projectDescription}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              className="gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <Button
                onClick={handleNext}
                disabled={currentStep === 1 && !projectName.trim()}
                className="gap-2"
              >
                {currentStep === totalSteps ? "Create Project" : "Next"}
                {currentStep < totalSteps && <ChevronRight className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Help Link */}
          <div className="text-center text-sm text-muted-foreground pt-2">
            Need help?{" "}
            <a href="#" className="text-primary hover:underline">
              View documentation
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
