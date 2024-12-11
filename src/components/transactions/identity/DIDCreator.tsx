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
      const newDidDocument: DIDDocument = {
        id: `${did}#controller`,
        type: "Secp256k1VerificationKey2018",
        controller: did,
        ethereumAddress: walletAddress.toLowerCase()
      };

      // Simulating DNS record creation at sandbox.openattestation.com
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulating API call
      
      const domainName = `${generateRandomSubdomain()}.sandbox.openattestation.com`;
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);

      setDidDocument(newDidDocument);
      setDnsRecord(`Record created at ${domainName} and will stay valid until ${expiryDate.toLocaleString()}`);
      
      onDIDCreated(newDidDocument);
      
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

  const generateRandomSubdomain = () => {
    const adjectives = ['intermediate', 'dynamic', 'swift', 'bright'];
    const colors = ['sapphire', 'emerald', 'ruby', 'amber'];
    const animals = ['catfish', 'dolphin', 'penguin', 'tiger'];
    
    const randomElement = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
    return `${randomElement(adjectives)}-${randomElement(colors)}-${randomElement(animals)}`;
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