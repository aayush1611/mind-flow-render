import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Search,
  Folder,
  Database,
  Clock,
  Eye,
  MessageSquare,
  ChevronDown,
  Github,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import CreateProjectWizard from "./CreateProjectWizard";

interface Project {
  id: string;
  name: string;
  description: string;
  sources: number;
  lastActivity: string;
}

const mockProjects: Project[] = [
  {
    id: "1",
    name: "AI Code Assistant Project Alpha",
    description: "Developing context-aware code suggestions using internal documentation databases.",
    sources: 3,
    lastActivity: "11/16/2025",
  },
  {
    id: "2",
    name: "Customer Data Platform Analysis",
    description: "Analyzing customer interaction logs stored in Azure DevOps for behavioral insights.",
    sources: 1,
    lastActivity: "11/15/2025",
  },
  {
    id: "3",
    name: "Internal Documentation Q&A Bot",
    description: "Training the agent on internal PDF manuals and knowledge base articles.",
    sources: 4,
    lastActivity: "11/17/2025",
  },
];

export default function ProjectsDashboard() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [searchQuery, setSearchQuery] = useState("");
  const [showWizard, setShowWizard] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [isAddingSource, setIsAddingSource] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "wizard">("list");

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateProject = (projectData: { name: string; description: string }) => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: projectData.name,
      description: projectData.description,
      sources: 0,
      lastActivity: new Date().toLocaleDateString(),
    };
    setProjects([...projects, newProject]);
    setShowWizard(false);
    setViewMode("list");
  };

  return (
    <div className="min-h-screen bg-background">
      {viewMode === "wizard" ? (
        <div className="container mx-auto px-6 py-8">
          <CreateProjectWizard
            onClose={() => setViewMode("list")}
            onComplete={handleCreateProject}
          />
        </div>
      ) : (
        <>
          {showWizard && (
            <CreateProjectWizard
              onClose={() => setShowWizard(false)}
              onComplete={handleCreateProject}
            />
          )}
          <header className="border-b bg-card">
            <div className="container mx-auto px-6 py-6">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Folder className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Projects Dashboard</h1>
                  <p className="text-muted-foreground">
                    Manage your projects and knowledge sources in one place
                  </p>
                </div>
              </div>
            </div>
          </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <Folder className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{projects.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Knowledge Sources</CardTitle>
              <Database className="w-4 h-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {projects.reduce((sum, p) => sum + p.sources, 0)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Activity</CardTitle>
              <Clock className="w-4 h-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{projects[projects.length - 1]?.name}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {projects[projects.length - 1]?.lastActivity}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList>
            <TabsTrigger value="projects">
              <Folder className="w-4 h-4 mr-2" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="sources">
              <Database className="w-4 h-4 mr-2" />
              Sources
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  Sort by <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
                <Button onClick={() => setViewMode("wizard")}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
                </Button>
              </div>
            </div>

            {filteredProjects.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
                  <Folder className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Looking to start a project?</h3>
                <p className="text-muted-foreground max-w-md mb-6">
                  Upload materials, set custom instructions, and organize conversations in one space.
                </p>
                <Button onClick={() => setShowWizard(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  New project
                </Button>
              </div>
            )}

            {filteredProjects.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Your Projects</h2>
                  <p className="text-sm text-muted-foreground">
                    {filteredProjects.length} project{filteredProjects.length !== 1 && "s"} created
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProjects.map((project) => (
                    <Card
                      key={project.id}
                      className="hover:shadow-hover transition-shadow cursor-pointer"
                    >
                      <CardHeader>
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {project.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Database className="w-4 h-4" />
                            {project.sources} sources
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {project.lastActivity}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button className="flex-1">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Chat
                          </Button>
                          <Button variant="outline" size="icon">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>

                        {selectedProject === project.id && isAddingSource && (
                          <div className="pt-4 border-t space-y-3">
                            <p className="text-sm font-medium">Add Knowledge Source</p>
                            <div className="space-y-2">
                              <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => setIsAddingSource(false)}
                              >
                                <Github className="w-4 h-4 mr-2" />
                                Connect GitHub Repository
                              </Button>
                              <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => setIsAddingSource(false)}
                              >
                                <Database className="w-4 h-4 mr-2" />
                                Connect Azure DevOps
                              </Button>
                              <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => setIsAddingSource(false)}
                              >
                                <FileText className="w-4 h-4 mr-2" />
                                Upload Documents
                              </Button>
                            </div>
                          </div>
                        )}

                        {!isAddingSource && (
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => {
                              setSelectedProject(project.id);
                              setIsAddingSource(true);
                            }}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Source
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="sources">
            <div className="text-center py-16">
              <Database className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No sources yet</h3>
              <p className="text-muted-foreground">
                Connect knowledge sources to your projects to get started
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
        </>
      )}
    </div>
  );
}
