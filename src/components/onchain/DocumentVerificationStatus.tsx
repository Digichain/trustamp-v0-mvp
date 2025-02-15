import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronDown, ChevronUp, Printer, User, CheckCircle2, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface VerificationStatusProps {
  title: string;
  isValid: boolean;
  message: string;
  details?: {
    name?: string;
    domain?: string;
  };
}

const VerificationStatus = ({
  title,
  isValid,
  message,
  details
}: VerificationStatusProps) => {
  return (
    <div className="p-4 rounded-lg border">
      <div className="flex items-center space-x-2 mb-2">
        {isValid ? (
          <CheckCircle2 className="w-5 h-5 text-green-500" />
        ) : (
          <XCircle className="w-5 h-5 text-red-500" />
        )}
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className={`text-sm ${isValid ? 'text-green-600' : 'text-red-600'}`}>
        {message}
      </p>
      {details && (
        <div className="mt-2 text-sm text-gray-600">
          {details.name && <p>Name: {details.name}</p>}
          {details.domain && <p>Domain: {details.domain}</p>}
        </div>
      )}
    </div>
  );
};

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
  documentPreview: React.ReactNode;
}

export const DocumentVerificationStatus = ({
  verificationDetails,
  onReset,
  documentPreview
}: DocumentVerificationStatusProps) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handlePrint = () => {
    window.print();
  };

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

  const dnsTxtProof = verificationDetails.fragments?.find(
    f => f.name === "OpenAttestationDnsTxtIdentityProof" && f.status === "VALID"
  );
  
  const dnsDidProof = verificationDetails.fragments?.find(
    f => f.name === "OpenAttestationDnsDidIdentityProof" && f.status === "VALID"
  );
  
  const ownerDomain = dnsTxtProof?.data?.[0]?.location || dnsDidProof?.data?.[0]?.location;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className={`text-2xl font-bold ${allValid ? 'text-green-600' : 'text-red-600'}`}>
          {allValid ? 'Document Verification Successful' : 'Document Verification Failed'}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
      </div>

      {verificationDetails.issuerIdentity.valid && ownerDomain && (
        <Card className="p-4 bg-muted">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Document Owner:</span>
            <span className="text-muted-foreground">{ownerDomain}</span>
          </div>
        </Card>
      )}

      {documentPreview && allValid && (
        <Card className="p-6">
          <Collapsible open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Document Preview</h3>
              <div className="flex gap-2">
                {isPreviewOpen && (
                  <Button variant="outline" size="sm" onClick={handlePrint}>
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                )}
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-9 p-0">
                    {isPreviewOpen ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
              </div>
            </div>
            <CollapsibleContent>
              <div className="mt-4 print:m-0">
                {documentPreview}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      )}

      {verificationDetails.fragments && (
        <Card className="p-6">
          <Collapsible open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Verification Details</h3>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-9 p-0">
                  {isDetailsOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <pre className="mt-4 bg-gray-50 p-4 rounded-lg overflow-x-auto">
                {JSON.stringify(verificationDetails.fragments, null, 2)}
              </pre>
            </CollapsibleContent>
          </Collapsible>
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