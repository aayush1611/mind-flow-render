import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  Edit2, 
  Trash2, 
  RefreshCw,
  Share2,
  FileText,
  Upload,
  Github,
  GitBranch
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  status: "indexed" | "processing" | "failed";
}

const KnowledgeDetailView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("Product Documentation");
  const [description, setDescription] = useState("Complete product documentation and user guides for all our software products.");
  const [showShareDialog, setShowShareDialog] = useState(false);
  
  // Mock data - replace with actual data
  const isAdmin = true;
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
  
  const mockProjects = [
    { id: "1", name: "AI Assistant Project" },
    { id: "2", name: "Dashboard Analytics" },
    { id: "3", name: "Mobile App" }
  ];
  
  const mockMembers = [
    { id: "1", name: "John Doe", email: "john@example.com" },
    { id: "2", name: "Jane Smith", email: "jane@example.com" },
    { id: "3", name: "Bob Johnson", email: "bob@example.com" }
  ];
  
  const [documents] = useState<Document[]>([
    {
      id: "1",
      name: "User Manual v2.0.pdf",
      type: "PDF",
      size: "2.4 MB",
      uploadedAt: "2024-01-15",
      status: "indexed",
    },
    {
      id: "2",
      name: "API Documentation.md",
      type: "Markdown",
      size: "156 KB",
      uploadedAt: "2024-01-18",
      status: "processing",
    },
    {
      id: "3",
      name: "Quick Start Guide.pdf",
      type: "PDF",
      size: "980 KB",
      uploadedAt: "2024-01-10",
      status: "indexed",
    },
  ]);

  const handleSave = () => {
    setIsEditing(false);
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
    toast({
      title: "Knowledge source shared",
      description: `Shared with ${selectedProjects.length} projects and ${selectedMembers.length} members.`
    });
    setShowShareDialog(false);
    setSelectedProjects([]);
    setSelectedMembers([]);
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

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
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
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsEditing(true)}
                      className="h-8 w-8"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-muted-foreground mt-2">{description}</p>
                </div>
              )}
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <div className="lg:col-span-3">
                    <p className="text-sm text-muted-foreground mb-2">Indexing Progress</p>
                    <div className="flex items-center gap-3">
                      <Progress value={knowledgeSource.indexingProgress} className="flex-1" />
                      <span className="text-sm font-medium">{knowledgeSource.indexingProgress}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {isAdmin && (
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleReload}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reload Details
                </Button>
                <Button variant="outline" onClick={() => setShowShareDialog(true)}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Documents
              </CardTitle>
              <Button size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="border rounded-lg p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{doc.name}</h3>
                      <Badge
                        variant="outline"
                        className={getStatusColor(doc.status)}
                      >
                        {doc.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span>{doc.type}</span>
                      <span>{doc.size}</span>
                      <span>Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Share Knowledge Source</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div>
                <h3 className="text-sm font-medium mb-3">Share with Projects</h3>
                <div className="space-y-2">
                  {mockProjects.map((project) => (
                    <div key={project.id} className="flex items-center space-x-2">
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
                        className="text-sm cursor-pointer"
                      >
                        {project.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-3">Share with Members</h3>
                <div className="space-y-2">
                  {mockMembers.map((member) => (
                    <div key={member.id} className="flex items-center space-x-2">
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
                        className="text-sm cursor-pointer"
                      >
                        <div>
                          <p>{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.email}</p>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowShareDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleShare}>
                  Share
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default KnowledgeDetailView;
