import { useWallet } from "@/contexts/WalletContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useDIDCreation } from "./useDIDCreation";
import type { DIDDocument } from "./types";

interface DIDCreatorProps {
  onDIDCreated: (doc: DIDDocument) => void;
}

export const DIDCreator = ({ onDIDCreated }: DIDCreatorProps) => {
  const { walletAddress } = useWallet();
  const { isCreating, didDocument, createDID } = useDIDCreation(onDIDCreated);

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
          Create a DID for document verification
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
          ) : (
            'Create DID'
          )}
        </Button>

        {didDocument && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-900">DID Created</p>
            <p className="text-sm text-gray-500 break-all">{didDocument.id}</p>
            <p className="text-sm font-medium text-gray-900 mt-2">DNS Location</p>
            <p className="text-sm text-gray-500 break-all">{didDocument.dnsLocation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export type { DIDDocument };