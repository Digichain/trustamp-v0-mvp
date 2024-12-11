import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { DIDDocument } from "./types";
import { supabase } from "@/integrations/supabase/client";

export const useDIDCreation = (onDIDCreated: (doc: DIDDocument) => void) => {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [didDocument, setDidDocument] = useState<DIDDocument | null>(null);

  const createDID = async (walletAddress: string) => {
    setIsCreating(true);
    try {
      const did = `did:ethr:${walletAddress}`;
      console.log('Creating DID:', did);
      
      const { data, error } = await supabase.functions.invoke('oa-dns-records', {
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
        description: "Your DID has been created successfully. Please set up your DNS record.",
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

  return {
    isCreating,
    didDocument,
    createDID
  };
};