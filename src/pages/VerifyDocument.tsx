import { useState } from 'react';
import { FileUploader } from '@/components/transactions/verification/FileUploader';
import { VerifierFactory } from '@/components/transactions/verification/verifierFactory';
import { useToast } from '@/hooks/use-toast';
import { DocumentVerificationStatus } from '@/components/transactions/verification/DocumentVerificationStatus';
import { registry } from '@/components/transactions/previews/TemplateRegistry';

const VerifyDocument = () => {
  const [verificationResult, setVerificationResult] = useState<{ isValid: boolean; document: any; details?: any } | null>(null);
  const { toast } = useToast();

  const resetVerification = () => {
    setVerificationResult(null);
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

      console.log("Starting document verification");
      const result = await VerifierFactory.verifyDocument(document);
      console.log("Verification result:", result);

      setVerificationResult({
        isValid: result.isValid,
        document: document,
        details: result.details
      });

      if (result.isValid) {
        toast({
          title: "Document Valid",
          description: "Document verified successfully"
        });
      } else {
        toast({
          title: "Document Invalid",
          description: result.error || "Verification failed",
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

    // Get the document data, handling both wrapped and unwrapped formats
    const doc = verificationResult.document.data || verificationResult.document;
    console.log("Processing document for template:", doc);

    // Helper function to extract clean string value
    const getCleanValue = (value: string) => {
      if (typeof value === 'string' && value.includes(':string:')) {
        return value.split(':string:')[1];
      }
      return value;
    };

    // Determine template type
    let templateName;
    if (doc.$template) {
      templateName = getCleanValue(doc.$template.name);
    } else if (doc.invoiceDetails || doc.billFrom) {
      templateName = "INVOICE";
    } else if (doc.billOfLadingDetails || doc.blNumber) {
      templateName = "BILL_OF_LADING";
    }

    console.log("Detected template name:", templateName);

    if (!templateName || !registry[templateName]) {
      console.warn("Unknown document template:", templateName);
      return <div className="text-center text-gray-500">Document preview not available for this type</div>;
    }

    const Template = registry[templateName][0].template;
    return <Template document={doc} />;
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
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
          <div className="space-y-8">
            <DocumentVerificationStatus
              verificationDetails={verificationResult.details}
              onReset={resetVerification}
              documentPreview={renderPreview()}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyDocument;