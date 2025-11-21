import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Search,
  Folder,
  Database,
  ChevronDown,
  Code,
  Users,
  FileText,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import CreateProjectWizard from "./CreateProjectWizard";

interface Project {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  role: "admin" | "member";
}

const mockProjects: Project[] = [
  {
    id: "1",
    name: "AI Code Assistant Project Alpha",
    description: "Developing context-aware code suggestions using internal documentation databases.",
    icon: Code,
    role: "admin",
  },
  {
    id: "2",
    name: "Customer Data Platform Analysis",
    description: "Analyzing customer interaction logs stored in Azure DevOps for behavioral insights.",
    icon: Database,
    role: "member",
  },
  {
    id: "3",
    name: "Internal Documentation Q&A Bot",
    description: "Training the agent on internal PDF manuals and knowledge base articles.",
    icon: FileText,
    role: "admin",
  },
];

export default function ProjectsDashboard() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [searchQuery, setSearchQuery] = useState("");
  const [showWizard, setShowWizard] = useState(false);
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
      icon: Folder,
      role: "admin",
    };
    setProjects([...projects, newProject]);
    setShowWizard(false);
    setViewMode("list");
  };

  return (
    <div className="h-full bg-background overflow-auto">
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

      <main className="container mx-auto px-6 py-8">
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
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                            <project.icon className="w-5 h-5 text-white" />
                          </div>
                          <Badge variant={project.role === "admin" ? "default" : "secondary"}>
                            {project.role}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {project.description}
                        </CardDescription>
                      </CardHeader>
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
