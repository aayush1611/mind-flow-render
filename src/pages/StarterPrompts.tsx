import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Edit2, Trash2, Plus, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { toast } from "sonner";

interface Prompt {
  id: string;
  text: string;
  createdAt: string;
}

const StarterPrompts = () => {
  const navigate = useNavigate();
  const [prompts, setPrompts] = useState<Prompt[]>([
    { id: "1", text: "Analyze the latest research papers on machine learning", createdAt: "2024-01-15" },
    { id: "2", text: "Summarize the key findings from the documentation", createdAt: "2024-01-18" },
    { id: "3", text: "Generate insights from training data patterns", createdAt: "2024-01-20" },
  ]);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState<Prompt | null>(null);
  const [promptText, setPromptText] = useState("");

  const handleAddPrompt = () => {
    if (promptText.trim()) {
      const newPrompt: Prompt = {
        id: Date.now().toString(),
        text: promptText,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setPrompts([...prompts, newPrompt]);
      toast.success("Starter prompt added successfully!");
      setPromptText("");
      setIsAddModalOpen(false);
    }
  };

  const handleEditPrompt = () => {
    if (currentPrompt && promptText.trim()) {
      setPrompts(prompts.map(p => 
        p.id === currentPrompt.id ? { ...p, text: promptText } : p
      ));
      toast.success("Starter prompt updated successfully!");
      setPromptText("");
      setCurrentPrompt(null);
      setIsEditModalOpen(false);
    }
  };

  const handleDeletePrompt = (id: string) => {
    setPrompts(prompts.filter(p => p.id !== id));
    toast.success("Starter prompt deleted successfully!");
  };

  const handleDeleteAll = () => {
    setPrompts([]);
    toast.success("All starter prompts deleted successfully!");
    setIsDeleteAllDialogOpen(false);
  };

  const openEditModal = (prompt: Prompt) => {
    setCurrentPrompt(prompt);
    setPromptText(prompt.text);
    setIsEditModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="mt-1"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Sparkles className="h-7 w-7" />
                Manage Starter Prompts
              </h1>
              <p className="text-muted-foreground mt-2">
                Create and manage starter prompts for your project
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsAddModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Starter Prompt
            </Button>
            {prompts.length > 0 && (
              <Button
                variant="destructive"
                onClick={() => setIsDeleteAllDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete All Prompts
              </Button>
            )}
          </div>
        </div>

        {/* Prompts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {prompts.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium text-muted-foreground">
                  No starter prompts yet
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Add your first starter prompt to get started
                </p>
              </CardContent>
            </Card>
          ) : (
            prompts.map((prompt) => (
              <Card key={prompt.id} className="relative">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <Sparkles className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => openEditModal(prompt)}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => handleDeletePrompt(prompt.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm line-clamp-4">{prompt.text}</p>
                  <p className="text-xs text-muted-foreground mt-3">
                    Added on {new Date(prompt.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Add Prompt Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Starter Prompt</DialogTitle>
            <DialogDescription>
              Create a new starter prompt for your project (max 500 characters)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Enter your starter prompt..."
              value={promptText}
              onChange={(e) => setPromptText(e.target.value.slice(0, 500))}
              rows={5}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground text-right">
              {promptText.length}/500 characters
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setPromptText("");
              setIsAddModalOpen(false);
            }}>
              Cancel
            </Button>
            <Button onClick={handleAddPrompt} disabled={!promptText.trim()}>
              Add Prompt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Prompt Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Starter Prompt</DialogTitle>
            <DialogDescription>
              Update your starter prompt (max 500 characters)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Enter your starter prompt..."
              value={promptText}
              onChange={(e) => setPromptText(e.target.value.slice(0, 500))}
              rows={5}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground text-right">
              {promptText.length}/500 characters
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setPromptText("");
              setCurrentPrompt(null);
              setIsEditModalOpen(false);
            }}>
              Cancel
            </Button>
            <Button onClick={handleEditPrompt} disabled={!promptText.trim()}>
              Update Prompt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete All Confirmation Dialog */}
      <AlertDialog open={isDeleteAllDialogOpen} onOpenChange={setIsDeleteAllDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete All Starter Prompts?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all starter prompts
              from this project.
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
  );
};

export default StarterPrompts;
