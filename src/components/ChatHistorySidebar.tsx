import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

export default function ChatHistorySidebar() {
  const navigate = useNavigate();
  const [selectedChatId, setSelectedChatId] = useState("3");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrg, setSelectedOrg] = useState("Acme Corp");
  const [openPopup, setOpenPopup] = useState<string | null>(null);

  const filteredChats = mockChats.filter((chat) =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const organizations = ["Acme Corp", "Tech Industries", "Global Solutions"];

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
                  onClick={() => console.log("Memories clicked")}
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
                <Button variant="ghost" className="justify-start text-sm" onClick={() => navigate("/projects")}>
                  Project Alpha
                </Button>
                <Button variant="ghost" className="justify-start text-sm" onClick={() => navigate("/projects")}>
                  Project Beta
                </Button>
                <Button variant="ghost" className="justify-start text-sm" onClick={() => navigate("/projects")}>
                  Project Gamma
                </Button>
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
            <div className="flex-1 overflow-y-auto p-3">
              <p className="text-xs text-muted-foreground">No knowledge sources yet</p>
            </div>
          </div>
        );
      case 'rules':
        return (
          <div className="h-full flex flex-col">
            <div className="p-3 border-b">
              <h3 className="font-semibold text-sm">Rules</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              <p className="text-xs text-muted-foreground">No rules configured</p>
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
    <div className="relative flex">
      <aside 
        className="bg-card border-r flex flex-col h-screen w-16 items-center py-4 gap-4"
        onMouseLeave={() => setOpenPopup(null)}
      >
        {/* New Chat */}
        <Button
          size="icon"
          className="shrink-0"
          onClick={() => setSelectedChatId("")}
        >
          <Plus className="w-5 h-5" />
        </Button>

        {/* Settings */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="shrink-0"
          onMouseEnter={() => setOpenPopup('settings')}
        >
          <Settings className="w-5 h-5" />
        </Button>

        {/* Instruction */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="shrink-0"
          onMouseEnter={() => setOpenPopup('instruction')}
        >
          <FileText className="w-5 h-5" />
        </Button>

        {/* Project */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="shrink-0"
          onMouseEnter={() => setOpenPopup('project')}
        >
          <FolderKanban className="w-5 h-5" />
        </Button>

        {/* Knowledge */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="shrink-0"
          onMouseEnter={() => setOpenPopup('knowledge')}
        >
          <BookOpen className="w-5 h-5" />
        </Button>

        {/* Rules */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="shrink-0"
          onMouseEnter={() => setOpenPopup('rules')}
        >
          <Shield className="w-5 h-5" />
        </Button>

        <div className="w-8 h-px bg-border my-2" />

        {/* Chats */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="shrink-0"
          onMouseEnter={() => setOpenPopup('chats')}
        >
          <MessageSquare className="w-5 h-5" />
        </Button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Organization Switcher */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="shrink-0 relative">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {selectedOrg.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="w-3 h-3 absolute -bottom-1 -right-1 bg-card rounded-full" />
            </Button>
          </PopoverTrigger>
          <PopoverContent side="right" className="w-64 p-2" sideOffset={8}>
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

      {/* Single Popup Container */}
      {openPopup && (
        <div 
          className={cn(
            "fixed left-16 top-0 h-screen bg-popover border-r shadow-md z-50",
            openPopup === 'chats' ? "w-80" : "w-64"
          )}
          onMouseLeave={() => setOpenPopup(null)}
        >
          {renderPopupContent()}
        </div>
      )}
    </div>
  );
}
