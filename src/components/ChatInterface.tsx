import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, Loader2, ChevronDown, ChevronUp, Download, FileCode, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactECharts from "echarts-for-react";
import ChatHistorySidebar from "@/components/ChatHistorySidebar";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  thinking?: ThinkingStep[];
  isStreaming?: boolean;
  attachments?: Attachment[];
  selectedApp?: string | null;
  followUps?: string[];
}

interface ThinkingStep {
  id: string;
  label: string;
  status: "pending" | "processing" | "complete";
}

interface Attachment {
  type: "code" | "chart" | "file";
  language?: string;
  content?: string;
  fileName?: string;
  fileSize?: string;
  fileType?: "pdf" | "excel";
}

const mockThinkingSteps: ThinkingStep[] = [
  { id: "1", label: "Request received and parsed successfully", status: "complete" },
  { id: "2", label: "Database connection established", status: "complete" },
  { id: "3", label: "Processing Q3 sales data aggregation...", status: "processing" },
  { id: "4", label: "Generating visualization components", status: "pending" },
  { id: "5", label: "Compiling Excel workbook", status: "pending" },
  { id: "6", label: "Preparing PDF documentation", status: "pending" },
];

const appPills = [
  { id: "powerpoint", label: "PowerPoint", icon: "🎨" },
  { id: "word", label: "Word", icon: "📄" },
  { id: "excel", label: "Excel", icon: "📊" },
];

const suggestionsByApp = {
  powerpoint: [
    "Create a presentation about Q3 results",
    "Design slides for project kickoff",
    "Generate a pitch deck template",
    "Build a data visualization presentation"
  ],
  word: [
    "Draft a project proposal document",
    "Create a meeting summary report",
    "Generate a research paper outline",
    "Write a business letter template"
  ],
  excel: [
    "Analyze Q3 sales data by region",
    "Create a financial forecast model",
    "Build a project budget tracker",
    "Generate pivot tables from data"
  ],
  default: [
    "Analyze Q3 sales data by region",
    "Generate Python code for data processing",
    "Create a financial report with charts",
    "Summarize project metrics"
  ]
};

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [expandedThinking, setExpandedThinking] = useState<string | null>(null);
  const [showThinking, setShowThinking] = useState(false);
  const [selectedPill, setSelectedPill] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentSuggestions = selectedApp
    ? suggestionsByApp[selectedApp as keyof typeof suggestionsByApp]
    : suggestionsByApp.default;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      selectedApp: selectedApp,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setSelectedPill(null);
    setSelectedApp(null);
    setIsLoading(true);
    setShowThinking(true);

    // First show thinking process for 3 seconds
    setTimeout(() => {
      setShowThinking(false);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Perfect! I've completed the comprehensive analysis of your Q3 sales data. Here's your detailed breakdown by region with all the requested deliverables.",
        thinking: mockThinkingSteps,
        isStreaming: true,
        attachments: [
          {
            type: "chart",
            content: "chart-placeholder",
          },
          {
            type: "file",
            fileName: "Q3_Sales_Summary.pdf",
            fileSize: "1.2 MB",
            fileType: "pdf",
          },
          {
            type: "file",
            fileName: "Q3_Raw_Data.xlsx",
            fileSize: "856 KB",
            fileType: "excel",
          },
          {
            type: "code",
            language: "python",
            content: `import pandas as pd

# Mock data based on agent analysis
data = {
    'Company': ['Alphabet', 'Apple', 'Microsoft'],
    'Q3_Revenue_B': [76.0, 90.7, 56.5],
    'YoY_Growth': [0.11, -0.01, 0.13]
}

df = pd.DataFrame(data)
print(df)`,
          },
        ],
        followUps: [
          "Show me the monthly breakdown",
          "Compare with Q2 results",
          "Analyze top performing products"
        ],
      };
      setMessages((prev) => [...prev, aiMessage]);
      setExpandedThinking(aiMessage.id);
      setIsLoading(false);
    }, 3000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const chartOption = {
    title: { text: 'Q3 Sales by Region', left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: ['North', 'South', 'East', 'West', 'Central'] },
    yAxis: { type: 'value' },
    series: [{
      data: [820, 932, 901, 934, 1290],
      type: 'bar',
      itemStyle: { color: 'hsl(var(--primary))' }
    }]
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Chat History Sidebar */}
      <ChatHistorySidebar />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 && !isLoading && !showThinking && (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] text-center">
              <h2 className="text-3xl font-bold mb-8 text-foreground">Hey, there</h2>

              <div className="w-full max-w-2xl">
                <div className="relative bg-card rounded-2xl shadow-lg border p-4">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder={
                      selectedApp
                        ? `Ask Office Agent anything about ${selectedApp}...`
                        : "Ask Office Agent anything..."
                    }
                    className="min-h-[80px] pr-44 resize-none border-0 focus-visible:ring-0 shadow-none"
                  />

                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      console.log("File selected:", e.target.files?.[0]);
                    }}
                  />

                  {/* Controls positioned at bottom right */}
                  <div className="absolute bottom-4 right-4 flex items-center gap-2">
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      size="icon"
                      variant="ghost"
                      className="rounded-full h-9 w-9"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                    </Button>

                    <Select value={selectedApp || "all"} onValueChange={(value) => setSelectedApp(value === "all" ? null : value)}>
                      <SelectTrigger className="w-[140px] h-9">
                        <SelectValue placeholder="All Apps" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Apps</SelectItem>
                        <SelectItem value="powerpoint">🎨 PowerPoint</SelectItem>
                        <SelectItem value="word">📄 Word</SelectItem>
                        <SelectItem value="excel">📊 Excel</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      onClick={() => handleSend()}
                      disabled={!input.trim()}
                      size="icon"
                      className="rounded-full h-9 w-9"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Suggestion Pills */}
                <div className="mt-4 flex flex-wrap gap-2 justify-center max-w-3xl mx-auto">
                  {currentSuggestions.map((pill) => (
                    <button
                      key={pill}
                      onClick={() => {
                        setSelectedPill(pill);
                        handleSend(pill);
                      }}
                      className={cn(
                        "px-4 py-2 rounded-full text-sm border transition-all",
                        selectedPill === pill
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card hover:bg-accent hover:text-accent-foreground border-border"
                      )}
                    >
                      {pill}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {showThinking && (
            <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl p-4 border border-primary/20 animate-fade-in">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="font-medium">AI Processing Pipeline</span>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {mockThinkingSteps.map((step) => (
                  <div key={step.id} className="flex items-start gap-3">
                    {step.status === "complete" && (
                      <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                    {step.status === "processing" && (
                      <Loader2 className="w-5 h-5 animate-spin text-primary flex-shrink-0 mt-0.5" />
                    )}
                    {step.status === "pending" && (
                      <div className="w-5 h-5 rounded-full border-2 border-muted flex-shrink-0 mt-0.5" />
                    )}
                    <span className={cn("text-sm", step.status === "pending" && "text-muted-foreground")}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className="space-y-4">
              {message.role === "user" ? (
                <div className="flex justify-end">
                  <div className="bg-primary text-primary-foreground rounded-2xl px-4 py-3 max-w-[80%]">
                    {message.selectedApp && (
                      <div className="text-xs mb-2 pb-2 border-b border-primary-foreground/20 flex items-center gap-1.5">
                        <span className="font-medium">
                          {message.selectedApp === "powerpoint" && "🎨 PowerPoint"}
                          {message.selectedApp === "word" && "📄 Word"}
                          {message.selectedApp === "excel" && "📊 Excel"}
                        </span>
                      </div>
                    )}
                    <div className="text-sm leading-relaxed">
                      {message.content}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {message.thinking && (
                    <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl p-4 border border-primary/20">
                      <button
                        onClick={() =>
                          setExpandedThinking(expandedThinking === message.id ? null : message.id)
                        }
                        className="flex items-center justify-between w-full text-left"
                      >
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-primary" />
                          <span className="font-medium">AI Processing Pipeline</span>
                        </div>
                        {expandedThinking === message.id ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>

                      {expandedThinking === message.id && (
                        <div className="mt-4 space-y-2">
                          {message.thinking.map((step) => (
                            <div key={step.id} className="flex items-start gap-3">
                              {step.status === "complete" && (
                                <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <svg
                                    className="w-3 h-3 text-white"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              )}
                              {step.status === "processing" && (
                                <Loader2 className="w-5 h-5 animate-spin text-primary flex-shrink-0 mt-0.5" />
                              )}
                              {step.status === "pending" && (
                                <div className="w-5 h-5 rounded-full border-2 border-muted flex-shrink-0 mt-0.5" />
                              )}
                              <span
                                className={cn(
                                  "text-sm",
                                  step.status === "pending" && "text-muted-foreground"
                                )}
                              >
                                {step.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="bg-card rounded-2xl p-4 border shadow-sm">
                    <p className="text-foreground">{message.content}</p>

                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-4 space-y-3">
                          {message.attachments.map((attachment, idx) => (
                          <div key={idx}>
                            {attachment.type === "chart" && (
                              <div className="bg-card rounded-lg p-4 border shadow-sm">
                                <ReactECharts option={chartOption} style={{ height: '300px' }} />
                              </div>
                            )}

                            {attachment.type === "code" && (
                              <div className="bg-muted rounded-lg overflow-hidden border">
                                <div className="bg-secondary px-4 py-2 flex items-center justify-between border-b">
                                  <div className="flex items-center gap-2">
                                    <FileCode className="w-4 h-4" />
                                    <span className="text-sm font-medium">
                                      {attachment.language} Code
                                    </span>
                                  </div>
                                  <Button variant="ghost" size="sm">
                                    <Download className="w-4 h-4" />
                                  </Button>
                                </div>
                                <pre className="p-4 overflow-x-auto text-sm">
                                  <code>{attachment.content}</code>
                                </pre>
                              </div>
                            )}

                            {attachment.type === "file" && (
                              <div className="bg-card border rounded-lg p-4 flex items-center justify-between hover:shadow-hover transition-shadow">
                                <div className="flex items-center gap-3">
                                  {attachment.fileType === "pdf" ? (
                                    <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-950 flex items-center justify-center">
                                      <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M4 18h12V6h-4V2H4v16zm-2 1V0h12l4 4v16H2z" />
                                      </svg>
                                    </div>
                                  ) : (
                                    <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-950 flex items-center justify-center">
                                      <BarChart3 className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    </div>
                                  )}
                                  <div>
                                    <p className="font-medium text-sm">{attachment.fileName}</p>
                                    <p className="text-xs text-muted-foreground">{attachment.fileSize}</p>
                                  </div>
                                </div>
                                <Button variant="ghost" size="icon">
                                  <Download className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {message.followUps && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {message.followUps.map((followUp, idx) => (
                          <Button
                            key={idx}
                            variant="outline"
                            size="sm"
                            onClick={() => handleSend(followUp)}
                            className="text-xs"
                          >
                            {followUp}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area - Only shown when there are messages */}
        {messages.length > 0 && (
          <div className="border-t bg-card p-4">
            <div className="max-w-4xl mx-auto">
              <div className="relative bg-background rounded-2xl border p-4">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask a follow-up question..."
                  className="min-h-[60px] pr-36 resize-none border-0 focus-visible:ring-0 shadow-none"
                />
                <div className="absolute bottom-4 right-4 flex items-center gap-2">
                  <Select value={selectedApp || "all"} onValueChange={(value) => setSelectedApp(value === "all" ? null : value)}>
                    <SelectTrigger className="w-[120px] h-9">
                      <SelectValue placeholder="All Apps" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Apps</SelectItem>
                      <SelectItem value="powerpoint">🎨 PPT</SelectItem>
                      <SelectItem value="word">📄 Word</SelectItem>
                      <SelectItem value="excel">📊 Excel</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || isLoading}
                    size="icon"
                    className="rounded-full h-9 w-9"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
