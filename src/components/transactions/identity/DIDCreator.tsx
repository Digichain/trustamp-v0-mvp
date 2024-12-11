import { useState } from 'react';
import { useWallet } from "@/contexts/WalletContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const verifyDNSRecord = async (dnsLocation: string, did: string, retryCount = 0): Promise<boolean> => {
    try {
      console.log(`Attempting DNS verification (attempt ${retryCount + 1})...`);
      const response = await fetch(`https://dns.google/resolve?name=${dnsLocation}&type=TXT`);
      const data = await response.json();
      
      console.log("DNS verification response:", data);
      
      if (data.Status === 0 && data.Answer) {
        const txtRecords = data.Answer.map((record: any) => record.data);
        const didRecord = txtRecords.find((record: string) => record.includes(did.split(':')[2].split('#')[0]));
        
        if (didRecord) {
          setDnsStatus({ message: "DNS record found and verified" });
          return true;
        }
      }
      
      if (retryCount < 5) {
        setDnsStatus({ message: `DNS record not found, retrying in 10 seconds... (attempt ${retryCount + 1}/5)` });
        await delay(10000);
        return verifyDNSRecord(dnsLocation, did, retryCount + 1);
      }

      setDnsStatus({ 
        message: "DNS record could not be verified after multiple attempts",
        isError: true 
      });
      return false;
    } catch (error) {
      console.error("DNS verification error:", error);
      setDnsStatus({ 
        message: "Error verifying DNS record",
        isError: true 
      });
      return false;
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

      // Create DNS record using Supabase Edge Function
      setDnsStatus({ message: "Creating DNS record..." });
      const { data: createResponse, error: createError } = await supabase.functions.invoke('create-dns-record', {
        body: {
          did: newDidDocument.id,
          subdomain: dnsLocation.split('.')[0]
        }
      });

      if (createError || !createResponse?.success) {
        console.error("Error creating DNS record:", createError || createResponse);
        throw new Error(createError?.message || createResponse?.message || "Failed to create DNS record");
      }

      console.log("DNS record creation response:", createResponse);
      setDnsStatus({ message: "DNS record created, waiting for propagation..." });
      
      // Verify DNS record with retries
      const isVerified = await verifyDNSRecord(dnsLocation, did);
      
      if (isVerified) {
        setDidDocument(newDidDocument);
        onDIDCreated(newDidDocument);
        
        toast({
          title: "DID Created",
          description: "Your DID has been created and verified on DNS",
        });
      } else {
        throw new Error("DNS record verification failed after multiple attempts");
      }
    } catch (error) {
      console.error('Error creating DID:', error);
      setDnsStatus({ 
        message: error instanceof Error ? error.message : "Failed to create DID and DNS record",
        isError: true 
      });
      
      toast({
        title: "Error Creating DID",
        description: error instanceof Error ? error.message : "Failed to create DID and DNS record",
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