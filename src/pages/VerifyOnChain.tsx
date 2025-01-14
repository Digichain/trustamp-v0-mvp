import { Navigation } from "@/components/landing/Navigation";
import { FileUploader } from "@/components/onchain/FileUploader";
import { DocumentVerificationStatus } from "@/components/onchain/DocumentVerificationStatus";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { verify } from "@govtechsg/oa-verify";

interface VerificationDetails {
  issuanceStatus: {
    valid: boolean;
    message: string;
  };
  issuerIdentity: {
    valid: boolean;
    message: string;
    details?: {
      name?: string;
      domain?: string;
    };
  };
  documentIntegrity: {
    valid: boolean;
    message: string;
  };
  fragments?: any[];
}

const VerifyOnChain = () => {
  const [verificationResult, setVerificationResult] = useState<{ isValid: boolean; document: any; details?: VerificationDetails } | null>(null);
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

      // Verify using OpenAttestation's verify function
      console.log("Starting OpenAttestation verification");
      const fragments = await verify(document);
      console.log("Verification fragments:", fragments);

      // Initialize verification details with valid state
      const details: VerificationDetails = {
        issuanceStatus: {
          valid: true,
          message: "Document issuance verification successful"
        },
        issuerIdentity: {
          valid: true,
          message: "Issuer identity verification successful"
        },
        documentIntegrity: {
          valid: true,
          message: "Document integrity verification successful"
        },
        fragments
      };

      // Process each fragment and update status if any validation fails
      fragments.forEach((fragment: any) => {
        if (fragment.name === "OpenAttestationHash") {
          details.documentIntegrity = {
            valid: fragment.status === "VALID",
            message: fragment.status === "VALID" 
              ? "Document integrity verified successfully" 
              : "Document hash verification failed"
          };
        }
        else if (fragment.name === "OpenAttestationDnsTxt" || fragment.name === "OpenAttestationDnsDid") {
          const identityDetails = fragment.data?.[0] ? {
            domain: fragment.data[0].location
          } : undefined;

          details.issuerIdentity = {
            valid: fragment.status === "VALID",
            message: fragment.status === "VALID"
              ? "Issuer identity verified successfully"
              : "Issuer identity verification failed",
            details: identityDetails
          };
        }
        else if (fragment.name === "OpenAttestationEthereumTokenRegistryStatus" || 
                 fragment.name === "OpenAttestationEthereumDocumentStoreStatus" ||
                 fragment.name === "OpenAttestationDidSignedDocumentStatus") {
          details.issuanceStatus = {
            valid: fragment.status === "VALID",
            message: fragment.status === "VALID"
              ? "Document issuance verified successfully"
              : "Document issuance verification failed"
          };
        }
      });

      const isValid = details.documentIntegrity.valid && 
                     details.issuerIdentity.valid && 
                     details.issuanceStatus.valid;

      console.log("Final verification result:", { isValid, details });

      setVerificationResult({
        isValid,
        document,
        details
      });

      if (isValid) {
        toast({
          title: "Document Valid",
          description: "Document verified successfully"
        });
      } else {
        toast({
          title: "Document Invalid",
          description: "Document verification failed",
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 pt-24">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
            <h1 className="text-2xl font-bold mb-2">Verify Document On-Chain</h1>
            <p className="text-gray-600 mb-6">
              Upload a document to verify its authenticity and integrity on the blockchain.
            </p>

            <div className="space-y-6">
              {!verificationResult && (
                <FileUploader onFileProcess={processFile} />
              )}

              {verificationResult && (
                <DocumentVerificationStatus 
                  verificationDetails={verificationResult.details}
                  onReset={resetVerification}
                  documentPreview={null}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOnChain;