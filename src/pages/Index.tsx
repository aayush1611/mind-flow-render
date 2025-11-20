import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, FolderKanban, FileText } from "lucide-react";
import ChatInterface from "@/components/ChatInterface";
import ProjectsDashboard from "@/components/ProjectsDashboard";

const Index = () => {
  const [activeTab, setActiveTab] = useState("chat");

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-card">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent" />
            <span className="text-xl font-bold">Agent Intelligence</span>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="chat">
                <MessageSquare className="w-4 h-4 mr-2" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="projects">
                <FolderKanban className="w-4 h-4 mr-2" />
                Projects
              </TabsTrigger>
              <TabsTrigger value="instructions">
                <FileText className="w-4 h-4 mr-2" />
                Instructions
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </nav>

      {activeTab === "chat" && <ChatInterface />}
      {activeTab === "projects" && <ProjectsDashboard />}
      {activeTab === "instructions" && (
        <div className="container mx-auto px-6 py-8 max-w-4xl">
          <div className="space-y-6">
            <div className="text-center space-y-2 mb-8">
              <h1 className="text-4xl font-bold">System Instructions</h1>
              <p className="text-muted-foreground">
                Customize how the AI agent behaves and responds
              </p>
            </div>

            <div className="bg-card border rounded-lg p-6 space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">System Instructions</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Define custom instructions to guide the AI's behavior, tone, and expertise
                </p>
                <textarea
                  className="w-full min-h-[200px] p-4 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Example: You are a helpful assistant that specializes in data analysis. Always provide detailed explanations with examples..."
                />
              </div>

              <div className="flex gap-2">
                <Button>Save Instructions</Button>
                <Button variant="outline">Reset to Default</Button>
              </div>
            </div>

            <div className="bg-card border rounded-lg p-6 space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">Response Preferences</h2>
                <div className="space-y-4 mt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Show Thinking Process</p>
                      <p className="text-sm text-muted-foreground">Display AI reasoning steps</p>
                    </div>
                    <Button variant="outline" size="sm">Enabled</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Code Generation Style</p>
                      <p className="text-sm text-muted-foreground">Preference for code examples</p>
                    </div>
                    <Button variant="outline" size="sm">Detailed</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Response Length</p>
                      <p className="text-sm text-muted-foreground">Default verbosity level</p>
                    </div>
                    <Button variant="outline" size="sm">Balanced</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
