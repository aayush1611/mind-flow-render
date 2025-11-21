import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ChatInterface from "@/components/ChatInterface";
import ProjectsDashboard from "@/components/ProjectsDashboard";
import { InstructionManagement } from "@/components/InstructionManagement";
import TopNavigation from "@/components/TopNavigation";
import ChatHistorySidebar from "@/components/ChatHistorySidebar";
import ProjectDetailView from "@/components/ProjectDetailView";
import KnowledgeDashboard from "@/components/KnowledgeDashboard";
import KnowledgeDetailView from "@/components/KnowledgeDetailView";
import RulesDashboard from "@/components/RulesDashboard";

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("chat");
  const isProjectDetailView = location.pathname.match(/^\/projects\/[^/]+$/);
  const isKnowledgeDetailView = location.pathname.match(/^\/knowledge\/[^/]+$/);

  useEffect(() => {
    if (location.pathname === "/projects" || location.pathname.startsWith("/projects/")) {
      setActiveTab("projects");
    } else if (location.pathname === "/instructions") {
      setActiveTab("instructions");
    } else if (location.pathname === "/knowledge" || location.pathname.startsWith("/knowledge/")) {
      setActiveTab("knowledge");
    } else if (location.pathname === "/rules") {
      setActiveTab("rules");
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
    } else if (value === "knowledge") {
      navigate("/knowledge");
    } else if (value === "rules") {
      navigate("/rules");
    } else {
      navigate("/");
    }
  };

  // If viewing a specific detail page, render without sidebar
  if (isProjectDetailView) {
    return <ProjectDetailView />;
  }
  if (isKnowledgeDetailView) {
    return <KnowledgeDetailView />;
  }

  return (
    <div className="h-screen bg-background">
      {activeTab === "chat" ? (
        <div className="flex h-full">
          <div className="hidden md:block">
            <ChatHistorySidebar />
          </div>
          <div className="flex-1 overflow-auto">
            <ChatInterface />
          </div>
        </div>
      ) : (
        <div className="flex h-full">
          <div className="flex-1 flex flex-col min-w-0">
            <TopNavigation activeTab={activeTab} onTabChange={handleTabChange} />
            <div className="flex-1 overflow-auto">
              {activeTab === "projects" && <ProjectsDashboard />}
              {activeTab === "instructions" && <InstructionManagement />}
              {activeTab === "knowledge" && <KnowledgeDashboard />}
              {activeTab === "rules" && <RulesDashboard />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
