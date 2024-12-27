import { useState } from 'react';
import { FileUploader } from '@/components/transactions/verification/FileUploader';
import { VerifierFactory } from '@/components/transactions/verification/verifierFactory';
import { useToast } from '@/hooks/use-toast';
import { InvoicePreview } from '@/components/transactions/previews/InvoicePreview';
import { BillOfLadingPreview } from '@/components/transactions/previews/BillOfLadingPreview';
import { DocumentVerificationStatus } from '@/components/transactions/verification/DocumentVerificationStatus';
import { useWallet } from '@/contexts/WalletContext';

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
    if (!verificationResult?.document || !verificationResult.isValid) return null;

    switch (verificationResult.document.$template?.name) {
      case 'INVOICE':
        return <InvoicePreview data={verificationResult.document} />;
      case 'BILL_OF_LADING':
        return <BillOfLadingPreview data={verificationResult.document.billOfLadingDetails} />;
      default:
        return <div>Unsupported document type</div>;
    }
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
          <DocumentVerificationStatus
            verificationDetails={verificationResult.details}
            onReset={resetVerification}
          >
            {renderPreview()}
          </DocumentVerificationStatus>
        )}
      </div>
    </div>
  );
};

export default VerifyDocument;