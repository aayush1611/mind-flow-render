import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Send, Loader2, ChevronDown, ChevronUp, Download, FileCode, BarChart3, Star, Sparkles, Puzzle, X, Copy, CheckCircle2, XCircle, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import ReactECharts from "echarts-for-react";
import FilePreviewPanel from "@/components/FilePreviewPanel";
import ProcessingViewPanel from "@/components/ProcessingViewPanel";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  thinking?: ThinkingStep[];
  isStreaming?: boolean;
  attachments?: Attachment[];
  selectedApp?: string | null;
  followUps?: string[];
  isComplete?: boolean;
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

const outputOptions = [
  { id: "visualizations", label: "Include Charts", icon: "📊" },
  { id: "code", label: "Generate Code", icon: "💻" },
  { id: "analysis", label: "Deep Analysis", icon: "🔍" },
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

const suggestionsByModule = {
  "project-alpha": [
    "Show me the latest updates in Project Alpha",
    "What are the pending tasks?",
    "Generate a project status report",
    "Who are the team members?"
  ],
  "knowledge-base": [
    "Search for documentation about APIs",
    "What are the best practices for security?",
    "Find tutorials on database optimization",
    "Summarize the onboarding guide"
  ],
  "rules-engine": [
    "What rules are currently active?",
    "Explain the validation rules",
    "Show me the approval workflow",
    "Which rules apply to new users?"
  ],
  "mcp-server-1": [
    "Test the database connection",
    "List all available API endpoints",
    "Show me the authentication flow",
    "What tools are available?"
  ]
};

const mockModules = [
  { id: "project-alpha", name: "Project Alpha", type: "Project" },
  { id: "knowledge-base", name: "Knowledge Base", type: "Knowledge" },
  { id: "rules-engine", name: "Rules Engine", type: "Rules" },
  { id: "mcp-server-1", name: "Production API", type: "MCP" },
];

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [expandedThinking, setExpandedThinking] = useState<string | null>(null);
  const [showThinking, setShowThinking] = useState(false);
  const [selectedPill, setSelectedPill] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [tempSelectedModule, setTempSelectedModule] = useState<string | null>(null);
  const [isModulePopoverOpen, setIsModulePopoverOpen] = useState(false);
  const [openFiles, setOpenFiles] = useState<Array<{
    id: string;
    fileName: string;
    fileType: "pdf" | "excel";
    content: string;
  }>>([]);
  const [selectedProcessingStep, setSelectedProcessingStep] = useState<ThinkingStep & { details?: string; logs?: string[] } | null>(null);
  const [hiddenSteps, setHiddenSteps] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const currentSuggestions = selectedModule
    ? suggestionsByModule[selectedModule as keyof typeof suggestionsByModule] || suggestionsByApp.default
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
      selectedApp: null,
    };

    const assistantMessageId = (Date.now() + 1).toString();
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      thinking: mockThinkingSteps,
      isStreaming: true,
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setInput("");
    setSelectedPill(null);
    setIsLoading(true);
    setShowThinking(true);
    setExpandedThinking(assistantMessageId);

    // Update thinking steps progressively
    setTimeout(() => {
      const updatedSteps = mockThinkingSteps.map((step, idx) => ({
        ...step,
        status: (idx <= 2 ? "complete" : idx === 3 ? "processing" : "pending") as ThinkingStep["status"],
      }));

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? { ...msg, thinking: updatedSteps }
            : msg
        )
      );

      setTimeout(() => {
        const completeSteps = mockThinkingSteps.map((step) => ({
          ...step,
          status: "complete" as ThinkingStep["status"],
        }));

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? {
                    ...msg,
                    thinking: completeSteps,
                    content: "Perfect! I've completed the comprehensive analysis of your Q3 sales data. Here's your detailed breakdown by region with all the requested deliverables.",
                    isStreaming: false,
                    isComplete: true,
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
                }
              : msg
          )
        );
        setIsLoading(false);
        setShowThinking(false);
      }, 2000);
    }, 1500);
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
    <div className="flex-1 flex h-full relative">
        <div className={cn(
          "flex-1 flex flex-col overflow-hidden transition-all duration-300",
          (openFiles.length > 0 || selectedProcessingStep) && "mr-[calc(40%+2rem)]"
        )}>
        <div className="flex-1 overflow-y-auto px-2 md:px-4 py-4 md:py-6">
          <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 && !isLoading && !showThinking && (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] text-center px-2">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-foreground">Hey, there</h2>

              <div className="w-full max-w-2xl">
                {/* Module Selector Dropdown - positioned above input */}
                <div className="mb-2 flex justify-start">
                  <Popover open={isModulePopoverOpen} onOpenChange={setIsModulePopoverOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="h-9 text-sm gap-2 bg-background"
                      >
                        <Puzzle className="w-4 h-4" />
                        <span className="font-normal">
                          Module selected: <span className="font-medium">{selectedModule ? mockModules.find(m => m.id === selectedModule)?.name : "All"}</span>
                        </span>
                        <ChevronDown className="w-4 h-4 ml-1" />
                      </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 bg-popover z-50" align="start" side="top" sideOffset={8}>
                    <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-sm mb-1">Select Integration Module</h4>
                          <p className="text-xs text-muted-foreground">
                            Choose a module to integrate with your query
                          </p>
                        </div>
                        <RadioGroup value={tempSelectedModule || ""} onValueChange={setTempSelectedModule}>
                          <div className="space-y-3">
                            {mockModules.map((module) => (
                              <div key={module.id} className="flex items-center space-x-2">
                                <RadioGroupItem value={module.id} id={module.id} />
                                <Label
                                  htmlFor={module.id}
                                  className="flex-1 cursor-pointer flex items-center justify-between"
                                >
                                  <span className="text-sm">{module.name}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {module.type}
                                  </Badge>
                                </Label>
                              </div>
                            ))}
                          </div>
                        </RadioGroup>
                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => {
                              setTempSelectedModule(null);
                              setSelectedModule(null);
                              setIsModulePopoverOpen(false);
                            }}
                          >
                            Reset
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1"
                            onClick={() => {
                              setSelectedModule(tempSelectedModule);
                              setIsModulePopoverOpen(false);
                            }}
                          >
                            Apply
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="relative bg-card rounded-2xl shadow-lg border p-3 md:p-4">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={
                    selectedModule
                      ? `Ask about ${mockModules.find(m => m.id === selectedModule)?.name}...`
                      : "Ask Office Agent anything..."
                  }
                  className="min-h-[60px] md:min-h-[80px] pr-24 md:pr-44 resize-none border-0 focus-visible:ring-0 shadow-none text-sm md:text-base"
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
                  <div className="absolute bottom-3 md:bottom-4 right-3 md:right-4 flex items-center gap-1 md:gap-2">
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      size="icon"
                      variant="ghost"
                      className="rounded-full h-8 w-8 md:h-9 md:w-9 hidden sm:flex"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                    </Button>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 md:h-9 text-xs md:text-sm gap-1.5 hidden sm:flex"
                        >
                          <span>Options</span>
                          {selectedOptions.length > 0 && (
                            <Badge variant="secondary" className="h-5 px-1.5 text-[10px] font-medium">
                              {selectedOptions.length}
                            </Badge>
                          )}
                          <ChevronDown className="w-3 h-3" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64 bg-popover z-50" align="end">
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-semibold text-sm mb-1">Response Options</h4>
                            <p className="text-xs text-muted-foreground">
                              Customize what to include in the response
                            </p>
                          </div>
                          <div className="space-y-2">
                            {outputOptions.map((option) => (
                              <label
                                key={option.id}
                                className="flex items-center gap-3 p-2 rounded-md hover:bg-accent cursor-pointer transition-colors"
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedOptions.includes(option.id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedOptions([...selectedOptions, option.id]);
                                    } else {
                                      setSelectedOptions(selectedOptions.filter(id => id !== option.id));
                                    }
                                  }}
                                  className="w-4 h-4 rounded border-input text-primary focus:ring-2 focus:ring-primary"
                                />
                                <div className="flex items-center gap-2 flex-1">
                                  <span className="text-base">{option.icon}</span>
                                  <span className="text-sm">{option.label}</span>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>

                    <Button
                      onClick={() => handleSend()}
                      disabled={!input.trim()}
                      size="icon"
                      className="rounded-full h-8 w-8 md:h-9 md:w-9"
                    >
                      <Send className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </Button>
                  </div>
                </div>

                {/* Suggestion Pills */}
                <div className="mt-3 md:mt-4 flex flex-wrap gap-2 justify-center max-w-3xl mx-auto">
                  {currentSuggestions.map((pill) => (
                    <button
                      key={pill}
                      onClick={() => {
                        setSelectedPill(pill);
                        handleSend(pill);
                      }}
                      className={cn(
                        "px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm border transition-all",
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

          {messages.map((message) => (
            <div key={message.id} className="space-y-4">
              {message.role === "user" ? (
                <div className="flex justify-end">
                  <div className="bg-primary text-primary-foreground rounded-2xl px-4 md:px-6 py-3 md:py-4 max-w-[85%] md:max-w-[75%] shadow-sm">
                    <div className="text-[15px] leading-relaxed font-medium">
                      {message.content}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {message.thinking && !message.isComplete && (
                    <div className="bg-card rounded-lg p-4 border shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        <span className="text-sm font-medium">Processing</span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {message.thinking.filter(s => s.status === "complete").length}/{message.thinking.length}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setHiddenSteps(prev => ({ ...prev, [message.id]: !prev[message.id] }))}
                          className="h-7 px-2 text-xs"
                        >
                          {hiddenSteps[message.id] ? (
                            <>
                              <ChevronDown className="w-3 h-3 mr-1" />
                              Show details
                            </>
                          ) : (
                            <>
                              <ChevronUp className="w-3 h-3 mr-1" />
                              Hide details
                            </>
                          )}
                        </Button>
                      </div>
                      {!hiddenSteps[message.id] && (
                        <div className="space-y-2">
                          {message.thinking.map((step, index) => (
                            <button
                              key={step.id}
                              onClick={() => {
                                setSelectedProcessingStep(null);
                                setTimeout(() => {
                                  setSelectedProcessingStep({
                                    ...step,
                                    details: `Processing ${step.label.toLowerCase()}. This step involves analyzing the request and preparing necessary resources.`,
                                    logs: [
                                      `[${new Date().toISOString()}] Step initiated: ${step.label}`,
                                      `[${new Date().toISOString()}] Allocating resources...`,
                                      `[${new Date().toISOString()}] Connecting to database...`,
                                      `[${new Date().toISOString()}] Executing query...`,
                                      step.status === "complete" ? `[${new Date().toISOString()}] Step completed successfully` : `[${new Date().toISOString()}] Step in progress...`,
                                    ]
                                  });
                                }, 50);
                              }}
                              className="flex items-center gap-2 w-full text-left hover:bg-accent rounded p-2 transition-colors"
                            >
                              {step.status === "pending" && (
                                <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30 flex-shrink-0" />
                              )}
                              {step.status === "processing" && (
                                <Loader2 className="w-4 h-4 animate-spin text-primary flex-shrink-0" />
                              )}
                              {step.status === "complete" && (
                                <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                                  <Check className="w-3 h-3 text-white" strokeWidth={2.5} />
                                </div>
                              )}
                              <span className={cn(
                                "text-xs",
                                step.status === "pending" && "text-muted-foreground",
                                step.status === "processing" && "text-foreground",
                                step.status === "complete" && "text-foreground"
                              )}>{step.label}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {message.thinking && message.isComplete && (
                    <div className="bg-card rounded-lg p-4 border shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" strokeWidth={2.5} />
                        </div>
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">All Steps Completed</span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {message.thinking.length}/{message.thinking.length}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setHiddenSteps(prev => ({ ...prev, [message.id]: !prev[message.id] }))}
                          className="h-7 px-2 text-xs"
                        >
                          {hiddenSteps[message.id] ? (
                            <>
                              <ChevronDown className="w-3 h-3 mr-1" />
                              Show details
                            </>
                          ) : (
                            <>
                              <ChevronUp className="w-3 h-3 mr-1" />
                              Hide details
                            </>
                          )}
                        </Button>
                      </div>
                      {!hiddenSteps[message.id] && (
                        <div className="space-y-2">
                          {message.thinking.map((step, index) => (
                            <button
                              key={step.id}
                              onClick={() => {
                                setSelectedProcessingStep(null);
                                setTimeout(() => {
                                  setSelectedProcessingStep({
                                    ...step,
                                    details: `Processing ${step.label.toLowerCase()}. This step involves analyzing the request and preparing necessary resources.`,
                                    logs: [
                                      `[${new Date().toISOString()}] Step initiated: ${step.label}`,
                                      `[${new Date().toISOString()}] Allocating resources...`,
                                      `[${new Date().toISOString()}] Connecting to database...`,
                                      `[${new Date().toISOString()}] Executing query...`,
                                      `[${new Date().toISOString()}] Step completed successfully`,
                                    ]
                                  });
                                }, 50);
                              }}
                              className="flex items-center gap-2 w-full text-left hover:bg-accent rounded p-2 transition-colors"
                            >
                              <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                                <Check className="w-3 h-3 text-white" strokeWidth={2.5} />
                              </div>
                              <span className="text-xs text-foreground">{step.label}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}


                  {(message.content || (message.attachments && message.attachments.length > 0)) && (
                    <div className="bg-card rounded-2xl p-3 md:p-4 border shadow-sm">
                      {message.content && (
                        <p className="text-sm md:text-base text-foreground">{message.content}</p>
                      )}

                      {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-4 space-y-3">
                        <div className="w-full space-y-3">
                          {message.attachments.map((attachment, idx) => (
                          <div key={idx}>
                            {attachment.type === "chart" && (
                              <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
                                <div className="bg-secondary px-4 py-2 flex items-center justify-between border-b">
                                  <div className="flex items-center gap-2">
                                    <BarChart3 className="w-4 h-4" />
                                    <span className="text-sm font-medium">Chart Visualization</span>
                                  </div>
                                  <Button variant="ghost" size="sm">
                                    <Download className="w-4 h-4" />
                                  </Button>
                                </div>
                                <div className="p-4">
                                  <ReactECharts option={chartOption} style={{ height: '300px' }} />
                                </div>
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
                                  <div className="flex items-center gap-2">
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => {
                                        navigator.clipboard.writeText(attachment.content || "");
                                        toast({
                                          title: "Copied!",
                                          description: "Code copied to clipboard",
                                        });
                                      }}
                                    >
                                      <Copy className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                      <Download className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                                <pre className="p-4 overflow-x-auto text-sm">
                                  <code>{attachment.content}</code>
                                </pre>
                              </div>
                            )}

                            {attachment.type === "file" && (
                               <div 
                                 className={cn(
                                   "bg-card border rounded-lg p-4 flex items-center justify-between transition-all cursor-pointer",
                                   openFiles.some(f => f.fileName === attachment.fileName)
                                     ? "shadow-lg ring-2 ring-primary" 
                                     : "hover:shadow-hover"
                                 )}
                               onClick={() => {
                                   if (attachment.fileType === "pdf" || attachment.fileType === "excel") {
                                     setOpenFiles(prev => [...prev, {
                                       id: `${attachment.fileName}-${Date.now()}`,
                                       fileName: attachment.fileName!,
                                       fileType: attachment.fileType!,
                                       content: ""
                                     }]);
                                   }
                                 }}
                              >
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
                                <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                                  <Download className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                        </div>
                      </div>
                    )}

                    {message.isComplete && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-green-500" />
                            <span className="text-sm font-medium text-green-600 dark:text-green-400">
                              Answer completed
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-muted-foreground mr-2">How was this result?</span>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                className="p-1 hover:scale-110 transition-transform"
                                onClick={() => console.log("Rating:", star)}
                              >
                                <Star className="w-4 h-4 text-muted-foreground hover:text-yellow-500 hover:fill-yellow-500 transition-colors" />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {message.followUps && message.followUps.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                              <Sparkles className="w-3.5 h-3.5 text-primary" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium mb-3">Suggested follow-ups:</p>
                            <div className="flex flex-col gap-2">
                              {message.followUps.map((followUp, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => handleSend(followUp)}
                                  className="text-left px-4 py-2.5 rounded-lg border border-border bg-card hover:bg-accent hover:border-primary/50 transition-all text-sm group"
                                >
                                  <span className="group-hover:text-primary transition-colors">{followUp}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  )}
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area - Only shown when there are messages */}
        {messages.length > 0 && (
          <div className="border-t bg-card p-2 md:p-4">
            <div className="max-w-4xl mx-auto">
              {/* Module Selector Dropdown - positioned above input */}
              <div className="mb-2">
                <Popover open={isModulePopoverOpen} onOpenChange={setIsModulePopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-9 text-sm gap-2 bg-background"
                    >
                      <Puzzle className="w-4 h-4" />
                      <span className="font-normal">
                        Module selected: <span className="font-medium">{selectedModule ? mockModules.find(m => m.id === selectedModule)?.name : "All"}</span>
                      </span>
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 bg-popover z-50" align="start" side="top" sideOffset={8}>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Select Integration Module</h4>
                        <p className="text-xs text-muted-foreground">
                          Choose a module to integrate with your query
                        </p>
                      </div>
                      <RadioGroup value={tempSelectedModule || ""} onValueChange={setTempSelectedModule}>
                        <div className="space-y-3">
                          {mockModules.map((module) => (
                            <div key={module.id} className="flex items-center space-x-2">
                              <RadioGroupItem value={module.id} id={`follow-${module.id}`} />
                              <Label
                                htmlFor={`follow-${module.id}`}
                                className="flex-1 cursor-pointer flex items-center justify-between"
                              >
                                <span className="text-sm">{module.name}</span>
                                <Badge variant="outline" className="text-xs">
                                  {module.type}
                                </Badge>
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => {
                            setTempSelectedModule(null);
                            setSelectedModule(null);
                            setIsModulePopoverOpen(false);
                          }}
                        >
                          Reset
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            setSelectedModule(tempSelectedModule);
                            setIsModulePopoverOpen(false);
                          }}
                        >
                          Apply
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="relative bg-background rounded-2xl border p-3 md:p-4">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={
                    selectedModule
                      ? `Ask about ${mockModules.find(m => m.id === selectedModule)?.name}...`
                      : "Ask a follow-up question..."
                  }
                  className="min-h-[50px] md:min-h-[60px] pr-16 md:pr-36 resize-none border-0 focus-visible:ring-0 shadow-none text-sm md:text-base"
                />

                <div className="absolute bottom-3 md:bottom-4 right-3 md:right-4 flex items-center gap-1 md:gap-2">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    size="icon"
                    variant="ghost"
                    className="rounded-full h-8 w-8 md:h-9 md:w-9 hidden sm:flex"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                  </Button>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 md:h-9 text-xs md:text-sm gap-1.5 hidden sm:flex"
                      >
                        <span>Options</span>
                        {selectedOptions.length > 0 && (
                          <Badge variant="secondary" className="h-5 px-1.5 text-[10px] font-medium">
                            {selectedOptions.length}
                          </Badge>
                        )}
                        <ChevronDown className="w-3 h-3" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 bg-popover z-50" align="end">
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold text-sm mb-1">Response Options</h4>
                          <p className="text-xs text-muted-foreground">
                            Customize what to include in the response
                          </p>
                        </div>
                        <div className="space-y-2">
                          {outputOptions.map((option) => (
                            <label
                              key={option.id}
                              className="flex items-center gap-3 p-2 rounded-md hover:bg-accent cursor-pointer transition-colors"
                            >
                              <input
                                type="checkbox"
                                checked={selectedOptions.includes(option.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedOptions([...selectedOptions, option.id]);
                                  } else {
                                    setSelectedOptions(selectedOptions.filter(id => id !== option.id));
                                  }
                                }}
                                className="w-4 h-4 rounded border-input text-primary focus:ring-2 focus:ring-primary"
                              />
                              <div className="flex items-center gap-2 flex-1">
                                <span className="text-base">{option.icon}</span>
                                <span className="text-sm">{option.label}</span>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>

                  <Button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || isLoading}
                    size="icon"
                    className="rounded-full h-8 w-8 md:h-9 md:w-9"
                  >
                    <Send className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* File Preview Panel */}
      {openFiles.length > 0 && (
        <FilePreviewPanel
          files={openFiles}
          onClose={() => setOpenFiles([])}
          onCloseTab={(fileId) => {
            const updatedFiles = openFiles.filter(f => f.id !== fileId);
            setOpenFiles(updatedFiles);
          }}
        />
      )}
      
      {/* Processing View Panel */}
      {selectedProcessingStep && (
        <ProcessingViewPanel
          step={selectedProcessingStep}
          onClose={() => setSelectedProcessingStep(null)}
        />
      )}
    </div>
  );
}
