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
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("chat");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
        <div className="flex h-full relative">
          {/* Mobile hamburger button - hidden when sidebar is open */}
          {!isSidebarOpen && (
            <Button
              size="icon"
              variant="ghost"
              className="md:hidden fixed top-4 left-4 z-50"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}

          {/* Backdrop for mobile */}
          {isSidebarOpen && (
            <div 
              className="md:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <div className={`
            fixed md:relative inset-y-0 left-0 z-40
            transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            md:translate-x-0
          `}>
            <ChatHistorySidebar isMobileExpanded={isSidebarOpen} />
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
