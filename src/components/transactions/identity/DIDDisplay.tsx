import { DIDDocument } from "./types";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, RefreshCw } from "lucide-react";

interface DIDDisplayProps {
  didDocument: DIDDocument;
  isVerifying: boolean;
  dnsVerified: boolean;
  onVerifyDNS: () => void;
}

export const DIDDisplay = ({ 
  didDocument, 
  isVerifying, 
  dnsVerified, 
  onVerifyDNS 
}: DIDDisplayProps) => {
  return (
    <div className="mt-4 space-y-4">
      <div className="rounded-lg bg-muted p-4">
        <pre className="whitespace-pre-wrap text-sm">
          {JSON.stringify(didDocument, null, 2)}
        </pre>
      </div>
      
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <CheckCircle2 className="h-4 w-4 text-green-500 mt-1" />
          <p>DID created with sandbox DNS location: {didDocument.dnsLocation}</p>
        </div>

        <Button
          onClick={onVerifyDNS}
          disabled={isVerifying}
          variant={dnsVerified ? "outline" : "secondary"}
          className="w-full"
        >
          {isVerifying ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying DNS...
            </>
          ) : dnsVerified ? (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
              DNS Record Verified
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Verify DNS Record
            </>
          )}
        </Button>
      </div>
    </div>
  );
};