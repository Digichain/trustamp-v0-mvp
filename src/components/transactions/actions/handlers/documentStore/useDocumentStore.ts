import { useState } from 'react';
import { ethers } from 'ethers';
import { useToast } from "@/components/ui/use-toast";
import { 
  DOCUMENT_STORE_ABI, 
  DOCUMENT_STORE_BYTECODE,
} from './contracts/DocumentStoreConstants';
import { DocumentStoreContract, ISSUER_ROLE, REVOKER_ROLE } from './types';

export const useDocumentStore = () => {
  const [isDeploying, setIsDeploying] = useState(false);
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

      // Get bytecode from artifact
      const bytecode = DOCUMENT_STORE_BYTECODE;
      if (!bytecode || bytecode === "0x") {
        console.error("Invalid bytecode:", bytecode);
        throw new Error("Document store bytecode is invalid or empty");
      }

      console.log("Creating contract factory with bytecode length:", bytecode.length);
      
      // Create contract factory
      const factory = new ethers.ContractFactory(
        DOCUMENT_STORE_ABI,
        bytecode,
        signer
      );

      console.log("Deploying document store contract with params:", {
        name,
        owner: signerAddress
      });
      
      // Deploy with constructor arguments
      const contract = await factory.deploy(name, signerAddress) as DocumentStoreContract;
      console.log("Deployment transaction hash:", contract.deployTransaction.hash);
      
      console.log("Waiting for deployment confirmation...");
      await contract.deployed();
      console.log("Document store deployed at:", contract.address);

      // Verify contract code was deployed
      const deployedCode = await provider.getCode(contract.address);
      if (deployedCode === "0x") {
        throw new Error("Contract deployment failed - no bytecode at deployed address");
      }

      // Grant roles to owner
      console.log("Granting roles to owner:", signerAddress);
      await contract.grantRole(ISSUER_ROLE, signerAddress);
      await contract.grantRole(REVOKER_ROLE, signerAddress);

      toast({
        title: "Document Store Deployed",
        description: `Contract deployed at ${contract.address}`,
      });

      return contract;

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

  return {
    isDeploying,
    deployDocumentStore,
  };
};