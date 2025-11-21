import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Plus,
  Search,
  Filter,
  MessageSquare,
  Loader2,
  CheckCircle2,
  MoreVertical,
  Settings,
  FolderKanban,
  BookOpen,
  Shield,
  FileText,
  ChevronDown,
  Sun,
  Moon,
  Trash2,
  Network,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Chat {
  id: string;
  title: string;
  timestamp: string;
  status: "streaming" | "completed" | "idle";
  unreadCount?: number;
  isRead?: boolean;
}

const mockChats: Chat[] = [
  { id: "1", title: "Q3 Marketing Strategy", timestamp: "2h ago", status: "completed", isRead: false },
  { id: "2", title: "Financial Projections 2024", timestamp: "5h ago", status: "completed", isRead: true },
  { id: "3", title: "Customer Support Automation", timestamp: "1d ago", status: "completed", unreadCount: 2, isRead: false },
  { id: "4", title: "Meeting Minutes - 07/15", timestamp: "2d ago", status: "idle", isRead: true },
];

const mockProjects = [
  { id: "1", name: "Project Alpha", role: "admin" as const },
  { id: "2", name: "Project Beta", role: "member" as const },
  { id: "3", name: "Project Gamma", role: "admin" as const },
];

interface ChatHistorySidebarProps {
  isMobileExpanded?: boolean;
}

export default function ChatHistorySidebar({ isMobileExpanded = false }: ChatHistorySidebarProps) {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [selectedChatId, setSelectedChatId] = useState("3");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrg, setSelectedOrg] = useState("Acme Corp");
  const [openPopup, setOpenPopup] = useState<string | null>(null);
  const [projects, setProjects] = useState(mockProjects);

  const filteredChats = mockChats.filter((chat) =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const organizations = ["Acme Corp", "Tech Industries", "Global Solutions"];

  const handleDeleteProject = (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setProjects(projects.filter(p => p.id !== projectId));
  };

  const renderPopupContent = () => {
    switch (openPopup) {
      case 'settings':
        return (
          <div className="h-full flex flex-col">
            <div className="p-3 border-b">
              <h3 className="font-semibold text-sm">Settings</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              <div className="flex flex-col gap-1">
                <Button
                  variant="ghost"
                  className="justify-start text-sm"
                  onClick={() => console.log("Doffle clicked")}
                >
                  Doffle
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start text-sm"
                  onClick={() => navigate("/memories")}
                >
                  Memories
                </Button>
              </div>
            </div>
          </div>
        );
      case 'instruction':
        return (
          <div className="h-full flex flex-col">
            <div className="p-3 border-b">
              <h3 className="font-semibold text-sm">Instructions</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-sm"
                onClick={() => navigate("/instructions")}
              >
                Manage Instructions
              </Button>
            </div>
          </div>
        );
      case 'project':
        return (
          <div className="h-full flex flex-col">
            <div className="p-3 border-b">
              <h3 className="font-semibold text-sm">Projects</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              <div className="flex flex-col gap-1">
                {projects.map((project) => (
                  <div 
                    key={project.id}
                    className="group flex items-center gap-2 hover:bg-accent rounded-md transition-colors"
                  >
                    <Button 
                      variant="ghost" 
                      className="flex-1 justify-start text-sm"
                      onClick={() => navigate(`/projects/${project.id}`)}
                    >
                      {project.name}
                    </Button>
                    {project.role === "admin" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                        onClick={(e) => handleDeleteProject(project.id, e)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'knowledge':
        return (
          <div className="h-full flex flex-col">
            <div className="p-3 border-b">
              <h3 className="font-semibold text-sm">Knowledge</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-sm"
                onClick={() => navigate("/knowledge")}
              >
                Manage Knowledge Sources
              </Button>
            </div>
          </div>
        );
      case 'rules':
        return (
          <div className="h-full flex flex-col">
            <div className="p-3 border-b">
              <h3 className="font-semibold text-sm">Rules</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-sm"
                onClick={() => navigate("/rules")}
              >
                Manage Rules
              </Button>
            </div>
          </div>
        );
      case 'mcp':
        return (
          <div className="h-full flex flex-col">
            <div className="p-3 border-b">
              <h3 className="font-semibold text-sm">MCP Servers</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-sm"
                onClick={() => navigate("/mcp")}
              >
                Manage MCP Servers
              </Button>
            </div>
          </div>
        );
      case 'chats':
        return (
          <div className="h-full flex flex-col">
            <div className="p-3 border-b">
              <h3 className="font-semibold text-sm">Recent Chats</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              <div className="flex flex-col">
                {mockChats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => {
                      setSelectedChatId(chat.id);
                    }}
                    className={cn(
                      "w-full py-2 px-2 flex items-center gap-3 hover:bg-accent transition-colors rounded-md",
                      selectedChatId === chat.id && "bg-primary/10"
                    )}
                  >
                    <div className="relative shrink-0">
                      {chat.status === "completed" && !chat.isRead ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <>
                          <MessageSquare className="w-4 h-4 text-muted-foreground" />
                          {chat.status === "streaming" && (
                            <div className="absolute -top-1 -right-1 w-3 h-3">
                              <Loader2 className="w-3 h-3 text-blue-500 animate-spin" />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-sm font-medium truncate">{chat.title}</p>
                      <p className="text-xs text-muted-foreground">{chat.timestamp}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className="relative flex"
      onMouseLeave={() => !isMobileExpanded && setOpenPopup(null)}
    >
      <aside 
        className={cn(
          "bg-card border-r flex flex-col h-screen py-4 gap-4 transition-all duration-300",
          isMobileExpanded ? "w-64 px-4" : "w-16 items-center"
        )}
      >
        {/* New Chat */}
        <Button
          size={isMobileExpanded ? "default" : "icon"}
          className={cn("shrink-0", isMobileExpanded && "w-full justify-start")}
          onClick={() => {
            setSelectedChatId("");
            navigate("/");
          }}
        >
          <Plus className="w-5 h-5" />
          {isMobileExpanded && <span className="ml-2">New Chat</span>}
        </Button>

        {/* Settings */}
        <Button 
          variant="ghost" 
          size={isMobileExpanded ? "default" : "icon"}
          className={cn("shrink-0", isMobileExpanded && "w-full justify-start")}
          onMouseEnter={() => !isMobileExpanded && setOpenPopup('settings')}
          onClick={() => isMobileExpanded && console.log("Settings clicked")}
        >
          <Settings className="w-5 h-5" />
          {isMobileExpanded && <span className="ml-2">Settings</span>}
        </Button>

        {/* Instruction */}
        <Button 
          variant="ghost" 
          size={isMobileExpanded ? "default" : "icon"}
          className={cn("shrink-0", isMobileExpanded && "w-full justify-start")}
          onMouseEnter={() => !isMobileExpanded && setOpenPopup('instruction')}
          onClick={() => navigate('/instructions')}
        >
          <FileText className="w-5 h-5" />
          {isMobileExpanded && <span className="ml-2">Instructions</span>}
        </Button>

        {/* Project */}
        <Button 
          variant="ghost" 
          size={isMobileExpanded ? "default" : "icon"}
          className={cn("shrink-0", isMobileExpanded && "w-full justify-start")}
          onMouseEnter={() => !isMobileExpanded && setOpenPopup('project')}
          onClick={() => navigate('/projects')}
        >
          <FolderKanban className="w-5 h-5" />
          {isMobileExpanded && <span className="ml-2">Projects</span>}
        </Button>

        {/* Knowledge */}
        <Button 
          variant="ghost" 
          size={isMobileExpanded ? "default" : "icon"}
          className={cn("shrink-0", isMobileExpanded && "w-full justify-start")}
          onMouseEnter={() => !isMobileExpanded && setOpenPopup('knowledge')}
          onClick={() => navigate('/knowledge')}
        >
          <BookOpen className="w-5 h-5" />
          {isMobileExpanded && <span className="ml-2">Knowledge</span>}
        </Button>

        {/* Rules */}
        <Button 
          variant="ghost" 
          size={isMobileExpanded ? "default" : "icon"}
          className={cn("shrink-0", isMobileExpanded && "w-full justify-start")}
          onMouseEnter={() => !isMobileExpanded && setOpenPopup('rules')}
          onClick={() => navigate('/rules')}
        >
          <Shield className="w-5 h-5" />
          {isMobileExpanded && <span className="ml-2">Rules</span>}
        </Button>

        {/* MCP */}
        <Button 
          variant="ghost" 
          size={isMobileExpanded ? "default" : "icon"}
          className={cn("shrink-0", isMobileExpanded && "w-full justify-start")}
          onMouseEnter={() => !isMobileExpanded && setOpenPopup('mcp')}
          onClick={() => navigate('/mcp')}
        >
          <Network className="w-5 h-5" />
          {isMobileExpanded && <span className="ml-2">MCP</span>}
        </Button>

        <div className={cn("bg-border my-2", isMobileExpanded ? "w-full h-px" : "w-8 h-px")} />

        {/* Chats - show button on desktop, list on mobile */}
        {isMobileExpanded ? (
          <div className="flex-1 flex flex-col gap-2 min-h-0 overflow-hidden w-full">
            <div className="px-1 shrink-0">
              <h3 className="font-semibold text-sm mb-2">Recent Chats</h3>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-9"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-1 pb-4">
              <div className="flex flex-col gap-1">
                {filteredChats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => {
                      setSelectedChatId(chat.id);
                    }}
                    className={cn(
                      "w-full py-2.5 px-3 flex items-center gap-3 hover:bg-accent transition-colors rounded-md",
                      selectedChatId === chat.id && "bg-primary/10"
                    )}
                  >
                    <div className="relative shrink-0">
                      {chat.status === "completed" && !chat.isRead ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <>
                          <MessageSquare className="w-4 h-4 text-muted-foreground" />
                          {chat.status === "streaming" && (
                            <div className="absolute -top-1 -right-1 w-3 h-3">
                              <Loader2 className="w-3 h-3 text-blue-500 animate-spin" />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-sm font-medium truncate">{chat.title}</p>
                      <p className="text-xs text-muted-foreground">{chat.timestamp}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <Button 
            variant="ghost" 
            size="icon"
            className="shrink-0"
            onMouseEnter={() => setOpenPopup('chats')}
          >
            <MessageSquare className="w-5 h-5" />
          </Button>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size={isMobileExpanded ? "default" : "icon"}
          className={cn("shrink-0", isMobileExpanded && "w-full justify-start")}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
          {isMobileExpanded && <span className="ml-2">{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>}
        </Button>

        {/* Organization Switcher */}
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              size={isMobileExpanded ? "default" : "icon"}
              className={cn("shrink-0 relative", isMobileExpanded && "w-full justify-start")}
            >
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {selectedOrg.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {isMobileExpanded && <span className="ml-2">{selectedOrg}</span>}
              <ChevronDown className={cn("w-3 h-3 bg-card rounded-full", isMobileExpanded ? "ml-auto" : "absolute -bottom-1 -right-1")} />
            </Button>
          </PopoverTrigger>
          <PopoverContent side={isMobileExpanded ? "bottom" : "right"} className="w-64 p-2" sideOffset={8}>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground px-2 py-1">Switch Organization</p>
              <div className="flex flex-col gap-1">
                {organizations.map((org) => (
                  <Button
                    key={org}
                    variant={selectedOrg === org ? "secondary" : "ghost"}
                    className="justify-start text-sm"
                    onClick={() => setSelectedOrg(org)}
                  >
                    {org}
                  </Button>
                ))}
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="px-2 py-1">
                  <p className="text-xs text-muted-foreground">John Doe</p>
                </div>
                <Button variant="ghost" className="w-full justify-start text-sm text-primary">
                  Sign out
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </aside>

      {/* Single Popup Container - hidden on mobile expanded */}
      {openPopup && !isMobileExpanded && (
        <div 
          className={cn(
            "fixed left-16 top-0 h-screen bg-popover border-r shadow-md z-50",
            openPopup === 'chats' ? "w-80" : "w-64"
          )}
        >
          {renderPopupContent()}
        </div>
      )}
    </div>
  );
}
