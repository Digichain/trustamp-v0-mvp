import { ethers } from "ethers";
import { useToast } from "@/components/ui/use-toast";
import { DOCUMENT_STORE_ABI, DOCUMENT_STORE_BYTECODE, ISSUER_ROLE } from "./constants";
import { useContractVerification } from "./useContractVerification";
import { DocumentStoreContract, DocumentStoreInfo } from "./types";

export const useDocumentStore = () => {
  const { toast } = useToast();
  const { verifyContractCode, verifyDocumentStoreInterface } = useContractVerification();

  const deployDocumentStore = async (
    signer: ethers.Signer,
    name: string
  ): Promise<DocumentStoreContract> => {
    try {
      console.log("Starting document store deployment with name:", name);

      // Create contract factory
      const factory = new ethers.ContractFactory(
        DOCUMENT_STORE_ABI,
        DOCUMENT_STORE_BYTECODE,
        signer
      );

      // Deploy contract
      console.log("Deploying document store contract...");
      const signerAddress = await signer.getAddress();
      const contract = await factory.deploy(name, signerAddress);
      console.log("Waiting for deployment transaction...");
      
      // Wait for deployment to complete
      await contract.deployed();
      console.log("Document store deployed at:", contract.address);

      // Verify the contract implements the correct interface
      await verifyDocumentStoreInterface(contract as DocumentStoreContract, signerAddress);

      toast({
        title: "Success",
        description: "Document Store deployed successfully",
      });

      return contract as DocumentStoreContract;
    } catch (error: any) {
      console.error("Error deploying document store:", error);
      toast({
        title: "Deployment Error",
        description: error.message || "Failed to deploy document store",
        variant: "destructive",
      });
      throw error;
    }
  };

  const initializeContract = async (
    address: string,
    signer: ethers.Signer
  ): Promise<DocumentStoreContract> => {
    try {
      console.log("Initializing Document Store contract with address:", address);

      // Create provider
      const provider = signer.provider;
      if (!provider) {
        throw new Error("No provider available");
      }

      // Get the network for logging purposes
      const network = await provider.getNetwork();
      console.log("Connected to network:", network.name, "chainId:", network.chainId);

      // Verify contract exists at address
      await verifyContractCode(provider, address);

      // Create contract instance without ENS resolution
      console.log("Creating contract instance");
      const contract = new ethers.Contract(
        ethers.utils.getAddress(address), // Normalize the address format
        DOCUMENT_STORE_ABI,
        signer
      ) as DocumentStoreContract;

      // Get signer address for role verification
      const signerAddress = await signer.getAddress();

      // Verify it's a Document Store contract and check roles
      await verifyDocumentStoreInterface(contract, signerAddress);

      console.log("Document store contract initialized successfully");
      return contract;
    } catch (error: any) {
      console.error("Error initializing document store:", error);
      toast({
        title: "Contract Error",
        description: error.message || "Failed to initialize document store contract",
        variant: "destructive",
      });
      throw error;
    }
  };

  const issueDocument = async (
    contract: DocumentStoreContract,
    merkleRoot: string
  ): Promise<string> => {
    try {
      console.log("Issuing document with merkle root:", merkleRoot);

      // Ensure merkleRoot has 0x prefix
      const prefixedMerkleRoot = merkleRoot.startsWith("0x")
        ? merkleRoot
        : `0x${merkleRoot}`;
      console.log("Prefixed merkle root:", prefixedMerkleRoot);

      // Check if document is already issued
      const isAlreadyIssued = await contract.isIssued(prefixedMerkleRoot);
      if (isAlreadyIssued) {
        throw new Error("Document has already been issued");
      }

      // Call issue function
      console.log("Calling issue function...");
      const tx = await contract.issue(prefixedMerkleRoot);
      console.log("Issue transaction sent:", tx.hash);

      const receipt = await tx.wait();
      console.log("Transaction confirmed in block:", receipt.blockNumber);

      // Verify document was issued
      const isIssued = await contract.isIssued(prefixedMerkleRoot);
      if (!isIssued) {
        throw new Error("Document issuance verification failed");
      }

      toast({
        title: "Success",
        description: "Document issued successfully",
      });

      return tx.hash;
    } catch (error: any) {
      console.error("Error issuing document:", error);
      toast({
        title: "Issue Error",
        description: error.message || "Failed to issue document",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    deployDocumentStore,
    initializeContract,
    issueDocument,
  };
};