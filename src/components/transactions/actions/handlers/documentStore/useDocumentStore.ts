import { useState } from 'react';
import { ethers } from 'ethers';
import { useToast } from "@/components/ui/use-toast";
import { 
  DOCUMENT_STORE_ABI, 
  DOCUMENT_STORE_BYTECODE,
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

      // Verify bytecode exists and is valid
      if (!DOCUMENT_STORE_BYTECODE || DOCUMENT_STORE_BYTECODE === "0x") {
        console.error("Invalid bytecode:", DOCUMENT_STORE_BYTECODE);
        throw new Error("Document store bytecode is invalid or empty");
      }

      console.log("Bytecode length:", DOCUMENT_STORE_BYTECODE.length);
      console.log("First 64 chars of bytecode:", DOCUMENT_STORE_BYTECODE.substring(0, 64));

      // Create contract factory
      const factory = new ethers.ContractFactory(
        DOCUMENT_STORE_ABI,
        DOCUMENT_STORE_BYTECODE,
        signer
      );

      console.log("Deploying document store contract...");
      // Deploy with constructor arguments: name and owner address, letting MetaMask estimate gas
      const contract = await factory.deploy(name, signerAddress);
      
      console.log("Waiting for deployment transaction...");
      const deployedContract = await contract.deployed() as DocumentStoreContract;
      console.log("Document store deployed at:", deployedContract.address);

      // Verify contract code was deployed
      const deployedCode = await provider.getCode(deployedContract.address);
      if (deployedCode === "0x") {
        throw new Error("Contract deployment failed - no bytecode at deployed address");
      }
      console.log("Deployed contract bytecode length:", deployedCode.length);

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

  return {
    isDeploying,
    isIssuing,
    deployDocumentStore,
  };
};