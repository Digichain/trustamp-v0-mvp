import { useState } from 'react';
import { Upload, FileUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface FileUploaderProps {
  onFileProcess: (file: File) => Promise<void>;
}

export const FileUploader = ({ onFileProcess }: FileUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const validateFileType = (file: File): boolean => {
    const validTypes = ['application/json'];
    if (!validTypes.includes(file.type) && !file.name.endsWith('.json')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a JSON file",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && validateFileType(droppedFile)) {
      await onFileProcess(droppedFile);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && validateFileType(selectedFile)) {
      await onFileProcess(selectedFile);
    }
  };

  return (
    <div
      className={cn(
        "border-2 border-dashed rounded-lg p-12 text-center",
        isDragging ? "border-primary bg-primary/5" : "border-gray-300",
        "transition-colors duration-200"
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setIsDragging(false);
      }}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center gap-4">
        <Upload className="h-12 w-12 text-gray-400" />
        <div className="space-y-2">
          <p className="text-lg font-medium">
            Drag and drop your file here
          </p>
          <p className="text-sm text-gray-500">
            Supported format: JSON
          </p>
        </div>
        <div className="mt-4">
          <Button
            variant="outline"
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <FileUp className="mr-2" />
            Choose File
          </Button>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileSelect}
            accept=".json,application/json"
          />
        </div>
      </div>
    </div>
  );
};