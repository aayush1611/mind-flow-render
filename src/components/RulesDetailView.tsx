import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  ArrowLeft, 
  Edit2, 
  Trash2,
  Shield,
  AlertTriangle
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const RulesDetailView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("Data Privacy Policy");
  const [description, setDescription] = useState("Ensure all customer data is handled according to GDPR and privacy regulations.");
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("high");

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleDelete = () => {
    navigate("/rules");
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "low":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
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
              onClick={() => navigate("/rules")}
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
                    <Badge variant="outline" className={getPriorityColor(priority)}>
                      {priority} priority
                    </Badge>
                    <Badge variant={status === "active" ? "default" : "secondary"}>
                      {status}
                    </Badge>
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
            Delete Rule
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Rule Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Status</p>
                  <p className="text-sm text-muted-foreground">Enable or disable this rule</p>
                </div>
                <Switch
                  checked={status === "active"}
                  onCheckedChange={(checked) => setStatus(checked ? "active" : "inactive")}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Priority Level</label>
                <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Higher priority rules are enforced first
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Enforcement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-lg p-4 bg-muted/30">
                <p className="text-sm font-medium mb-2">Active Projects</p>
                <p className="text-2xl font-bold">3</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Projects where this rule is enforced
                </p>
              </div>
              <div className="border rounded-lg p-4 bg-muted/30">
                <p className="text-sm font-medium mb-2">Violations</p>
                <p className="text-2xl font-bold">0</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Rule violations in the last 30 days
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RulesDetailView;
