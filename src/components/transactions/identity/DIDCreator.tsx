import { useState } from 'react';
import { useWallet } from "@/contexts/WalletContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Loader2 } from "lucide-react";

export interface DIDDocument {
  id: string;
  type: string;
  controller: string;
  ethereumAddress: string;
  dnsLocation?: string;
}

interface DIDCreatorProps {
  onDIDCreated: (doc: DIDDocument) => void;
}

export const DIDCreator = ({ onDIDCreated }: DIDCreatorProps) => {
  const { walletAddress } = useWallet();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [didDocument, setDidDocument] = useState<DIDDocument | null>(null);

  const generateUniqueDNSLocation = () => {
    // Generate a random string for the subdomain
    const randomString = Math.random().toString(36).substring(2, 8);
    return `example-${randomString}.sandbox.openattestation.com`;
  };

  const createDID = async () => {
    if (!walletAddress) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to create a DID",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      const did = `did:ethr:${walletAddress}`;
      
      // Generate a unique sandbox DNS location
      const dnsLocation = generateUniqueDNSLocation();
      console.log("Generated DNS Location:", dnsLocation);
      
      const newDidDocument: DIDDocument = {
        id: `${did}#controller`,
        type: "Secp256k1VerificationKey2018",
        controller: did,
        ethereumAddress: walletAddress.toLowerCase(),
        dnsLocation: dnsLocation
      };

      console.log("Created DID Document:", newDidDocument);
      
      setDidDocument(newDidDocument);
      onDIDCreated(newDidDocument);
      
      toast({
        title: "DID Created",
        description: "Your DID has been created successfully",
      });

    } catch (error) {
      console.error('Error creating DID:', error);
      
      toast({
        title: "Error Creating DID",
        description: error instanceof Error ? error.message : "Failed to create DID",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create Document Identity</CardTitle>
        <CardDescription>
          Create a DID for document verification using the OpenAttestation sandbox
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={createDID} 
          disabled={isCreating || !walletAddress}
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
          <div className="mt-4 space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <pre className="whitespace-pre-wrap text-sm">
                {JSON.stringify(didDocument, null, 2)}
              </pre>
            </div>
            
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-green-500 mt-1" />
              <p>DID created with sandbox DNS location: {didDocument.dnsLocation}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};