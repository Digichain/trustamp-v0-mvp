import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { TokenRegistryDocument } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { deploy } from "@govtechsg/token-registry";
import { ethers } from "ethers";

export const useTokenRegistryCreation = (onRegistryCreated: (doc: TokenRegistryDocument) => void) => {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [registryDocument, setRegistryDocument] = useState<TokenRegistryDocument | null>(null);

  const createTokenRegistry = async (walletAddress: string, name: string, symbol: string) => {
    setIsCreating(true);
    try {
      console.log('Creating Token Registry with params:', { walletAddress, name, symbol });
      
      // Get the Ethereum provider from MetaMask
      const { ethereum } = window as any;
      if (!ethereum) throw new Error('MetaMask not found');
      
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      
      // Deploy the token registry contract
      console.log('Deploying token registry contract...');
      const contractAddress = await deploy(name, symbol, signer);
      console.log('Token Registry deployed at:', contractAddress);

      // Create DNS record through Edge Function
      const { data, error } = await supabase.functions.invoke('oa-dns-records', {
        body: { 
          contractAddress,
          action: 'create',
          type: 'token-registry'
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

      const newRegistryDocument: TokenRegistryDocument = {
        contractAddress,
        name,
        symbol,
        dnsLocation: data.data.dnsLocation
      };

      console.log('Created Token Registry Document:', newRegistryDocument);
      
      setRegistryDocument(newRegistryDocument);
      onRegistryCreated(newRegistryDocument);
      
      toast({
        title: "Token Registry Created",
        description: "Your token registry has been deployed successfully. Please set up your DNS record.",
      });

    } catch (error) {
      console.error('Error creating Token Registry:', error);
      
      toast({
        title: "Error Creating Token Registry",
        description: error instanceof Error ? error.message : "Failed to create token registry",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return {
    isCreating,
    registryDocument,
    createTokenRegistry
  };
};