import { useState } from 'react';
import { Upload, FileUp, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { VerifierFactory } from '@/components/transactions/verification/verifierFactory';
import { useToast } from '@/hooks/use-toast';
import { InvoicePreview } from '@/components/transactions/previews/InvoicePreview';
import { PreviewDialog } from '@/components/transactions/previews/PreviewDialog';

const VerifyDocument = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [verificationResult, setVerificationResult] = useState<{ isValid: boolean; document: any } | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const resetVerification = () => {
    setFile(null);
    setVerificationResult(null);
    setShowPreview(false);
  };

  const processFile = async (file: File) => {
    try {
      console.log("Processing file:", file.name);
      const fileContent = await file.text();
      const document = JSON.parse(fileContent);
      
      const verifier = await VerifierFactory.verifyDocument(document);
      if (!verifier) {
        toast({
          title: "Verification Error",
          description: "Unsupported document type",
          variant: "destructive"
        });
        return;
      }

      const result = await verifier.verify(document);
      console.log("Verification result:", result);

      setVerificationResult({
        isValid: result.isValid,
        document: document
      });

      if (result.isValid) {
        setShowPreview(true);
        toast({
          title: "Document Valid",
          description: "Document verified successfully"
        });
      } else {
        toast({
          title: "Document Invalid",
          description: result.errors?.[0] || "Verification failed",
          variant: "destructive"
        });
      }

    } catch (error) {
      console.error("Error processing file:", error);
      toast({
        title: "Error",
        description: "Failed to process document",
        variant: "destructive"
      });
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      await processFile(droppedFile);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      await processFile(selectedFile);
    }
  };

  const renderPreview = () => {
    if (!verificationResult?.document) return null;

    switch (verificationResult.document.$template?.name) {
      case 'INVOICE':
        return <InvoicePreview data={verificationResult.document} />;
      default:
        return <div>Unsupported document type</div>;
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Verify Document</h1>
          <p className="mt-2 text-gray-600">
            Upload a document to verify its authenticity and integrity.
          </p>
        </div>

        {!verificationResult && (
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
                  accept=".json"
                />
              </div>
            </div>
          </div>
        )}

        {verificationResult && !verificationResult.isValid && (
          <div className="text-center p-8 border rounded-lg bg-destructive/5">
            <h2 className="text-xl font-semibold text-destructive mb-4">
              Document Verification Failed
            </h2>
            <p className="text-gray-600 mb-6">
              The uploaded document did not pass verification checks. Please try again with a valid document.
            </p>
            <Button onClick={resetVerification}>
              <ArrowLeft className="mr-2" />
              Return to Verify Document
            </Button>
          </div>
        )}

        <PreviewDialog
          title="Document Preview"
          isOpen={showPreview}
          onOpenChange={setShowPreview}
        >
          {renderPreview()}
        </PreviewDialog>
      </div>
    </div>
  );
};

export default VerifyDocument;