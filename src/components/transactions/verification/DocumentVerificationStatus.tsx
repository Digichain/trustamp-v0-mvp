import { VerificationStatus } from "./VerificationStatus";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";

interface DocumentVerificationStatusProps {
  verificationDetails: {
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
  } | null;
  onReset: () => void;
}

export const DocumentVerificationStatus = ({
  verificationDetails,
  onReset
}: DocumentVerificationStatusProps) => {
  if (!verificationDetails) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-red-600">
            Document Verification Failed
          </h2>
        </div>
        <VerificationStatus
          title="Verification Error"
          isValid={false}
          message="Unable to verify document. Please ensure the document format is correct and try again."
        />
        <div className="flex justify-center mt-8">
          <Button onClick={onReset} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Verify Document
          </Button>
        </div>
      </div>
    );
  }

  const allValid = verificationDetails.issuanceStatus.valid &&
                  verificationDetails.issuerIdentity.valid &&
                  verificationDetails.documentIntegrity.valid;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className={`text-2xl font-bold ${allValid ? 'text-green-600' : 'text-red-600'}`}>
          {allValid ? 'Document Verification Successful' : 'Document Verification Failed'}
        </h2>
      </div>

      <VerificationStatus
        title="Issuance Status"
        isValid={verificationDetails.issuanceStatus.valid}
        message={verificationDetails.issuanceStatus.message}
      />

      <VerificationStatus
        title="Issuer Identity"
        isValid={verificationDetails.issuerIdentity.valid}
        message={verificationDetails.issuerIdentity.message}
        details={verificationDetails.issuerIdentity.details}
      />

      <VerificationStatus
        title="Document Integrity"
        isValid={verificationDetails.documentIntegrity.valid}
        message={verificationDetails.documentIntegrity.message}
      />

      {verificationDetails.fragments && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Verification Fragments</h3>
          <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
            {JSON.stringify(verificationDetails.fragments, null, 2)}
          </pre>
        </Card>
      )}

      {!allValid && (
        <div className="flex justify-center mt-8">
          <Button onClick={onReset} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Verify Document
          </Button>
        </div>
      )}
    </div>
  );
};