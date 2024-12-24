import { useState } from 'react';
import { ethers } from 'ethers';
import { useToast } from "@/components/ui/use-toast";
import { 
  DOCUMENT_STORE_ABI, 
  DOCUMENT_STORE_BYTECODE,
  DOCUMENT_STORE_ACCESS_CONTROL_ADDRESS,
  ISSUER_ROLE,
  REVOKER_ROLE
} from './contracts/DocumentStoreConstants';
import { DocumentStoreContract } from './types';

export const useDocumentStore = () => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [isIssuing, setIsIssuing] = useState(false);
  const { toast } = useToast();

  const deployDocumentStore = async (signer: ethers.Signer, name: string) => {
    console.log("Starting document store deployment with name:", name);
    setIsDeploying(true);

    try {
      const provider = signer.provider;
      if (!provider) {
        throw new Error("No provider available");
      }

      const signerAddress = await signer.getAddress();
      console.log("Deploying from address:", signerAddress);

      if (!DOCUMENT_STORE_BYTECODE) {
        throw new Error("Document store bytecode is undefined");
      }

      // Create contract factory
      const factory = new ethers.ContractFactory(
        DOCUMENT_STORE_ABI,
        DOCUMENT_STORE_BYTECODE,
        signer
      );

      console.log("Deploying document store contract...");
      // Deploy with constructor arguments: name and owner address
      const contract = await factory.deploy(name, signerAddress, {
        gasLimit: 5000000 // Increased gas limit for safety
      });
      
      console.log("Waiting for deployment transaction...");
      const deployedContract = await contract.deployed() as DocumentStoreContract;
      console.log("Document store deployed at:", deployedContract.address);

      // Grant issuer and revoker roles to the owner
      const ISSUER_ROLE_HASH = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(ISSUER_ROLE));
      const REVOKER_ROLE_HASH = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(REVOKER_ROLE));
      
      await deployedContract.grantRole(ISSUER_ROLE_HASH, signerAddress);
      await deployedContract.grantRole(REVOKER_ROLE_HASH, signerAddress);

      toast({
        title: "Document Store Deployed",
        description: `Contract deployed at ${deployedContract.address}`,
      });

      return deployedContract;

    } catch (error) {
      console.error("Error deploying document store:", error);
      toast({
        title: "Deployment Failed",
        description: error instanceof Error ? error.message : "Failed to deploy document store",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsDeploying(false);
    }
  };

  const initializeDocumentStore = async (signer: ethers.Signer, address: string): Promise<DocumentStoreContract> => {
    console.log("Initializing Document Store contract with address:", address);

    try {
      const provider = signer.provider;
      if (!provider) {
        throw new Error("No provider available");
      }

      // Create contract instance with explicit typing
      const contract = new ethers.Contract(
        ethers.utils.getAddress(address),
        DOCUMENT_STORE_ABI,
        signer
      ) as DocumentStoreContract;

      console.log("Document store contract initialized");
      return contract;

    } catch (error) {
      console.error("Error initializing document store:", error);
      toast({
        title: "Initialization Failed",
        description: error instanceof Error ? error.message : "Failed to initialize document store",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    isDeploying,
    isIssuing,
    deployDocumentStore,
    initializeDocumentStore,
  };
};