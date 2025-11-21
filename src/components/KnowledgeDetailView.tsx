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
  Plus,
  FileText,
  Upload
} from "lucide-react";

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
    navigate("/knowledge");
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
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/knowledge")}
              className="mt-1"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div className="flex-1">
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
          </div>

          <Button
            variant="destructive"
            onClick={handleDelete}
            className="ml-4"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Source
          </Button>
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
      </div>
    </div>
  );
};

export default KnowledgeDetailView;
