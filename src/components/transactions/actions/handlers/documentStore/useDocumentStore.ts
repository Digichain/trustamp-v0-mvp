import { ethers } from "ethers";
import { useToast } from "@/components/ui/use-toast";
import { DOCUMENT_STORE_ABI, ISSUER_ROLE } from "./constants";
import { useContractVerification } from "./useContractVerification";
import { DocumentStoreContract, DocumentStoreInfo } from "./types";

export const useDocumentStore = () => {
  const { toast } = useToast();
  const { verifyContractCode, verifyDocumentStoreInterface } = useContractVerification();

  const extractAddress = (rawAddress: string): string => {
    console.log("Extracting address from:", rawAddress);
    if (rawAddress.includes(":")) {
      const matches = rawAddress.match(/:string:(.+)$/);
      if (matches && matches[1]) {
        console.log("Extracted address:", matches[1]);
        return matches[1];
      }
      throw new Error("Invalid address format in document");
    }
    return rawAddress;
  };

  const initializeContract = async (
    address: string,
    signer: ethers.Signer
  ): Promise<DocumentStoreContract> => {
    try {
      console.log("Initializing Document Store contract with address:", address);

      // Extract and normalize the Ethereum address
      const cleanAddress = extractAddress(address);
      console.log("Extracted clean address:", cleanAddress);

      const normalizedAddress = ethers.utils.getAddress(cleanAddress);
      console.log("Normalized address:", normalizedAddress);

      // Create provider
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      // Get the network for logging purposes
      const network = await provider.getNetwork();
      console.log("Connected to network:", network.name, "chainId:", network.chainId);

      // Verify contract exists at address
      await verifyContractCode(provider, normalizedAddress);

      // Create contract instance
      console.log("Creating contract instance");
      const contract = new ethers.Contract(
        normalizedAddress,
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
    initializeContract,
    issueDocument,
  };
};