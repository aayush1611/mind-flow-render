import { useState, useEffect } from "react";
import { X, Download, FileText, File, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up the worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface FileTab {
  id: string;
  fileName: string;
  fileType: "pdf" | "excel";
  content: string;
}

interface FilePreviewPanelProps {
  files: FileTab[];
  onClose: () => void;
  onCloseTab: (fileId: string) => void;
  className?: string;
}

export default function FilePreviewPanel({ files, onClose, onCloseTab, className }: FilePreviewPanelProps) {
  const [activeTabId, setActiveTabId] = useState(files[0]?.id);
  const [localFiles, setLocalFiles] = useState(files);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);

  // Sync local files with parent's files
  useEffect(() => {
    setLocalFiles(files);
    // If a new file is added, make it active
    if (files.length > localFiles.length) {
      const newFile = files[files.length - 1];
      setActiveTabId(newFile.id);
    }
  }, [files]);

  const activeFile = localFiles.find(f => f.id === activeTabId);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const handleDownload = (file: FileTab) => {
    console.log("Downloading:", file.fileName);
    // Download logic here
  };

  const handleCloseTab = (fileId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onCloseTab(fileId);
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
      <div className="flex-1 overflow-auto bg-muted/20">
        {activeFile ? (
          activeFile.fileType === "pdf" ? (
            <div className="h-full flex flex-col animate-fade-in">
              {/* PDF Controls */}
              <div className="bg-background border-b px-4 py-3 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPageNumber(prev => Math.max(1, prev - 1))}
                    disabled={pageNumber <= 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {pageNumber} of {numPages}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPageNumber(prev => Math.min(numPages, prev + 1))}
                    disabled={pageNumber >= numPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* PDF Viewer */}
              <div className="flex-1 overflow-auto flex items-start justify-center p-6">
                <Document
                  file="/placeholder.pdf"
                  onLoadSuccess={onDocumentLoadSuccess}
                  className="shadow-lg"
                >
                  <Page 
                    pageNumber={pageNumber}
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                    className="border"
                  />
                </Document>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center animate-fade-in p-6">
              <div className="text-center space-y-6 max-w-md">
                <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                  <div className="scale-150">
                    {getFileIcon(activeFile.fileType)}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-2">{activeFile.fileName}</h3>
                  <p className="text-sm text-muted-foreground">Excel Spreadsheet</p>
                </div>
                <div className="bg-muted/30 rounded-lg p-6 text-sm text-muted-foreground">
                  <p className="font-medium mb-1">Excel Preview Coming Soon</p>
                  <p className="text-xs">Excel spreadsheet preview will be available in the next update.</p>
                </div>
              </div>
            </div>
          )
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            No file selected
          </div>
        )}
      </div>
    </div>
  );
}
