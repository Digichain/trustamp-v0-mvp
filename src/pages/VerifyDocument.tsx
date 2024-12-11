import { useState } from 'react';
import { Upload, FileUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const VerifyDocument = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      console.log("File dropped:", droppedFile.name);
      setFile(droppedFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      console.log("File selected:", selectedFile.name);
      setFile(selectedFile);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Verify Document</h1>
          <p className="mt-2 text-gray-600">
            Upload a document to verify its authenticity and integrity.
          </p>
        </div>

        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-12 text-center",
            isDragging ? "border-primary bg-primary/5" : "border-gray-300",
            "transition-colors duration-200"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center gap-4">
            <Upload className="h-12 w-12 text-gray-400" />
            <div className="space-y-2">
              <p className="text-lg font-medium">
                Drag and drop your file here
              </p>
              <p className="text-sm text-gray-500">
                or click the button below to browse
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
              />
            </div>
          </div>
        </div>

        {file && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Selected file: <span className="font-medium">{file.name}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyDocument;