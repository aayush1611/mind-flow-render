import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { X, BookOpen, ArrowRight, ArrowLeft, GitBranch } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreateKnowledgeFormProps {
  onClose: () => void;
  onComplete: (knowledgeData: {
    name: string;
    description: string;
    provider: string;
    repoUrl: string;
    repoBranch: string;
    patToken?: string;
  }) => void;
}

type Provider = "azure-devops" | "github" | "gitlab";

const providers = [
  { id: "azure-devops" as Provider, name: "Azure DevOps", icon: "🔷" },
  { id: "github" as Provider, name: "GitHub", icon: "🐙" },
  { id: "gitlab" as Provider, name: "GitLab", icon: "🦊" },
];

export default function CreateKnowledgeForm({ onClose, onComplete }: CreateKnowledgeFormProps) {
  const [step, setStep] = useState(1);
  const [provider, setProvider] = useState<Provider | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [repoBranch, setRepoBranch] = useState("main");
  const [isPrivate, setIsPrivate] = useState(false);
  const [patToken, setPatToken] = useState("");

  const handleNext = () => {
    if (step === 1 && provider) {
      setStep(2);
    } else if (step === 2 && name.trim()) {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && provider && repoUrl.trim() && repoBranch.trim()) {
      onComplete({
        name,
        description,
        provider,
        repoUrl,
        repoBranch,
        ...(isPrivate && patToken ? { patToken } : {}),
      });
    }
  };

  const canProceed = () => {
    if (step === 1) return provider !== null;
    if (step === 2) return name.trim() !== "";
    if (step === 3) return repoUrl.trim() !== "" && repoBranch.trim() !== "" && (!isPrivate || patToken.trim() !== "");
    return false;
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Step 1: Select Provider";
      case 2:
        return "Step 2: Knowledge Details";
      case 3:
        return "Step 3: Repository Configuration";
      default:
        return "";
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Header */}
        <div className="space-y-1 relative">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute -top-2 right-0 h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold text-primary">Add Knowledge Source</h1>
          <p className="text-sm text-muted-foreground">
            Connect your repository as a knowledge source
          </p>
        </div>

        {/* Progress Indicator with Step Title */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center flex-1">
                <div
                  className={cn(
                    "h-1.5 rounded-full flex-1 transition-colors",
                    num <= step ? "bg-primary" : "bg-muted"
                  )}
                />
              </div>
            ))}
          </div>
          <p className="text-sm font-semibold text-foreground">{getStepTitle()}</p>
        </div>

        {/* Step Content */}
        <div className="border rounded-lg p-5 bg-card shadow-sm space-y-4 min-h-[320px]">
          {/* Step 1: Provider Selection */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Choose where your knowledge source is hosted
              </p>

              <div className="grid grid-cols-3 gap-3">
                {providers.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setProvider(p.id)}
                    className={cn(
                      "p-4 border-2 rounded-lg transition-all hover:border-primary/50 hover:shadow-sm",
                      provider === p.id
                        ? "border-primary bg-primary/5"
                        : "border-border bg-background"
                    )}
                  >
                    <div className="text-3xl mb-2">{p.icon}</div>
                    <div className="text-sm font-semibold">{p.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Name and Description */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">
                  Source Name <span className="text-destructive">*</span>
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Product Documentation, Support Articles..."
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Description (Optional)</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what this knowledge source contains..."
                  className="min-h-[100px]"
                />
              </div>
            </div>
          )}

          {/* Step 3: Repository Configuration */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">
                  Repository URL <span className="text-destructive">*</span>
                </label>
                <Input
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/username/repository"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">
                  Branch <span className="text-destructive">*</span>
                </label>
                <Input
                  value={repoBranch}
                  onChange={(e) => setRepoBranch(e.target.value)}
                  placeholder="main"
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="private"
                  checked={isPrivate}
                  onCheckedChange={(checked) => setIsPrivate(checked as boolean)}
                />
                <label
                  htmlFor="private"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  This is a private repository
                </label>
              </div>

              {isPrivate && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold">
                    Personal Access Token (PAT) <span className="text-destructive">*</span>
                  </label>
                  <Input
                    type="password"
                    value={patToken}
                    onChange={(e) => setPatToken(e.target.value)}
                    placeholder="Enter your PAT token"
                    required={isPrivate}
                  />
                  <p className="text-xs text-muted-foreground">
                    Required for accessing private repositories
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t">
          {step > 1 ? (
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <Button
              type="button"
              onClick={handleNext}
              disabled={!canProceed()}
              className="gap-2"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={!canProceed()}
              className="gap-2"
            >
              Add Source
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
