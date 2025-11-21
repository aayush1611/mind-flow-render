import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import { Plus, Edit, Trash2, Link as LinkIcon, Server } from "lucide-react";
import TopNavigation from "@/components/TopNavigation";
import { cn } from "@/lib/utils";

interface McpServer {
  id: string;
  name: string;
  url: string;
  type: string;
  active: boolean;
}

const mockServers: McpServer[] = [
  {
    id: "1",
    name: "Production API",
    url: "https://api.production.com/mcp",
    type: "REST",
    active: true,
  },
  {
    id: "2",
    name: "Development Server",
    url: "https://dev.api.com/mcp",
    type: "GraphQL",
    active: false,
  },
];

const mockTools = [
  { id: "1", name: "query_database", description: "Execute SQL queries against the database", category: "Database" },
  { id: "2", name: "send_email", description: "Send emails to specified recipients", category: "Communication" },
  { id: "3", name: "create_user", description: "Create a new user account in the system", category: "User Management" },
  { id: "4", name: "upload_file", description: "Upload files to cloud storage", category: "Storage" },
  { id: "5", name: "fetch_analytics", description: "Retrieve analytics and metrics data", category: "Analytics" },
  { id: "6", name: "schedule_task", description: "Schedule a task for future execution", category: "Automation" },
];

const Mcp = () => {
  const [servers, setServers] = useState<McpServer[]>(mockServers);
  const [showForm, setShowForm] = useState(false);
  const [editingServer, setEditingServer] = useState<McpServer | null>(null);
  const [deleteServerId, setDeleteServerId] = useState<string | null>(null);
  const [showConnections, setShowConnections] = useState(false);
  const [showToolsPanel, setShowToolsPanel] = useState(false);
  const [activeServerId, setActiveServerId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    type: "REST",
    active: true,
  });

  const handleAddNew = () => {
    setEditingServer(null);
    setFormData({ name: "", url: "", type: "REST", active: true });
    setShowForm(true);
  };

  const handleEdit = (server: McpServer) => {
    setEditingServer(server);
    setFormData({
      name: server.name,
      url: server.url,
      type: server.type,
      active: server.active,
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setServers(servers.filter((s) => s.id !== id));
    setDeleteServerId(null);
  };

  const handleSubmit = () => {
    if (editingServer) {
      setServers(
        servers.map((s) =>
          s.id === editingServer.id
            ? { ...editingServer, ...formData }
            : s
        )
      );
    } else {
      setServers([
        ...servers,
        {
          id: Date.now().toString(),
          ...formData,
        },
      ]);
    }
    setShowForm(false);
    setFormData({ name: "", url: "", type: "REST", active: true });
  };

  const handleTestConnection = (serverId?: string) => {
    if (serverId) {
      setActiveServerId(serverId);
      setShowToolsPanel(true);
    } else {
      setShowConnections(true);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <TopNavigation activeTab="mcp" onTabChange={() => {}} />
      
      <div className="flex-1 overflow-auto">
        <div className="flex h-full">
          <div className={cn(
            "transition-all duration-300 p-6 overflow-auto",
            showToolsPanel ? "w-full lg:w-[70%]" : "w-full"
          )}>
            <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">MCP Servers</h1>
              <p className="text-muted-foreground mt-1">
                Manage your Model Context Protocol server connections
              </p>
            </div>
            <Button onClick={handleAddNew}>
              <Plus className="w-4 h-4 mr-2" />
              Add MCP Server
            </Button>
          </div>

          {!showForm && servers.length > 0 && (
            <div className={cn(
              "grid gap-4",
              showToolsPanel 
                ? "md:grid-cols-2" 
                : "md:grid-cols-2 lg:grid-cols-3"
            )}>
              {servers.map((server) => (
                <Card key={server.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Server className="w-5 h-5 text-primary" />
                        <CardTitle className="text-lg">{server.name}</CardTitle>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEdit(server)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => setDeleteServerId(server.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <LinkIcon className="w-4 h-4 text-muted-foreground" />
                      <span className="truncate text-muted-foreground">{server.url}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{server.type}</Badge>
                      <Badge variant={server.active ? "default" : "outline"}>
                        {server.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => handleTestConnection(server.id)}
                    >
                      Test Connection
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {showForm && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingServer ? "Edit MCP Server" : "Add New MCP Server"}
                </CardTitle>
                <CardDescription>
                  Configure your Model Context Protocol server connection
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Server Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter server name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="url">Server URL</Label>
                  <Input
                    id="url"
                    placeholder="https://api.example.com/mcp"
                    value={formData.url}
                    onChange={(e) =>
                      setFormData({ ...formData, url: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Server Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) =>
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="REST">REST API</SelectItem>
                      <SelectItem value="GraphQL">GraphQL</SelectItem>
                      <SelectItem value="WebSocket">WebSocket</SelectItem>
                      <SelectItem value="gRPC">gRPC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Server Status</Label>
                  <RadioGroup
                    value={formData.active ? "active" : "inactive"}
                    onValueChange={(value) =>
                      setFormData({ ...formData, active: value === "active" })
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="active" id="active" />
                      <Label htmlFor="active" className="cursor-pointer font-normal">
                        Active
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="inactive" id="inactive" />
                      <Label htmlFor="inactive" className="cursor-pointer font-normal">
                        Inactive
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => handleTestConnection()}
                    disabled={!formData.url}
                  >
                    Test Connection
                  </Button>
                  <Button onClick={handleSubmit} disabled={!formData.name || !formData.url}>
                    {editingServer ? "Update Server" : "Connect"}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowForm(false);
                      setEditingServer(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>

                {showConnections && (
                  <div className="border rounded-lg p-4 space-y-2 bg-muted/50">
                    <h4 className="font-medium text-sm">Available Connections</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Database Connection</span>
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Connected
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Authentication Service</span>
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Connected
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Storage Service</span>
                        <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                          Pending
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {!showForm && servers.length === 0 && (
            <Card className="py-12">
              <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
                <Server className="w-12 h-12 text-muted-foreground" />
                <div>
                  <h3 className="font-semibold text-lg">No MCP Servers</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Get started by adding your first MCP server connection
                  </p>
                </div>
                <Button onClick={handleAddNew}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add MCP Server
                </Button>
              </CardContent>
            </Card>
          )}
            </div>
          </div>

          {/* Tools Panel */}
          {showToolsPanel && (
            <div className="w-full lg:w-[30%] border-l bg-card overflow-auto">
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">Available Tools</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      {servers.find(s => s.id === activeServerId)?.name}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setShowToolsPanel(false);
                      setActiveServerId(null);
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </Button>
                </div>

                <div className="pb-4 border-b">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Tools</span>
                    <Badge variant="outline">{mockTools.length}</Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  {mockTools.map((tool) => (
                    <Card key={tool.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-medium text-sm truncate">{tool.name}</h3>
                              <Badge variant="secondary" className="text-xs shrink-0">
                                {tool.category}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {tool.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <AlertDialog open={!!deleteServerId} onOpenChange={() => setDeleteServerId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete MCP Server</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this MCP server? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteServerId && handleDelete(deleteServerId)}
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

export default Mcp;
