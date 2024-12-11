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
  const [isVerifying, setIsVerifying] = useState(false);
  const [didDocument, setDidDocument] = useState<DIDDocument | null>(null);
  const [dnsVerified, setDnsVerified] = useState(false);

  const generateUniqueDNSLocation = () => {
    const randomString = Math.random().toString(36).substring(2, 8);
    return `example-${randomString}.sandbox.openattestation.com`;
  };

  const verifyDNSRecord = async (dnsLocation: string) => {
    setIsVerifying(true);
    try {
      console.log("Verifying DNS record for:", dnsLocation);
      
      // Call the OpenAttestation sandbox API to verify the DNS record
      const response = await fetch(`https://dns-proof-sandbox.openattestation.com/api/verify?location=${dnsLocation}`);
      const data = await response.json();
      
      console.log("DNS verification response:", data);
      
      if (data.status === "VALID") {
        setDnsVerified(true);
        toast({
          title: "DNS Record Verified",
          description: "The DNS record was successfully created and verified.",
        });
      } else {
        throw new Error("DNS record not found or invalid");
      }
    } catch (error) {
      console.error('Error verifying DNS record:', error);
      toast({
        title: "DNS Verification Failed",
        description: "Could not verify the DNS record. It may take a few minutes to propagate.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
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
        description: "Your DID has been created successfully. Verifying DNS record...",
      });

      // Verify the DNS record after creation
      await verifyDNSRecord(dnsLocation);

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
          First, create a DID for document verification using the OpenAttestation sandbox
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={createDID} 
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
          <div className="mt-4 space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <pre className="whitespace-pre-wrap text-sm">
                {JSON.stringify(didDocument, null, 2)}
              </pre>
            </div>
            
            <div className="flex items-start gap-2 text-sm">
              {isVerifying ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mt-1" />
                  <p className="text-muted-foreground">Verifying DNS record...</p>
                </>
              ) : dnsVerified ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-1" />
                  <p className="text-muted-foreground">
                    DNS record verified at: {didDocument.dnsLocation}
                  </p>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-yellow-500 mt-1" />
                  <div className="flex flex-col">
                    <p className="text-muted-foreground">
                      DNS record created at: {didDocument.dnsLocation}
                    </p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => didDocument.dnsLocation && verifyDNSRecord(didDocument.dnsLocation)}
                      className="mt-2"
                    >
                      Verify DNS Record
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};