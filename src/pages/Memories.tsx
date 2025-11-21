import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Trash2, Brain } from "lucide-react";
import { toast } from "sonner";

interface Memory {
  id: string;
  content: string;
  enabled: boolean;
}

export default function Memories() {
  const [memories, setMemories] = useState<Memory[]>([
    { id: "mem_001", content: "User prefers dark mode for better readability", enabled: true },
    { id: "mem_002", content: "User is working on a React project with TypeScript", enabled: true },
    { id: "mem_003", content: "User prefers concise responses without verbose explanations", enabled: false },
  ]);

  const handleToggleMemory = (id: string) => {
    setMemories(prev =>
      prev.map(mem =>
        mem.id === id ? { ...mem, enabled: !mem.enabled } : mem
      )
    );
    toast.success("Memory status updated");
  };

  const handleDeleteAll = () => {
    setMemories([]);
    toast.success("All memories deleted");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Brain className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Memories</h1>
          </div>
          <p className="text-muted-foreground">
            Manage your conversation memories. Enable or disable specific memories to control what the AI remembers about your preferences and context.
          </p>
        </div>

        {memories.length > 0 && (
          <div className="flex justify-end mb-4">
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteAll}
              className="gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete All Memories
            </Button>
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
              <Card key={memory.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-sm font-mono text-muted-foreground mb-2">
                        {memory.id}
                      </CardTitle>
                      <CardDescription className="text-base text-foreground">
                        {memory.content}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Label
                        htmlFor={`memory-${memory.id}`}
                        className="text-sm text-muted-foreground cursor-pointer"
                      >
                        {memory.enabled ? "Enabled" : "Disabled"}
                      </Label>
                      <Switch
                        id={`memory-${memory.id}`}
                        checked={memory.enabled}
                        onCheckedChange={() => handleToggleMemory(memory.id)}
                      />
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
