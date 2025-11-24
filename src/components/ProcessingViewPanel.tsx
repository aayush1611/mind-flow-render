import { X, Activity, CheckCircle2, Loader2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProcessingStep {
  id: string;
  label: string;
  status: "pending" | "processing" | "complete";
  details?: string;
  logs?: string[];
}

interface ProcessingViewPanelProps {
  step: ProcessingStep;
  onClose: () => void;
  className?: string;
}

export default function ProcessingViewPanel({ step, onClose, className }: ProcessingViewPanelProps) {
  return (
    <div 
      className={cn(
        "fixed right-0 top-0 h-full w-[40%] bg-background border-l shadow-elegant z-40 flex flex-col animate-slide-in-right",
        className
      )}
    >
      {/* Header */}
      <div className="bg-card border-b flex items-center justify-between px-4 py-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
            step.status === "complete" && "bg-success/10",
            step.status === "processing" && "bg-primary/10",
            step.status === "pending" && "bg-muted"
          )}>
            {step.status === "complete" && <CheckCircle2 className="w-4 h-4 text-success" />}
            {step.status === "processing" && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
            {step.status === "pending" && <Clock className="w-4 h-4 text-muted-foreground" />}
          </div>
          <div>
            <h3 className="font-semibold text-sm">Processing Details</h3>
            <p className="text-xs text-muted-foreground">Step {step.id}</p>
          </div>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 rounded-md"
          onClick={onClose}
          title="Close"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 space-y-4">
          {/* Step Status Card */}
          <div className="bg-card rounded-xl border p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Current Step</span>
            </div>
            <h4 className="font-medium text-sm mb-2">{step.label}</h4>
            <div className={cn(
              "inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md",
              step.status === "complete" && "bg-success/10 text-success",
              step.status === "processing" && "bg-primary/10 text-primary",
              step.status === "pending" && "bg-muted text-muted-foreground"
            )}>
              {step.status === "complete" && <CheckCircle2 className="w-3 h-3" />}
              {step.status === "processing" && <Loader2 className="w-3 h-3 animate-spin" />}
              {step.status === "pending" && <Clock className="w-3 h-3" />}
              <span className="capitalize">{step.status}</span>
            </div>
          </div>

          {/* Step Details */}
          {step.details && (
            <div className="bg-card rounded-xl border p-4 shadow-sm">
              <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Details</h5>
              <p className="text-sm text-foreground leading-relaxed">{step.details}</p>
            </div>
          )}

          {/* Process Logs */}
          <div className="bg-card rounded-xl border overflow-hidden shadow-sm">
            <div className="bg-muted/30 px-4 py-2.5 border-b">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Process Logs</span>
            </div>
            
            <div className="p-4 font-mono text-xs space-y-1.5 bg-muted/5 max-h-[400px] overflow-auto">
              {step.logs && step.logs.length > 0 ? (
                step.logs.map((log, idx) => (
                  <div key={idx} className="flex gap-3 hover:bg-accent/5 px-2 py-1 rounded transition-colors">
                    <span className="text-muted-foreground select-none shrink-0">{String(idx + 1).padStart(2, '0')}</span>
                    <span className="flex-1 text-foreground/90">{log}</span>
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground italic text-center py-4">No logs available</div>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-card rounded-xl border p-4 shadow-sm">
            <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Metadata</h5>
            <div className="space-y-2.5">
              <div className="flex justify-between items-center py-1.5 border-b border-border/50">
                <span className="text-xs text-muted-foreground">Step ID</span>
                <span className="text-xs font-mono font-medium">{step.id}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-border/50">
                <span className="text-xs text-muted-foreground">Status</span>
                <span className="text-xs font-medium capitalize">{step.status}</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-xs text-muted-foreground">Type</span>
                <span className="text-xs font-medium">Processing Step</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
