import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { TokenRegistryDocument } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { ethers } from "ethers";
import { TitleEscrow__factory } from "@govtechsg/token-registry/dist/contracts";

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

      // Deploy new TitleEscrow contract
      const factory = new TitleEscrow__factory(signer);
      console.log('Created TitleEscrow factory');

      console.log('Deploying TitleEscrow...');
      const titleEscrow = await factory.deploy(name, symbol);
      console.log('Contract deployment transaction sent, waiting for confirmation...');
      
      const deployedContract = await titleEscrow.deployed();
      console.log('TitleEscrow deployed at:', deployedContract.address);

      const { data, error } = await supabase.functions.invoke('oa-dns-records', {
        body: {
          contractAddress: deployedContract.address,
          action: 'create',
          type: 'token-registry'
        }
      });

      if (error) throw error;
      if (!data?.data?.dnsLocation) throw new Error('DNS location not returned from API');

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

    } catch (error: any) {
      console.error('Error creating token registry:', error);
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const loadExistingRegistry = async (address: string) => {
    try {
      const { ethereum } = window as any;
      if (!ethereum) {
        throw new Error('MetaMask not found');
      }
      
      const provider = new ethers.providers.Web3Provider(ethereum);
      console.log('Loading existing registry at address:', address);

      const titleEscrow = TitleEscrow__factory.connect(address, provider);

      const [name, symbol, owner] = await Promise.all([
        titleEscrow.name(),
        titleEscrow.symbol(),
        titleEscrow.owner()
      ]);

      const { data, error } = await supabase.functions.invoke('oa-dns-records', {
        body: {
          contractAddress: address,
          action: 'create',
          type: 'token-registry'
        }
      });

      if (error) throw error;
      if (!data?.data?.dnsLocation) throw new Error('DNS location not returned from API');

      const existingRegistryDocument: TokenRegistryDocument = {
        contractAddress: address,
        name,
        symbol,
        dnsLocation: data.data.dnsLocation,
        ethereumAddress: owner
      };

      console.log('Setting existing registry document:', existingRegistryDocument);
      setRegistryDocument(existingRegistryDocument);
      onRegistryCreated(existingRegistryDocument);

    } catch (error: any) {
      console.error('Error loading existing registry:', error);
      throw error;
    }
  };

  return {
    isCreating,
    registryDocument,
    createTokenRegistry,
    loadExistingRegistry
  };
};