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
    const isJsonMime = file.type === 'application/json';
    const isJsonExtension = file.name.toLowerCase().endsWith('.json');
    const isTtExtension = file.name.toLowerCase().endsWith('.tt');
    const isOaExtension = file.name.toLowerCase().endsWith('.oa');
    const isOpenCertExtension = file.name.toLowerCase().endsWith('.opencert');
    
    console.log('File validation:', {
      fileName: file.name,
      fileType: file.type,
      isJsonMime,
      isJsonExtension,
      isTtExtension,
      isOaExtension,
      isOpenCertExtension
    });

    if (!isJsonMime && !isJsonExtension && !isTtExtension && !isOaExtension && !isOpenCertExtension) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a document in OpenAttestation v2.0 format (.json, .tt, .oa, or .opencert)",
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
    if (droppedFile) {
      console.log('File dropped:', droppedFile.name);
      if (validateFileType(droppedFile)) {
        await onFileProcess(droppedFile);
      }
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      console.log('File selected:', selectedFile.name);
      if (validateFileType(selectedFile)) {
        await onFileProcess(selectedFile);
      }
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
            Supported formats: JSON, .tt, .oa, or .opencert (OpenAttestation v2.0)
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
            accept=".json,.tt,.oa,.opencert,application/json"
          />
        </div>
      </div>
    </div>
  );
};