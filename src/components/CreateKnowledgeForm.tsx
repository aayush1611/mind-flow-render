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

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-primary">Add Knowledge Source</h1>
          <p className="text-muted-foreground">
            Connect your repository as a knowledge source
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center flex-1">
              <div
                className={cn(
                  "h-2 rounded-full flex-1 transition-colors",
                  num <= step ? "bg-primary" : "bg-muted"
                )}
              />
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="border rounded-xl p-6 bg-card shadow-sm space-y-6 min-h-[400px]">
          {/* Step 1: Provider Selection */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-start gap-4 bg-primary/5 p-4 rounded-lg">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Select Provider</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose where your knowledge source is hosted
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {providers.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setProvider(p.id)}
                    className={cn(
                      "p-6 border-2 rounded-xl transition-all hover:border-primary/50 hover:shadow-sm",
                      provider === p.id
                        ? "border-primary bg-primary/5"
                        : "border-border bg-background"
                    )}
                  >
                    <div className="text-4xl mb-3">{p.icon}</div>
                    <div className="font-semibold">{p.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Name and Description */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-start gap-4 bg-primary/5 p-4 rounded-lg">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Knowledge Details</h3>
                  <p className="text-sm text-muted-foreground">
                    Provide a name and description for this source
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">
                  Source Name <span className="text-destructive">*</span>
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Product Documentation, Support Articles..."
                  className="text-base"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Choose a descriptive name for this knowledge source
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Description (Optional)</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what this knowledge source contains..."
                  className="min-h-[120px] text-base"
                />
                <p className="text-sm text-muted-foreground">
                  Help others understand what's included in this source
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Repository Configuration */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-start gap-4 bg-primary/5 p-4 rounded-lg">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <GitBranch className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Repository Configuration</h3>
                  <p className="text-sm text-muted-foreground">
                    Connect to your {provider ? providers.find(p => p.id === provider)?.name : ""} repository
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">
                  Repository URL <span className="text-destructive">*</span>
                </label>
                <Input
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/username/repository"
                  className="text-base"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  The full URL to your repository
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">
                  Branch <span className="text-destructive">*</span>
                </label>
                <Input
                  value={repoBranch}
                  onChange={(e) => setRepoBranch(e.target.value)}
                  placeholder="main"
                  className="text-base"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  The branch to pull knowledge from
                </p>
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
                    className="text-base"
                    required={isPrivate}
                  />
                  <p className="text-sm text-muted-foreground">
                    Required for accessing private repositories
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={step === 1 ? onClose : handleBack}
            className="gap-2"
          >
            {step === 1 ? (
              <>
                <X className="w-4 h-4" />
                Cancel
              </>
            ) : (
              <>
                <ArrowLeft className="w-4 h-4" />
                Back
              </>
            )}
          </Button>

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
