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
      {activeTab === "chat" && <ChatInterface />}
      {activeTab === "projects" && <ProjectsDashboard />}
      {activeTab === "instructions" && <InstructionManagement />}
    </div>
  );
};

export default Index;
