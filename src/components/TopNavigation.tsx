import { MessageSquare, FolderKanban, FileText, BookOpen, Shield, Network, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

interface TopNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function TopNavigation({ activeTab, onTabChange }: TopNavigationProps) {
  const tabs = [
    { id: "chat", label: "Chat", icon: MessageSquare },
    { id: "projects", label: "Projects", icon: FolderKanban },
    { id: "knowledge", label: "Knowledge", icon: BookOpen },
    { id: "rules", label: "Rules", icon: Shield },
    { id: "mcp", label: "MCP", icon: Network },
    { id: "instructions", label: "Instructions", icon: FileText },
    { id: "memories", label: "Memories", icon: Brain },
  ];

  return (
    <div className="h-14 border-b bg-card flex items-center px-6 gap-1">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium",
              activeTab === tab.id
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="w-4 h-4" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
