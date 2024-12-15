import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { TokenRegistryDocument } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { ContractFactory, ethers } from "ethers";
import TitleEscrowCreatorArtifact from "@govtechsg/token-registry/dist/contracts/TitleEscrowCreator.json";
import TitleEscrowFactoryArtifact from "@govtechsg/token-registry/dist/contracts/TitleEscrowFactory.json";
import TokenRegistryArtifact from "@govtechsg/token-registry/dist/contracts/TokenRegistry.json";

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
      
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();

      // Deploy TitleEscrowCreator
      console.log('Deploying TitleEscrowCreator...');
      const titleEscrowCreatorFactory = new ContractFactory(
        TitleEscrowCreatorArtifact.abi,
        TitleEscrowCreatorArtifact.bytecode,
        signer
      );
      const titleEscrowCreator = await titleEscrowCreatorFactory.deploy();
      await titleEscrowCreator.deployed();
      console.log('TitleEscrowCreator deployed at:', titleEscrowCreator.address);

      // Deploy TitleEscrowFactory
      console.log('Deploying TitleEscrowFactory...');
      const titleEscrowFactoryFactory = new ContractFactory(
        TitleEscrowFactoryArtifact.abi,
        TitleEscrowFactoryArtifact.bytecode,
        signer
      );
      const titleEscrowFactory = await titleEscrowFactoryFactory.deploy();
      await titleEscrowFactory.deployed();
      console.log('TitleEscrowFactory deployed at:', titleEscrowFactory.address);

      // Deploy TokenRegistry
      console.log('Deploying TokenRegistry...');
      const tokenRegistryFactory = new ContractFactory(
        TokenRegistryArtifact.abi,
        TokenRegistryArtifact.bytecode,
        signer
      );
      const tokenRegistry = await tokenRegistryFactory.deploy(
        name,
        symbol,
        titleEscrowCreator.address,
        titleEscrowFactory.address
      );
      await tokenRegistry.deployed();
      console.log('TokenRegistry deployed at:', tokenRegistry.address);

      // Create DNS record through Edge Function
      const { data, error } = await supabase.functions.invoke('oa-dns-records', {
        body: { 
          contractAddress: tokenRegistry.address,
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
        contractAddress: tokenRegistry.address,
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