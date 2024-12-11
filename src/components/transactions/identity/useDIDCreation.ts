import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { DIDDocument } from "./types";
import { supabase } from "@/integrations/supabase/client";

export const useDIDCreation = (onDIDCreated: (doc: DIDDocument) => void) => {
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
      
      // Use OpenAttestation's verification API
      const response = await fetch(`https://api.openattestation.com/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'DNS-DID',
          location: didDocument.dnsLocation,
          network: 'mainnet'
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to verify DNS record');
      }

      const verificationResult = await response.json();
      console.log('DNS verification result:', verificationResult);

      if (verificationResult.status === 'VALID') {
        setDnsVerified(true);
        toast({
          title: "DNS Record Verified",
          description: "The DNS record has been successfully verified.",
        });
      } else {
        toast({
          title: "DNS Not Yet Verified",
          description: "The DNS record exists but hasn't propagated yet. Please try again in a few moments.",
          variant: "default",
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

  const createDID = async (walletAddress: string) => {
    setIsCreating(true);
    try {
      const did = `did:ethr:${walletAddress}`;
      console.log('Creating DID:', did);
      
      const { data, error } = await supabase.functions.invoke('manage-dns-records', {
        body: { 
          did,
          action: 'create'
        }
      });

      if (error) {
        console.error('Error from Edge Function:', error);
        throw error;
      }

      if (!data?.data?.dnsLocation) {
        throw new Error('DNS location not returned from API');
      }

      console.log('DNS Record creation response:', data);

      const newDidDocument: DIDDocument = {
        id: `${did}#controller`,
        type: "Secp256k1VerificationKey2018",
        controller: did,
        ethereumAddress: walletAddress.toLowerCase(),
        dnsLocation: data.data.dnsLocation
      };

      console.log('Created DID Document:', newDidDocument);
      
      setDidDocument(newDidDocument);
      onDIDCreated(newDidDocument);
      
      toast({
        title: "DID Created",
        description: "Your DID has been created successfully. Verification may take a few moments.",
      });

      // Wait a few seconds before first verification attempt
      setTimeout(verifyDNSRecord, 5000);

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

  return {
    isCreating,
    isVerifying,
    didDocument,
    dnsVerified,
    createDID,
    verifyDNSRecord
  };
};