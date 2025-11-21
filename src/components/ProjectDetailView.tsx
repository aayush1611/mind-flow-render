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
  UserPlus, 
  Plus,
  FileText,
  Users
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface KnowledgeSource {
  id: string;
  name: string;
  status: "indexing" | "completed" | "failed";
  indexedPercentage: number;
  createdAt: string;
}

interface Member {
  id: string;
  name: string;
  email: string;
  role: "admin" | "member";
}

const ProjectDetailView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [projectName, setProjectName] = useState("AI Research Project");
  const [projectDescription, setProjectDescription] = useState("Advanced machine learning research and development project focusing on natural language processing.");
  
  // Mock current user role - in real app, this would come from auth
  const currentUserRole = "member" as "admin" | "member"; // Change to "admin" to test admin view
  const isAdmin = currentUserRole === "admin";

  // Mock data
  const [knowledgeSources] = useState<KnowledgeSource[]>([
    {
      id: "1",
      name: "Research Papers Dataset",
      status: "completed",
      indexedPercentage: 100,
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      name: "Documentation Files",
      status: "indexing",
      indexedPercentage: 65,
      createdAt: "2024-01-18",
    },
    {
      id: "3",
      name: "Training Data",
      status: "completed",
      indexedPercentage: 100,
      createdAt: "2024-01-10",
    },
  ]);

  const [members] = useState<Member[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "admin",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "member",
    },
    {
      id: "3",
      name: "Bob Johnson",
      email: "bob@example.com",
      role: "member",
    },
  ]);

  const handleSaveProject = () => {
    // Save project changes
    setIsEditingProject(false);
  };

  const handleDeleteKnowledgeSource = (sourceId: string) => {
    if (!isAdmin) return;
    console.log("Deleting knowledge source:", sourceId);
  };

  const handleChangeRole = (memberId: string, newRole: string) => {
    if (!isAdmin) return;
    console.log("Changing role for member:", memberId, "to:", newRole);
  };

  const handleDeleteProject = () => {
    if (!isAdmin) return;
    console.log("Deleting project:", id);
    navigate("/projects");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "indexing":
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
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/projects")}
              className="mt-1"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div className="flex-1">
              {isEditingProject ? (
                <div className="space-y-3">
                  <Input
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="text-2xl font-bold h-auto py-2"
                  />
                  <Textarea
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    className="resize-none"
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleSaveProject} size="sm">
                      Save Changes
                    </Button>
                    <Button
                      onClick={() => setIsEditingProject(false)}
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
                    <h1 className="text-3xl font-bold">{projectName}</h1>
                    {isAdmin && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsEditingProject(true)}
                        className="h-8 w-8"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <p className="text-muted-foreground mt-2">{projectDescription}</p>
                </div>
              )}
            </div>
          </div>

          {isAdmin && (
            <Button
              variant="destructive"
              onClick={handleDeleteProject}
              className="ml-4"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Project
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Knowledge Sources Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Knowledge Sources
                  </CardTitle>
                  {isAdmin && (
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Source
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {knowledgeSources.map((source) => (
                  <div
                    key={source.id}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{source.name}</h3>
                          <Badge
                            variant="outline"
                            className={getStatusColor(source.status)}
                          >
                            {source.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Added on {new Date(source.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {isAdmin && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteKnowledgeSource(source.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Indexing Progress</span>
                        <span className="font-medium">{source.indexedPercentage}%</span>
                      </div>
                      <Progress value={source.indexedPercentage} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Members Section */}
          <div>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Members
                  </CardTitle>
                  {isAdmin && (
                    <Button size="sm" variant="outline">
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="border rounded-lg p-3 space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                    
                    {isAdmin ? (
                      <Select
                        value={member.role}
                        onValueChange={(value) => handleChangeRole(member.id, value)}
                      >
                        <SelectTrigger className="w-full h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="member">Member</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge variant="secondary" className="capitalize">
                        {member.role}
                      </Badge>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailView;
