import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { TitleEscrow__factory } from "@govtechsg/token-registry/dist/contracts";
import { ethers } from "ethers";

export const useTokenRegistryCreation = (onRegistryCreated: (doc: any) => void) => {
  const [isCreating, setIsCreating] = useState(false);
  const [registryDocument, setRegistryDocument] = useState<any | null>(null);
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

      // Deploy new TitleEscrow contract using the factory
      const factory = new TitleEscrow__factory(signer);
      console.log('Created TitleEscrow factory');

      console.log('Deploying TitleEscrow...');
      const titleEscrow = await factory.deploy();
      console.log('Contract deployment transaction sent, waiting for confirmation...');
      
      const deployedContract = await titleEscrow.deployed();
      console.log('TitleEscrow deployed at:', deployedContract.address);

      const newRegistryDocument = {
        contractAddress: deployedContract.address,
        name,
        symbol,
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
      const owner = await titleEscrow.beneficiary();

      const existingRegistryDocument = {
        contractAddress: address,
        name: "Title Escrow",
        symbol: "TE",
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