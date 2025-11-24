import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, MessageSquare, Loader2, CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import TopNavigation from "@/components/TopNavigation";

interface Thread {
  id: string;
  title: string;
  messageCount: number;
  lastMessage: string;
  timestamp: string;
  status: "streaming" | "completed" | "idle";
  isRead: boolean;
}

const mockThreads: Thread[] = [
  {
    id: "1",
    title: "Q3 Marketing Strategy Discussion",
    messageCount: 12,
    lastMessage: "Let me analyze the latest market trends...",
    timestamp: "2h ago",
    status: "completed",
    isRead: false,
  },
  {
    id: "2",
    title: "Financial Projections 2024",
    messageCount: 8,
    lastMessage: "Based on the data provided...",
    timestamp: "5h ago",
    status: "completed",
    isRead: true,
  },
  {
    id: "3",
    title: "Customer Support Automation",
    messageCount: 15,
    lastMessage: "Here are the implementation steps...",
    timestamp: "1d ago",
    status: "streaming",
    isRead: false,
  },
  {
    id: "4",
    title: "Meeting Minutes - 07/15",
    messageCount: 5,
    lastMessage: "I've summarized the key points...",
    timestamp: "2d ago",
    status: "idle",
    isRead: true,
  },
  {
    id: "5",
    title: "Product Roadmap Planning",
    messageCount: 20,
    lastMessage: "Let's prioritize the features...",
    timestamp: "3d ago",
    status: "completed",
    isRead: true,
  },
];

export default function ChatThreads() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredThreads = mockThreads
    .filter((thread) => {
      const matchesSearch = thread.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === "all" || 
        (filterStatus === "unread" && !thread.isRead) ||
        (filterStatus === "read" && thread.isRead);
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "recent") {
        return 0; // Keep original order (most recent first)
      } else if (sortBy === "oldest") {
        return 0; // Reverse would be applied
      } else if (sortBy === "messages") {
        return b.messageCount - a.messageCount;
      } else if (sortBy === "name") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

  const getStatusIcon = (thread: Thread) => {
    if (thread.status === "streaming") {
      return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
    } else if (thread.status === "completed" && !thread.isRead) {
      return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    } else {
      return <MessageSquare className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <TopNavigation activeTab="chat" onTabChange={() => {}} />
      
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Chat Threads</h1>
            <p className="text-muted-foreground mt-1">
              Manage and browse all your conversations
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search threads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="messages">Most Messages</SelectItem>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4">
            {filteredThreads.length === 0 ? (
              <Card className="p-8 text-center">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No threads found</p>
              </Card>
            ) : (
              filteredThreads.map((thread) => (
                <Card
                  key={thread.id}
                  className={cn(
                    "p-4 hover:shadow-md transition-all cursor-pointer",
                    !thread.isRead && "border-primary/50"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 mt-1">
                      {getStatusIcon(thread)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <h3 className={cn(
                            "font-semibold text-lg truncate",
                            !thread.isRead && "text-primary"
                          )}>
                            {thread.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                            {thread.lastMessage}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {thread.timestamp}
                          </div>
                          {!thread.isRead && (
                            <Badge variant="default" className="bg-primary">
                              New
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{thread.messageCount} messages</span>
                        {thread.status === "streaming" && (
                          <Badge variant="secondary" className="text-xs">
                            Processing
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
