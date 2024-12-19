import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { TokenRegistryDocument } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { ContractFactory, ethers } from "ethers";
import TokenRegistryArtifact from '../../../contracts/TokenRegistry';

export const useTokenRegistryCreation = (onRegistryCreated: (doc: TokenRegistryDocument) => void) => {
  const [isCreating, setIsCreating] = useState(false);
  const [registryDocument, setRegistryDocument] = useState<TokenRegistryDocument | null>(null);
  const { toast } = useToast();

  const createTokenRegistry = async (walletAddress: string, name: string, symbol: string) => {
    console.log('Starting token registry creation with params:', { walletAddress, name, symbol });
    setIsCreating(true);
    
    try {
      const { ethereum } = window as any;
      if (!ethereum) {
        throw new Error('MetaMask not found');
      }
      
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      console.log('Got signer from provider');

      // Create contract factory with the compiled contract
      const factory = new ContractFactory(
        TokenRegistryArtifact.abi,
        TokenRegistryArtifact.bytecode,
        signer
      );
      console.log('Created contract factory');

      // Deploy contract without specifying gas - let MetaMask handle it
      console.log('Deploying TokenRegistry...');
      const tokenRegistry = await factory.deploy(walletAddress, name, symbol);
      console.log('Contract deployment transaction sent, waiting for confirmation...');
      
      // Wait for deployment confirmation
      const deployedContract = await tokenRegistry.deployed();
      console.log('TokenRegistry deployed at:', deployedContract.address);

      // Create DNS record via Supabase
      const { data, error } = await supabase.functions.invoke('oa-dns-records', {
        body: {
          contractAddress: deployedContract.address,
          action: 'create',
          type: 'token-registry'
        }
      });

      if (error) throw error;
      if (!data?.data?.dnsLocation) throw new Error('DNS location not returned from API');

      // Construct new registry document with all required properties
      const newRegistryDocument: TokenRegistryDocument = {
        contractAddress: deployedContract.address,
        name,
        symbol,
        dnsLocation: data.data.dnsLocation,
        ethereumAddress: walletAddress
      };

      console.log('Setting registry document:', newRegistryDocument);
      setRegistryDocument(newRegistryDocument);
      onRegistryCreated(newRegistryDocument);

      toast({
        title: "Token Registry Created",
        description: "Your token registry has been deployed successfully."
      });
    } catch (error: any) {
      console.error('Error creating token registry:', error);
      toast({
        title: "Error",
        description: `Failed to create token registry: ${error.message}`,
        variant: "destructive"
      });
      throw error;
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