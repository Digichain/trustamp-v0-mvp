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

      // Get the document data, handling both wrapped and unwrapped formats
      const documentData = document.data || document;
      console.log("Document data for preview:", documentData);

      setVerificationResult({
        isValid: result.isValid,
        document: documentData,
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
    // Only render preview if verification was successful
    if (!verificationResult?.document || !verificationResult.isValid) {
      console.log("Preview not shown - verification failed or no document");
      return null;
    }

    // Document data should already be unwrapped at this point
    const doc = verificationResult.document;
    console.log("Processing document for template:", doc);

    // Determine template type based on document structure
    let templateName;
    if (doc.invoiceDetails || doc.billFrom) {
      templateName = "INVOICE";
    } else if (doc.billOfLadingDetails || doc.blNumber) {
      templateName = "BILL_OF_LADING";
    }

    console.log("Detected template name:", templateName);

    if (!templateName || !registry[templateName]) {
      console.warn("Unknown document template:", templateName);
      return null;
    }

    const Template = registry[templateName][0].template;
    return <Template document={{ data: doc }} />;
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
              documentPreview={verificationResult.isValid ? renderPreview() : null}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyDocument;