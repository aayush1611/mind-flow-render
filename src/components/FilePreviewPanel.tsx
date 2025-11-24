import { useState } from "react";
import { X, Download, FileText, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileTab {
  id: string;
  fileName: string;
  fileType: "pdf" | "excel";
  content: string;
}

interface FilePreviewPanelProps {
  files: FileTab[];
  onClose: () => void;
  className?: string;
}

export default function FilePreviewPanel({ files, onClose, className }: FilePreviewPanelProps) {
  const [activeTabId, setActiveTabId] = useState(files[0]?.id);
  const [localFiles, setLocalFiles] = useState(files);

  const activeFile = localFiles.find(f => f.id === activeTabId);

  const handleDownload = (file: FileTab) => {
    console.log("Downloading:", file.fileName);
    // Download logic here
  };

  const handleCloseTab = (fileId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedFiles = localFiles.filter(f => f.id !== fileId);
    setLocalFiles(updatedFiles);
    
    if (activeTabId === fileId) {
      setActiveTabId(updatedFiles[0]?.id || "");
    }
    
    if (updatedFiles.length === 0) {
      onClose();
    }
  };

  const getFileIcon = (fileType: string) => {
    return fileType === "pdf" ? <FileText className="w-3.5 h-3.5" /> : <File className="w-3.5 h-3.5" />;
  };

  return (
    <div 
      className={cn(
        "fixed right-0 top-0 h-full w-[40%] bg-background border-l shadow-2xl z-40 flex flex-col animate-slide-in-right",
        className
      )}
    >
      {/* Header with actions */}
      <div className="bg-muted/30 border-b flex items-center justify-between px-4 py-3 shrink-0">
        <h3 className="font-semibold text-sm">File Preview</h3>
        <div className="flex items-center gap-2">
          {activeFile && (
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 rounded-md"
              onClick={() => handleDownload(activeFile)}
              title="Download file"
            >
              <Download className="h-4 w-4" />
            </Button>
          )}
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 rounded-md"
            onClick={onClose}
            title="Close all"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tab Bar - Chrome-like */}
      <div className="bg-muted/50 border-b flex items-center px-1 py-1 shrink-0 gap-1 overflow-x-auto">
        {localFiles.map((file) => (
          <button
            key={file.id}
            onClick={() => setActiveTabId(file.id)}
            className={cn(
              "group relative flex items-center gap-2 px-3 py-2 rounded-md min-w-0 max-w-[200px] transition-all",
              activeTabId === file.id 
                ? "bg-background text-foreground shadow-sm" 
                : "bg-transparent text-muted-foreground hover:bg-background/50"
            )}
          >
            <span className="shrink-0">
              {getFileIcon(file.fileType)}
            </span>
            <span className="text-xs font-medium truncate flex-1">
              {file.fileName}
            </span>
            <button
              onClick={(e) => handleCloseTab(file.id, e)}
              className="shrink-0 rounded-full p-0.5 hover:bg-muted-foreground/20 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto bg-background p-6">
        {activeFile ? (
          <div className="h-full flex flex-col items-center justify-center animate-fade-in">
            <div className="text-center space-y-6 max-w-md">
              <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                <div className="scale-150">
                  {getFileIcon(activeFile.fileType)}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-xl mb-2">{activeFile.fileName}</h3>
                <p className="text-sm text-muted-foreground">
                  {activeFile.fileType === "pdf" ? "PDF Document" : "Excel Spreadsheet"}
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-6 text-sm text-muted-foreground">
                <p className="font-medium mb-1">Preview Coming Soon</p>
                <p className="text-xs">Full document preview will be available in the next update.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            No file selected
          </div>
        )}
      </div>
    </div>
  );
}
