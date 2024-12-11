import { useWallet } from "@/contexts/WalletContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Loader2 } from "lucide-react";
import { DIDDisplay } from "./DIDDisplay";
import { useDIDCreation } from "./useDIDCreation";
import type { DIDDocument } from "./types";

interface DIDCreatorProps {
  onDIDCreated: (doc: DIDDocument) => void;
}

export const DIDCreator = ({ onDIDCreated }: DIDCreatorProps) => {
  const { walletAddress } = useWallet();
  const {
    isCreating,
    isVerifying,
    didDocument,
    dnsVerified,
    createDID,
    verifyDNSRecord
  } = useDIDCreation(onDIDCreated);

  const handleCreateDID = () => {
    if (walletAddress) {
      createDID(walletAddress);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create Document Identity</CardTitle>
        <CardDescription>
          First, create a DID for document verification using the OpenAttestation sandbox
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={handleCreateDID} 
          disabled={isCreating || !walletAddress || didDocument !== null}
          className="w-full"
        >
          {isCreating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating DID...
            </>
          ) : didDocument ? (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              DID Created
            </>
          ) : (
            'Create DID'
          )}
        </Button>

        {didDocument && (
          <DIDDisplay
            didDocument={didDocument}
            isVerifying={isVerifying}
            dnsVerified={dnsVerified}
            onVerifyDNS={verifyDNSRecord}
          />
        )}
      </CardContent>
    </Card>
  );
};

export type { DIDDocument };