import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Shield } from "lucide-react";

interface CreateRuleFormProps {
  onClose: () => void;
  onComplete: (ruleData: { name: string; description: string }) => void;
  initialData?: { name: string; description: string };
}

export default function CreateRuleForm({ onClose, onComplete, initialData }: CreateRuleFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onComplete({ name, description });
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background border rounded-2xl shadow-elegant max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-primary">
              {initialData ? "Edit Rule" : "Create New Rule"}
            </h1>
            <p className="text-muted-foreground">
              {initialData ? "Update the rule details" : "Define a rule to govern AI behavior and enforce policies"}
            </p>
          </div>

          <div className="border rounded-xl p-6 bg-card shadow-sm space-y-6">
            <div className="flex items-start gap-4 bg-primary/5 p-4 rounded-lg">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Rule Details</h3>
                <p className="text-sm text-muted-foreground">
                  Provide information about this rule
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">
                Rule Name <span className="text-destructive">*</span>
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Data Privacy Policy, Content Moderation..."
                className="text-base"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Description (Optional)</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what this rule enforces..."
                className="min-h-[120px] text-base"
              />
            </div>
          </div>

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
              disabled={!name.trim()}
              className="gap-2"
            >
              {initialData ? "Update Rule" : "Create Rule"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
