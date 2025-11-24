import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  BookOpen,
  ChevronDown,
  FileText,
  type LucideIcon,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import CreateKnowledgeForm from "./CreateKnowledgeForm";

interface KnowledgeSource {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  status: "active" | "indexing" | "failed";
  provider?: string;
  repoUrl?: string;
  repoBranch?: string;
}

const mockKnowledgeSources: KnowledgeSource[] = [
  {
    id: "1",
    name: "Product Documentation",
    description: "Complete product documentation and user guides for all our software products.",
    icon: FileText,
    status: "active",
  },
  {
    id: "2",
    name: "Customer Support KB",
    description: "Knowledge base articles and common questions from customer support team.",
    icon: BookOpen,
    status: "indexing",
  },
  {
    id: "3",
    name: "Training Materials",
    description: "Internal training materials and onboarding documentation for new employees.",
    icon: FileText,
    status: "active",
  },
];

export default function KnowledgeDashboard() {
  const navigate = useNavigate();
  const [knowledgeSources, setKnowledgeSources] = useState<KnowledgeSource[]>(mockKnowledgeSources);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "form">("list");

  const filteredSources = knowledgeSources.filter(
    (k) =>
      k.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateKnowledge = (knowledgeData: {
    name: string;
    description: string;
    provider: string;
    repoUrl: string;
    repoBranch: string;
    patToken?: string;
  }) => {
    const newKnowledge: KnowledgeSource = {
      id: Date.now().toString(),
      name: knowledgeData.name,
      description: knowledgeData.description,
      icon: FileText,
      status: "indexing",
      provider: knowledgeData.provider,
      repoUrl: knowledgeData.repoUrl,
      repoBranch: knowledgeData.repoBranch,
    };
    setKnowledgeSources([...knowledgeSources, newKnowledge]);
    setViewMode("list");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
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
    <div className="h-full bg-background overflow-auto">
      {viewMode === "form" ? (
        <div className="container mx-auto px-6 py-8">
          <CreateKnowledgeForm
            onClose={() => setViewMode("list")}
            onComplete={handleCreateKnowledge}
          />
        </div>
      ) : (
        <main className="container mx-auto px-6 py-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search knowledge sources..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      Sort by <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                    <Button onClick={() => setViewMode("form")}>
                      <Plus className="w-4 h-4 mr-2" />
                      New Source
                    </Button>
                  </div>
                </div>

                {filteredSources.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
                      <BookOpen className="w-12 h-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No knowledge sources yet</h3>
                    <p className="text-muted-foreground max-w-md mb-6">
                      Add your first knowledge source to get started with AI-powered insights
                    </p>
                    <Button onClick={() => setViewMode("form")}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Knowledge Source
                    </Button>
                  </div>
                )}

                {filteredSources.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold">Your Knowledge Sources</h2>
                      <p className="text-sm text-muted-foreground">
                        {filteredSources.length} source{filteredSources.length !== 1 && "s"}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredSources.map((source) => (
                        <Card
                          key={source.id}
                          className="hover:shadow-hover transition-shadow cursor-pointer"
                          onClick={() => navigate(`/knowledge/${source.id}`)}
                        >
                          <CardHeader>
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                                <source.icon className="w-5 h-5 text-white" />
                              </div>
                              <Badge variant="outline" className={getStatusColor(source.status)}>
                                {source.status === "active" && <Check className="h-3 w-3 mr-1" />}
                                {source.status === "active" ? "Indexed" : source.status}
                              </Badge>
                            </div>
                            <CardTitle className="text-lg">{source.name}</CardTitle>
                            <CardDescription className="line-clamp-2">
                              {source.description}
                            </CardDescription>
                          </CardHeader>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
          </main>
      )}
    </div>
  );
}
