import { useState } from "react";
import { useLocation } from "react-router-dom";
import ChatInterface from "@/components/ChatInterface";
import ProjectsDashboard from "@/components/ProjectsDashboard";
import { InstructionManagement } from "@/components/InstructionManagement";
import ChatHistorySidebar from "@/components/ChatHistorySidebar";
import ProjectDetailView from "@/components/ProjectDetailView";
import KnowledgeDashboard from "@/components/KnowledgeDashboard";
import KnowledgeDetailView from "@/components/KnowledgeDetailView";
import RulesDashboard from "@/components/RulesDashboard";
import Mcp from "@/pages/Mcp";
import Memories from "@/pages/Memories";
import ChatThreads from "@/pages/ChatThreads";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const Index = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [chatKey, setChatKey] = useState(0);
  const isProjectDetailView = location.pathname.match(/^\/projects\/[^/]+$/);
  const isKnowledgeDetailView = location.pathname.match(/^\/knowledge\/[^/]+$/);
  const isChatThreadsView = location.pathname === "/chatThreads";

  const handleNewChat = () => {
    setChatKey(prev => prev + 1);
  };

  // If viewing a specific detail page, render without sidebar
  if (isProjectDetailView) {
    return <ProjectDetailView />;
  }
  if (isKnowledgeDetailView) {
    return <KnowledgeDetailView />;
  }
  if (isChatThreadsView) {
    return <ChatThreads />;
  }

  return (
    <div className="h-screen bg-background">
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

        {/* Sidebar - Always visible */}
        <div className={`
          fixed md:relative inset-y-0 left-0 z-40
          transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}>
          <ChatHistorySidebar isMobileExpanded={isSidebarOpen} onNewChat={handleNewChat} />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto">
          {location.pathname === "/" && <ChatInterface key={chatKey} />}
          {location.pathname === "/projects" && <ProjectsDashboard />}
          {location.pathname === "/instructions" && <InstructionManagement />}
          {location.pathname === "/knowledge" && <KnowledgeDashboard />}
          {location.pathname === "/rules" && <RulesDashboard />}
          {location.pathname === "/mcp" && <Mcp />}
          {location.pathname === "/memories" && <Memories />}
        </div>
      </div>
    </div>
  );
};

export default Index;
