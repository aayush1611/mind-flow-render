import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, FolderKanban, FileText } from "lucide-react";
import ChatInterface from "@/components/ChatInterface";
import ProjectsDashboard from "@/components/ProjectsDashboard";
import { InstructionManagement } from "@/components/InstructionManagement";

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("chat");

  useEffect(() => {
    if (location.pathname === "/projects") {
      setActiveTab("projects");
    } else if (location.pathname === "/instructions") {
      setActiveTab("instructions");
    } else {
      setActiveTab("chat");
    }
  }, [location.pathname]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "projects") {
      navigate("/projects");
    } else if (value === "instructions") {
      navigate("/instructions");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-card">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent" />
            <span className="text-xl font-bold">Agent Intelligence</span>
          </div>

          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList>
              <TabsTrigger value="chat">
                <MessageSquare className="w-4 h-4 mr-2" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="projects">
                <FolderKanban className="w-4 h-4 mr-2" />
                Projects
              </TabsTrigger>
              <TabsTrigger value="instructions">
                <FileText className="w-4 h-4 mr-2" />
                Instructions
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </nav>

      {activeTab === "chat" && <ChatInterface />}
      {activeTab === "projects" && <ProjectsDashboard />}
      {activeTab === "instructions" && <InstructionManagement />}
    </div>
  );
};

export default Index;
