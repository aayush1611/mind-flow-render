import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface WorkflowStep {
  id: string;
  content: string;
}

interface InstructionCardProps {
  id: string;
  heading: string;
  status: "active" | "inactive";
  priority: "high" | "medium" | "low";
  workflowSteps: WorkflowStep[];
  matchPercentage?: number;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const InstructionCard = ({
  id,
  heading,
  status,
  priority,
  workflowSteps,
  matchPercentage,
  onEdit,
  onDelete,
}: InstructionCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const priorityColors = {
    high: "bg-destructive text-destructive-foreground",
    medium: "bg-primary text-primary-foreground",
    low: "bg-muted text-muted-foreground",
  };

  const statusColors = {
    active: "bg-primary text-primary-foreground",
    inactive: "bg-muted text-muted-foreground",
  };

  return (
    <Card className={`hover:shadow-md transition-shadow relative ${status === "inactive" ? "opacity-60" : ""}`}>
      {status === "inactive" && (
        <div className="absolute inset-0 bg-muted/30 rounded-lg pointer-events-none z-0" />
      )}
      <CardHeader className="pb-3 relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-semibold">{heading}</h3>
              {matchPercentage !== undefined && (
                <Badge variant="outline" className="bg-accent">
                  {matchPercentage}% match
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={statusColors[status]}>{status}</Badge>
              <Badge className={priorityColors[priority]}>{priority}</Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(id)}
              className="h-8 w-8"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(id)}
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="space-y-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>Workflow Steps ({workflowSteps.length})</span>
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          {expanded && (
            <div className="space-y-2 mt-3">
              {workflowSteps.map((step, index) => (
                <div
                  key={step.id}
                  className="flex gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </span>
                  <p className="text-sm text-foreground">{step.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
