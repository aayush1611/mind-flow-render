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
  Plus,
  Search,
  Filter,
  MessageSquare,
  Loader2,
  CheckCircle2,
  MoreVertical,
  Settings,
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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const filteredChats = mockChats.filter((chat) =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const shouldShowContent = !isCollapsed || isHovered;

  return (
    <aside 
      className={cn(
        "bg-card border-r flex flex-col h-screen transition-all duration-300",
        isCollapsed ? "w-16" : "w-80"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="p-4 border-b space-y-4">
        {/* Top Actions */}
        <div className="flex items-center justify-between gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground shrink-0"
              >
                <Settings className="w-5 h-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2" align="start">
              <div className="flex flex-col gap-1">
                <Button
                  variant="ghost"
                  className="justify-start text-sm"
                  onClick={() => navigate("/instructions")}
                >
                  Instruction
                </Button>
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
            </PopoverContent>
          </Popover>
          {shouldShowContent && (
            <Button
              className="flex-1"
              onClick={() => setSelectedChatId("")}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Chat
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <MessageSquare className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation Pills */}
        {shouldShowContent && (
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="rounded-full"
              onClick={() => navigate("/projects")}
            >
              Project
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full"
            >
              Knowledge
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full"
            >
              Rules
            </Button>
          </div>
        )}
      </div>

      {/* Recent Chats Section */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {shouldShowContent && (
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold mb-3">Recent Chats</h2>

            {/* Search and Filter */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button variant="ghost" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
        

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setSelectedChatId(chat.id)}
              className={cn(
                "w-full py-3 flex items-center hover:bg-accent transition-colors border-b",
                selectedChatId === chat.id && "bg-primary/10 border-l-4 border-l-primary",
                isCollapsed && !isHovered ? "px-2 justify-center" : "px-4 gap-3"
              )}
            >
              <div className="relative shrink-0">
                {chat.status === "completed" && !chat.isRead ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <>
                    <MessageSquare className="w-5 h-5 text-muted-foreground" />
                    {chat.status === "streaming" && (
                      <div className="absolute -top-1 -right-1 w-3 h-3">
                        <Loader2 className="w-3 h-3 text-blue-500 animate-spin" />
                      </div>
                    )}
                  </>
                )}
              </div>

              {shouldShowContent && (
                <>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium truncate">{chat.title}</p>
                      {chat.unreadCount && chat.unreadCount > 0 && (
                        <Badge variant="destructive" className="rounded-full px-2 py-0 h-5 text-xs">
                          {chat.unreadCount}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{chat.timestamp}</p>
                  </div>

                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t">
        {shouldShowContent ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    JD
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xs text-muted-foreground">Acme Corp</p>
                  <p className="text-sm font-medium">John Doe</p>
                </div>
              </div>
              <Button variant="link" className="text-primary text-xs">
                Sign out
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <Avatar>
              <AvatarFallback className="bg-primary text-primary-foreground">
                JD
              </AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>
    </aside>
  );
}
