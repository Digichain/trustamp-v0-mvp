import { useState } from 'react';
import { useWallet } from "@/contexts/WalletContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Loader2, RefreshCw } from "lucide-react";

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

  const verifyDNSRecord = async () => {
    if (!didDocument?.dnsLocation) {
      console.error('No DNS location to verify');
      return;
    }

    setIsVerifying(true);
    try {
      console.log('Verifying DNS record for location:', didDocument.dnsLocation);
      
      // Call the OpenAttestation verification endpoint
      const response = await fetch(`https://dns-proof-sandbox.openattestation.com/api/verify?location=${didDocument.dnsLocation}`);
      
      if (!response.ok) {
        throw new Error('Failed to verify DNS record');
      }

      const verificationResult = await response.json();
      console.log('DNS verification result:', verificationResult);

      if (verificationResult.status === 'verified') {
        setDnsVerified(true);
        toast({
          title: "DNS Record Verified",
          description: "The DNS record has been successfully verified.",
        });
      } else {
        toast({
          title: "DNS Not Yet Verified",
          description: "The DNS record exists but hasn't propagated yet. Please try again in a few moments.",
          variant: "warning",
        });
      }
    } catch (error) {
      console.error('Error verifying DNS record:', error);
      toast({
        title: "Verification Failed",
        description: "Failed to verify DNS record. Please try again later.",
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
      
      // Create DNS record via Edge Function
      const response = await fetch('/functions/v1/create-dns-record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ did }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create DNS record');
      }

      const { data } = await response.json();
      console.log('DNS Record creation response:', data);

      if (!data.dnsLocation) {
        throw new Error('DNS location not returned from API');
      }

      const newDidDocument: DIDDocument = {
        id: `${did}#controller`,
        type: "Secp256k1VerificationKey2018",
        controller: did,
        ethereumAddress: walletAddress.toLowerCase(),
        dnsLocation: data.dnsLocation
      };

      console.log('Created DID Document:', newDidDocument);
      
      setDidDocument(newDidDocument);
      onDIDCreated(newDidDocument);
      
      // Automatically attempt first verification
      await verifyDNSRecord();
      
      toast({
        title: "DID Created",
        description: "Your DID has been created successfully. Verification may take a few moments.",
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
            
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-1" />
                <p>DID created with sandbox DNS location: {didDocument.dnsLocation}</p>
              </div>

              <Button
                onClick={verifyDNSRecord}
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
        )}
      </CardContent>
    </Card>
  );
};