import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ArrowLeft, 
  Edit2, 
  Trash2, 
  RefreshCw,
  Share2,
  FileText,
  Github,
  GitBranch
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import CreateKnowledgeForm from "@/components/CreateKnowledgeForm";

const KnowledgeDetailView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [name, setName] = useState("Product Documentation");
  const [description, setDescription] = useState("Complete product documentation and user guides for all our software products.");
  const [showShareDialog, setShowShareDialog] = useState(false);
  
  // Mock data - replace with actual data
  const isAdmin = true;
  const [knowledgeData, setKnowledgeData] = useState({
    provider: "github" as "github" | "gitlab" | "azure-devops",
    repoUrl: "https://github.com/example/docs",
    repoBranch: "main",
    isPrivate: false,
    patToken: ""
  });
  const knowledgeSource = {
    id: id || "kb-12345",
    status: "indexed",
    createdAt: "2024-01-10",
    lastIndexedAt: "2024-01-20",
    integrationType: "github",
    indexingProgress: 85
  };

  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [shareWithOrganization, setShareWithOrganization] = useState(false);
  
  const mockProjects = [
    { id: "1", name: "AI Assistant Project" },
    { id: "2", name: "Dashboard Analytics" },
    { id: "3", name: "Mobile App" },
    { id: "4", name: "E-commerce Platform" },
    { id: "5", name: "Social Media Integration" },
    { id: "6", name: "Payment Gateway" },
    { id: "7", name: "Customer Portal" },
    { id: "8", name: "Admin Dashboard" }
  ];
  
  const mockMembers = [
    { id: "1", name: "John Doe", email: "john@example.com" },
    { id: "2", name: "Jane Smith", email: "jane@example.com" },
    { id: "3", name: "Bob Johnson", email: "bob@example.com" },
    { id: "4", name: "Alice Williams", email: "alice@example.com" },
    { id: "5", name: "Charlie Brown", email: "charlie@example.com" },
    { id: "6", name: "Diana Prince", email: "diana@example.com" },
    { id: "7", name: "Eve Anderson", email: "eve@example.com" },
    { id: "8", name: "Frank Miller", email: "frank@example.com" }
  ];

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleEditComplete = (updatedData: {
    name: string;
    description: string;
    provider: string;
    repoUrl: string;
    repoBranch: string;
    patToken?: string;
  }) => {
    setName(updatedData.name);
    setDescription(updatedData.description);
    setKnowledgeData({
      provider: updatedData.provider as "github" | "gitlab" | "azure-devops",
      repoUrl: updatedData.repoUrl,
      repoBranch: updatedData.repoBranch,
      isPrivate: !!updatedData.patToken,
      patToken: updatedData.patToken || ""
    });
    setShowEditForm(false);
    toast({
      title: "Knowledge source updated",
      description: "Your changes have been saved successfully."
    });
  };

  const handleDelete = () => {
    toast({
      title: "Knowledge source deleted",
      description: "The knowledge source has been successfully deleted."
    });
    navigate("/knowledge");
  };

  const handleReload = () => {
    toast({
      title: "Reloading knowledge source",
      description: "The knowledge source details are being reloaded."
    });
  };

  const handleShare = () => {
    if (shareWithOrganization) {
      toast({
        title: "Knowledge source shared",
        description: "Shared with entire organization. All members now have access as viewers."
      });
    } else {
      toast({
        title: "Knowledge source shared",
        description: `Shared with ${selectedProjects.length} projects and ${selectedMembers.length} members.`
      });
    }
    setShowShareDialog(false);
    setSelectedProjects([]);
    setSelectedMembers([]);
    setShareWithOrganization(false);
  };

  const getIntegrationIcon = (type: string) => {
    switch (type) {
      case "github":
        return <Github className="h-5 w-5" />;
      case "gitlab":
        return <GitBranch className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "indexed":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "processing":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "failed":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (showEditForm) {
    return (
      <div className="h-full bg-background overflow-auto">
        <div className="container mx-auto px-6 py-8">
          <CreateKnowledgeForm
            onClose={() => setShowEditForm(false)}
            onComplete={handleEditComplete}
            initialData={{
              name,
              description,
              provider: knowledgeData.provider,
              repoUrl: knowledgeData.repoUrl,
              repoBranch: knowledgeData.repoBranch,
              isPrivate: knowledgeData.isPrivate,
              patToken: knowledgeData.patToken
            }}
            isEditMode={true}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-start gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/knowledge")}
            className="mt-1"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex-1 space-y-6">
            <div>
              {isEditing ? (
                <div className="space-y-3">
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="text-2xl font-bold h-auto py-2"
                  />
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="resize-none"
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleSave} size="sm">
                      Save Changes
                    </Button>
                    <Button
                      onClick={() => setIsEditing(false)}
                      variant="outline"
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold">{name}</h1>
                    {isAdmin && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowEditForm(true)}
                        className="h-8 w-8"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <p className="text-muted-foreground mt-2">{description}</p>
                </div>
              )}
            </div>

            <Card className="border-2">
              <CardHeader>
                <CardTitle>Knowledge Source Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">ID</p>
                    <p className="font-mono text-sm">{knowledgeSource.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Status</p>
                    <Badge
                      variant="outline"
                      className={getStatusColor(knowledgeSource.status)}
                    >
                      {knowledgeSource.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Integration Type</p>
                    <div className="flex items-center gap-2">
                      {getIntegrationIcon(knowledgeSource.integrationType)}
                      <span className="capitalize">{knowledgeSource.integrationType}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Created At</p>
                    <p>{new Date(knowledgeSource.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Last Indexed</p>
                    <p>{new Date(knowledgeSource.lastIndexedAt).toLocaleDateString()}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium mb-3">Indexing Progress</p>
                    <div className="flex items-center gap-4">
                      <Progress value={knowledgeSource.indexingProgress} className="flex-1 h-2" />
                      <span className="text-lg font-semibold min-w-[3rem]">{knowledgeSource.indexingProgress}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {isAdmin && (
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <div className="flex flex-wrap gap-3">
                    <Button variant="outline" onClick={handleReload} className="flex-1 sm:flex-none">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reload Details
                    </Button>
                    <Button variant="outline" onClick={() => setShowShareDialog(true)} className="flex-1 sm:flex-none">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} className="flex-1 sm:flex-none">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
          <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>Share Knowledge Source</DialogTitle>
            </DialogHeader>
            
            <div className="flex items-start space-x-3 p-4 border rounded-lg bg-muted/50">
              <Checkbox
                id="share-org"
                checked={shareWithOrganization}
                onCheckedChange={(checked) => {
                  setShareWithOrganization(checked as boolean);
                  if (checked) {
                    setSelectedProjects([]);
                    setSelectedMembers([]);
                  }
                }}
                className="mt-1"
              />
              <div className="flex-1 min-w-0">
                <label
                  htmlFor="share-org"
                  className="text-base font-semibold cursor-pointer block"
                >
                  Share across Organisation
                </label>
                <p className="text-sm text-muted-foreground mt-1.5">
                  Make this knowledge source available to all members in your organization with view-only access. Members will not have permissions to reload, share, or delete this resource.
                </p>
              </div>
            </div>

            <Tabs defaultValue="projects" className="w-full flex-1 overflow-hidden flex flex-col">
              <TabsList className={`grid w-full grid-cols-2 ${shareWithOrganization ? 'opacity-50 pointer-events-none' : ''}`}>
                <TabsTrigger value="projects" disabled={shareWithOrganization}>Projects</TabsTrigger>
                <TabsTrigger value="members" disabled={shareWithOrganization}>Members</TabsTrigger>
              </TabsList>
              
              <TabsContent value="projects" className="mt-4 flex-1 overflow-hidden">
                <ScrollArea className="h-[300px] pr-4">
                  <div className={`space-y-2 ${shareWithOrganization ? 'opacity-50 pointer-events-none' : ''}`}>
                    {mockProjects.map((project) => (
                      <div key={project.id} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent/50">
                        <Checkbox
                          id={`project-${project.id}`}
                          checked={selectedProjects.includes(project.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedProjects([...selectedProjects, project.id]);
                            } else {
                              setSelectedProjects(selectedProjects.filter((id) => id !== project.id));
                            }
                          }}
                        />
                        <label
                          htmlFor={`project-${project.id}`}
                          className="text-sm cursor-pointer flex-1"
                        >
                          {project.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="members" className="mt-4 flex-1 overflow-hidden">
                <ScrollArea className="h-[300px] pr-4">
                  <div className={`space-y-2 ${shareWithOrganization ? 'opacity-50 pointer-events-none' : ''}`}>
                    {mockMembers.map((member) => (
                      <div key={member.id} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent/50">
                        <Checkbox
                          id={`member-${member.id}`}
                          checked={selectedMembers.includes(member.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedMembers([...selectedMembers, member.id]);
                            } else {
                              setSelectedMembers(selectedMembers.filter((id) => id !== member.id));
                            }
                          }}
                        />
                        <label
                          htmlFor={`member-${member.id}`}
                          className="text-sm cursor-pointer flex-1"
                        >
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-xs text-muted-foreground">{member.email}</p>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-2 pt-4 border-t mt-auto">
              <Button variant="outline" onClick={() => setShowShareDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleShare} 
                disabled={!shareWithOrganization && selectedProjects.length === 0 && selectedMembers.length === 0}
              >
                {shareWithOrganization 
                  ? 'Share with Organisation' 
                  : `Share (${selectedProjects.length + selectedMembers.length})`
                }
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default KnowledgeDetailView;
