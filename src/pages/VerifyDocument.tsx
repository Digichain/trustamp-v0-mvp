import { useState } from 'react';
import { FileUploader } from '@/components/transactions/verification/FileUploader';
import { VerifierFactory } from '@/components/transactions/verification/verifierFactory';
import { useToast } from '@/hooks/use-toast';
import { InvoicePreview } from '@/components/transactions/previews/InvoicePreview';
import { PreviewDialog } from '@/components/transactions/previews/PreviewDialog';
import { DocumentVerificationStatus } from '@/components/transactions/verification/DocumentVerificationStatus';

const VerifyDocument = () => {
  const [verificationResult, setVerificationResult] = useState<{ isValid: boolean; document: any; details?: any } | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  const resetVerification = () => {
    setVerificationResult(null);
    setShowPreview(false);
  };

  const processFile = async (file: File) => {
    try {
      console.log("Starting file processing:", file.name);
      const fileContent = await file.text();
      console.log("File content read successfully");
      
      let document;
      try {
        document = JSON.parse(fileContent);
        console.log("Document parsed successfully:", document);
      } catch (error) {
        console.error("Error parsing JSON:", error);
        toast({
          title: "Invalid JSON",
          description: "The file contains invalid JSON data",
          variant: "destructive"
        });
        return;
      }
      
      console.log("Getting verifier for document template:", document.$template?.name);
      const verifier = await VerifierFactory.verifyDocument(document);
      if (!verifier) {
        console.error("No verifier found for document");
        toast({
          title: "Verification Error",
          description: "Unsupported document type",
          variant: "destructive"
        });
        return;
      }

      console.log("Starting document verification");
      const result = await verifier.verify(document);
      console.log("Verification result:", result);

      setVerificationResult({
        isValid: result.isValid,
        document: document,
        details: result.details
      });

      // Always show preview after verification
      setShowPreview(true);

      if (result.isValid) {
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
            Upload a JSON document to verify its authenticity and integrity.
          </p>
        </div>

        {!verificationResult && (
          <FileUploader onFileProcess={processFile} />
        )}

        {verificationResult && (
          <DocumentVerificationStatus
            verificationDetails={verificationResult.details}
            onReset={resetVerification}
          />
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