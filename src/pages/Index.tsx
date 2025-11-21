import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ChatInterface from "@/components/ChatInterface";
import ProjectsDashboard from "@/components/ProjectsDashboard";
import { InstructionManagement } from "@/components/InstructionManagement";
import TopNavigation from "@/components/TopNavigation";
import ChatHistorySidebar from "@/components/ChatHistorySidebar";
import ProjectDetailView from "@/components/ProjectDetailView";

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("chat");
  const isProjectDetailView = location.pathname.match(/^\/projects\/[^/]+$/);

  useEffect(() => {
    if (location.pathname === "/projects" || location.pathname.startsWith("/projects/")) {
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

  // If viewing a specific project detail, render ProjectDetailView without sidebar
  if (isProjectDetailView) {
    return <ProjectDetailView />;
  }

  return (
    <div className="h-screen bg-background">
      {activeTab === "chat" ? (
        <div className="flex h-full">
          <ChatHistorySidebar />
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
