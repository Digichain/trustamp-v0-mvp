import { useState } from 'react';
import { useWallet } from "@/contexts/WalletContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";

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
  const [dnsStatus, setDnsStatus] = useState<{ message: string; isError?: boolean } | null>(null);

  const generateRandomSubdomain = () => {
    const adjectives = ['intermediate', 'dynamic', 'swift', 'bright'];
    const colors = ['sapphire', 'emerald', 'ruby', 'amber'];
    const animals = ['catfish', 'dolphin', 'penguin', 'tiger'];
    
    const randomElement = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
    return `${randomElement(adjectives)}-${randomElement(colors)}-${randomElement(animals)}`;
  };

  const verifyDNSRecord = async (dnsLocation: string, did: string) => {
    try {
      // In a real implementation, this would make an API call to verify the DNS TXT record
      // For now, we'll simulate the verification process
      const response = await fetch(`https://dns.google/resolve?name=${dnsLocation}&type=TXT`);
      const data = await response.json();
      
      console.log("DNS verification response:", data);
      
      if (data.Status === 0 && data.Answer) {
        const txtRecords = data.Answer.map((record: any) => record.data);
        const didRecord = txtRecords.find((record: string) => record.includes(did));
        
        if (didRecord) {
          return { verified: true, message: "DNS record found and verified" };
        }
      }
      
      return { verified: false, message: "DNS record not found or not propagated yet" };
    } catch (error) {
      console.error("DNS verification error:", error);
      return { verified: false, message: "Error verifying DNS record" };
    }
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
      const dnsLocation = `${generateRandomSubdomain()}.sandbox.openattestation.com`;
      
      const newDidDocument: DIDDocument = {
        id: `${did}#controller`,
        type: "Secp256k1VerificationKey2018",
        controller: did,
        ethereumAddress: walletAddress.toLowerCase(),
        dnsLocation: dnsLocation
      };

      // Simulate DNS record creation
      setDnsStatus({ message: "Creating DNS record..." });
      
      // In a real implementation, this would make an API call to create the DNS record
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Verify DNS record
      const verificationResult = await verifyDNSRecord(dnsLocation, did);
      
      if (verificationResult.verified) {
        setDnsStatus({ message: verificationResult.message });
        setDidDocument(newDidDocument);
        onDIDCreated(newDidDocument);
        
        toast({
          title: "DID Created Successfully",
          description: "Your DID has been created and verified on DNS",
        });
      } else {
        setDnsStatus({ 
          message: verificationResult.message,
          isError: true 
        });
        
        toast({
          title: "DNS Verification Failed",
          description: verificationResult.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error creating DID:', error);
      setDnsStatus({ 
        message: "Failed to create DID and DNS record",
        isError: true 
      });
      
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

        {dnsStatus && (
          <div className="flex items-start gap-2 text-sm">
            {dnsStatus.isError ? (
              <AlertCircle className="h-4 w-4 text-destructive mt-1" />
            ) : (
              <Loader2 className="h-4 w-4 animate-spin mt-1" />
            )}
            <p className={dnsStatus.isError ? "text-destructive" : "text-muted-foreground"}>
              {dnsStatus.message}
            </p>
          </div>
        )}

        {didDocument && (
          <div className="mt-4 space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <pre className="whitespace-pre-wrap text-sm">
                {JSON.stringify(didDocument, null, 2)}
              </pre>
            </div>
            
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-green-500 mt-1" />
              <p>DID created and bound to {didDocument.dnsLocation}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};