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
  const [dnsRecord, setDnsRecord] = useState<string>('');

  const generateRandomSubdomain = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(7);
    return `did-${timestamp}-${random}`;
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

    console.log("Starting DID creation process with wallet:", walletAddress);
    setIsCreating(true);
    
    try {
      const did = `did:ethr:${walletAddress}`;
      // Using a more reliable test domain
      const dnsLocation = `${generateRandomSubdomain()}.test.dev`;
      
      console.log("Generated DID:", did);
      console.log("DNS Location:", dnsLocation);

      const newDidDocument: DIDDocument = {
        id: `${did}#controller`,
        type: "Secp256k1VerificationKey2018",
        controller: did,
        ethereumAddress: walletAddress.toLowerCase(),
        dnsLocation
      };

      console.log("Created DID Document:", newDidDocument);

      // Simulating DNS record creation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);

      setDidDocument(newDidDocument);
      setDnsRecord(`Record created at ${dnsLocation} and will stay valid until ${expiryDate.toLocaleString()}`);
      
      onDIDCreated(newDidDocument);
      
      console.log("DID creation completed successfully");
      
      toast({
        title: "DID Created Successfully",
        description: "Your DID has been created and bound to the DNS record",
      });
    } catch (error) {
      console.error('Error creating DID:', error);
      toast({
        title: "Error Creating DID",
        description: "Failed to create DID and DNS record",
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
          Create a DID and bind it to a DNS record for document verification
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
            
            {dnsRecord && (
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-1" />
                <p>{dnsRecord}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};