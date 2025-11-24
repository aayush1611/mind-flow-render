import { X, Monitor, Cpu, CheckCircle2, Loader2 } from "lucide-react";
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
        "fixed right-0 top-0 h-full w-[40%] bg-background border-l shadow-2xl z-40 flex flex-col animate-slide-in-right",
        className
      )}
    >
      {/* Computer Header - Monitor Style */}
      <div className="bg-gradient-to-b from-muted/50 to-background border-b flex flex-col shrink-0">
        {/* Top Bar - Monitor Bezel */}
        <div className="h-8 bg-muted/30 flex items-center justify-between px-4 border-b">
          <div className="flex items-center gap-2">
            <Monitor className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold text-muted-foreground">PROCESSING VIEW</span>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 rounded-md"
            onClick={onClose}
            title="Close"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Step Info Header */}
        <div className="px-4 py-4 space-y-3">
          <div className="flex items-start gap-3">
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
              step.status === "complete" && "bg-green-500/10",
              step.status === "processing" && "bg-primary/10",
              step.status === "pending" && "bg-muted"
            )}>
              {step.status === "complete" && <CheckCircle2 className="w-5 h-5 text-green-500" />}
              {step.status === "processing" && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
              {step.status === "pending" && <Cpu className="w-5 h-5 text-muted-foreground" />}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm mb-1">{step.label}</h3>
              <div className={cn(
                "text-xs font-medium px-2 py-1 rounded-md w-fit",
                step.status === "complete" && "bg-green-500/10 text-green-500",
                step.status === "processing" && "bg-primary/10 text-primary",
                step.status === "pending" && "bg-muted text-muted-foreground"
              )}>
                {step.status === "complete" && "Completed"}
                {step.status === "processing" && "Processing..."}
                {step.status === "pending" && "Pending"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area - Terminal/Console Like */}
      <div className="flex-1 overflow-auto bg-muted/20">
        <div className="p-4 space-y-4">
          {/* Step Details */}
          {step.details && (
            <div className="bg-card rounded-lg border p-4 space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Details</span>
              </div>
              <p className="text-sm text-foreground leading-relaxed">{step.details}</p>
            </div>
          )}

          {/* Process Logs */}
          <div className="bg-card rounded-lg border overflow-hidden">
            <div className="bg-muted/50 px-4 py-2 border-b flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="text-xs font-mono text-muted-foreground ml-2">process.log</span>
            </div>
            
            <div className="p-4 font-mono text-xs space-y-1.5 bg-muted/20 max-h-[400px] overflow-auto">
              {step.logs && step.logs.length > 0 ? (
                step.logs.map((log, idx) => (
                  <div key={idx} className="flex gap-3 text-foreground/90">
                    <span className="text-muted-foreground select-none">{String(idx + 1).padStart(3, '0')}</span>
                    <span className="flex-1">{log}</span>
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground italic">No logs available for this step</div>
              )}
            </div>
          </div>

          {/* System Info */}
          <div className="bg-card rounded-lg border p-4 space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <Cpu className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">System Info</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <div className="text-muted-foreground">Step ID</div>
                <div className="font-mono font-medium">{step.id}</div>
              </div>
              <div className="space-y-1">
                <div className="text-muted-foreground">Status</div>
                <div className="font-mono font-medium capitalize">{step.status}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
