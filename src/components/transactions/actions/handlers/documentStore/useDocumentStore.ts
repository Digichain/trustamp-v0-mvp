import { useState } from 'react';
import { ethers } from 'ethers';
import { useToast } from "@/components/ui/use-toast";
import { DocumentStoreABI, DocumentStoreBytecode } from './constants';

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

      // Create contract factory
      const factory = new ethers.ContractFactory(
        DocumentStoreABI,
        DocumentStoreBytecode,
        signer
      );

      console.log("Deploying document store contract...");
      const contract = await factory.deploy(name, signerAddress);
      console.log("Waiting for deployment transaction...");
      
      const deployedContract = await contract.deployed();
      console.log("Document store deployed at:", deployedContract.address);

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

  const initializeDocumentStore = async (signer: ethers.Signer, address: string) => {
    console.log("Initializing Document Store contract with address:", address);

    try {
      const provider = signer.provider;
      if (!provider) {
        throw new Error("No provider available");
      }

      // Create contract instance
      const contract = new ethers.Contract(
        ethers.utils.getAddress(address),
        DocumentStoreABI,
        signer
      );

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

  const issueDocument = async (
    signer: ethers.Signer,
    storeAddress: string,
    documentHash: string
  ) => {
    console.log("Starting document issuance process...");
    console.log("Store address:", storeAddress);
    console.log("Document hash:", documentHash);
    
    setIsIssuing(true);

    try {
      const contract = await initializeDocumentStore(signer, storeAddress);
      
      console.log("Checking if document is already issued...");
      const isAlreadyIssued = await contract.isIssued(documentHash);
      
      if (isAlreadyIssued) {
        throw new Error("Document has already been issued");
      }

      console.log("Issuing document...");
      const tx = await contract.issue(documentHash);
      console.log("Waiting for transaction confirmation...");
      
      const receipt = await tx.wait();
      console.log("Document issued successfully:", receipt);

      toast({
        title: "Document Issued",
        description: "Document has been successfully issued to the store",
      });

      return receipt;

    } catch (error) {
      console.error("Error issuing document:", error);
      toast({
        title: "Issuance Failed",
        description: error instanceof Error ? error.message : "Failed to issue document",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsIssuing(false);
    }
  };

  return {
    isDeploying,
    isIssuing,
    deployDocumentStore,
    initializeDocumentStore,
    issueDocument,
  };
};