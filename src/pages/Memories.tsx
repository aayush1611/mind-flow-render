import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2, Brain } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import TopNavigation from "@/components/TopNavigation";

interface Memory {
  id: string;
  content: string;
}

export default function Memories() {
  const navigate = useNavigate();
  const [memoriesEnabled, setMemoriesEnabled] = useState(true);
  const [memories, setMemories] = useState<Memory[]>([
    { id: "mem_001", content: "User prefers dark mode for better readability" },
    { id: "mem_002", content: "User is working on a React project with TypeScript" },
    { id: "mem_003", content: "User prefers concise responses without verbose explanations" },
  ]);

  const handleTabChange = (tab: string) => {
    if (tab === "projects") {
      navigate("/projects");
    } else if (tab === "instructions") {
      navigate("/instructions");
    } else if (tab === "knowledge") {
      navigate("/knowledge");
    } else if (tab === "rules") {
      navigate("/rules");
    } else if (tab === "mcp") {
      navigate("/mcp");
    } else if (tab === "memories") {
      navigate("/memories");
    } else {
      navigate("/");
    }
  };

  const handleToggleMemories = () => {
    setMemoriesEnabled(!memoriesEnabled);
    toast.success(memoriesEnabled ? "Memories disabled" : "Memories enabled");
  };

  const handleDeleteAll = () => {
    setMemories([]);
    toast.success("All memories deleted");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopNavigation activeTab="memories" onTabChange={handleTabChange} />
      <div className="container mx-auto p-6 max-w-4xl flex-1">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Brain className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Memories</h1>
          </div>
          <p className="text-muted-foreground">
            Manage your conversation memories. Enable or disable memories to control what the AI remembers about your preferences and context.
          </p>
        </div>

        {memories.length > 0 && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">All Memories ({memories.length})</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="memories-toggle" className="text-sm font-medium cursor-pointer">
                  {memoriesEnabled ? "Enabled" : "Disabled"}
                </Label>
                <Switch
                  id="memories-toggle"
                  checked={memoriesEnabled}
                  onCheckedChange={handleToggleMemories}
                />
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete All
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete all your stored memories and conversation context.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAll} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Delete All
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        )}

        {memories.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Brain className="w-16 h-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center">
                No memories stored yet. Start chatting to build your memory base.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {memories.map((memory) => (
              <Card key={memory.id} className={cn(!memoriesEnabled && "opacity-50 pointer-events-none")}>
                <CardHeader>
                  <CardTitle className="text-sm font-mono text-muted-foreground mb-2">
                    {memory.id}
                  </CardTitle>
                  <CardDescription className="text-base text-foreground">
                    {memory.content}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
