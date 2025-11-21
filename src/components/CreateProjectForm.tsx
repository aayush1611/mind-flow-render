import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, FileText } from "lucide-react";

interface CreateProjectFormProps {
  onClose: () => void;
  onComplete: (projectData: { name: string; description: string }) => void;
}

export default function CreateProjectForm({ onClose, onComplete }: CreateProjectFormProps) {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (projectName.trim()) {
      onComplete({ name: projectName, description: projectDescription });
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-primary">Create New Project</h1>
          <p className="text-muted-foreground">
            Set up a new project to organize your knowledge sources and conversations
          </p>
        </div>

        {/* Content Card */}
        <div className="border rounded-xl p-6 bg-card shadow-sm space-y-6">
          <div className="flex items-start gap-4 bg-primary/5 p-4 rounded-lg">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Project Details</h3>
              <p className="text-sm text-muted-foreground">
                Provide a name and description for your project
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
              required
            />
            <p className="text-sm text-muted-foreground">
              Choose a unique name that describes your project's purpose
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Description (Optional)</label>
            <Textarea
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="Describe what this project is about, its goals, and what kind of knowledge sources it will use..."
              className="min-h-[120px] text-base"
            />
            <p className="text-sm text-muted-foreground">
              A clear description helps team members understand the project's purpose
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="gap-2"
          >
            <X className="w-4 h-4" />
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={!projectName.trim()}
            className="gap-2"
          >
            Create Project
          </Button>
        </div>

        {/* Help Link */}
        <div className="text-center text-sm text-muted-foreground pt-2">
          Need help?{" "}
          <a href="#" className="text-primary hover:underline">
            View documentation
          </a>
        </div>
      </form>
    </div>
  );
}
