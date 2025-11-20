import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { InstructionCard } from "./InstructionCard";
import { InstructionForm } from "./InstructionForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface WorkflowStep {
  id: string;
  content: string;
}

interface Instruction {
  id: string;
  heading: string;
  status: "active" | "inactive";
  priority: "high" | "medium" | "low";
  workflowSteps: WorkflowStep[];
}

export const InstructionManagement = () => {
  const [instructions, setInstructions] = useState<Instruction[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingInstruction, setEditingInstruction] = useState<Instruction | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const calculateMatchPercentage = (instruction: Instruction, query: string): number => {
    if (!query.trim()) return 0;
    
    const queryLower = query.toLowerCase();
    const headingMatch = instruction.heading.toLowerCase().includes(queryLower);
    const stepMatches = instruction.workflowSteps.filter(step =>
      step.content.toLowerCase().includes(queryLower)
    ).length;
    
    const totalPossibleMatches = 1 + instruction.workflowSteps.length;
    const matches = (headingMatch ? 1 : 0) + stepMatches;
    
    return Math.round((matches / totalPossibleMatches) * 100);
  };

  const filteredInstructions = searchQuery.trim()
    ? instructions
        .map(instruction => ({
          ...instruction,
          matchPercentage: calculateMatchPercentage(instruction, searchQuery),
        }))
        .filter(instruction => instruction.matchPercentage > 0)
        .sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0))
    : instructions.map(inst => ({ ...inst, matchPercentage: undefined as number | undefined }));

  const handleSave = (data: Instruction) => {
    if (editingInstruction) {
      setInstructions(
        instructions.map((inst) =>
          inst.id === editingInstruction.id ? { ...data, id: inst.id } : inst
        )
      );
      setEditingInstruction(null);
    } else {
      setInstructions([...instructions, { ...data, id: crypto.randomUUID() }]);
    }
    setShowForm(false);
  };

  const handleEdit = (id: string) => {
    const instruction = instructions.find((inst) => inst.id === id);
    if (instruction) {
      setEditingInstruction(instruction);
      setShowForm(true);
    }
  };

  const handleDelete = (id: string) => {
    setInstructions(instructions.filter((inst) => inst.id !== id));
    setDeleteId(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingInstruction(null);
  };

  if (showForm) {
    return (
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <InstructionForm
          initialData={editingInstruction || undefined}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl">
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-4xl font-bold">System Instructions</h1>
            <p className="text-muted-foreground mt-2">
              Manage and organize your AI instruction workflows
            </p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Instruction
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search instructions or test playground matching..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          {searchQuery && (
            <p className="text-sm text-muted-foreground mt-2">
              Found {filteredInstructions.length} matching instruction(s)
            </p>
          )}
        </div>

        {instructions.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <div className="w-16 h-16 rounded-full bg-muted mx-auto flex items-center justify-center">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">No instructions yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Get started by creating your first system instruction with workflow
                steps to guide AI behavior
              </p>
            </div>
            <Button onClick={() => setShowForm(true)} className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Create First Instruction
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredInstructions.map((instruction) => (
              <InstructionCard
                key={instruction.id}
                {...instruction}
                matchPercentage={
                  searchQuery ? instruction.matchPercentage : undefined
                }
                onEdit={handleEdit}
                onDelete={(id) => setDeleteId(id)}
              />
            ))}
          </div>
        )}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Instruction</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this instruction? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
