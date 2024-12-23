import { ethers } from "ethers";
import { useToast } from "@/components/ui/use-toast";

// Document Store ABI with required functions
const DOCUMENT_STORE_ABI = [
  "function issue(bytes32 document) public",
  "function issued(bytes32 document) public view returns (bool)",
  "function revoke(bytes32 document) public",
  "function revoked(bytes32 document) public view returns (bool)",
  "function owner() public view returns (address)"
];

export const useDocumentStore = () => {
  const { toast } = useToast();

  const extractAddress = (rawAddress: string): string => {
    // If the address contains a colon, it's in OpenAttestation format
    if (rawAddress.includes(':')) {
      // Extract everything after "string:"
      const matches = rawAddress.match(/:string:(.+)$/);
      if (matches && matches[1]) {
        return matches[1];
      }
      throw new Error("Invalid address format in document");
    }
    return rawAddress;
  };

  const initializeContract = async (address: string, signer: ethers.Signer) => {
    try {
      console.log("Raw document store address:", address);
      
      // Extract and normalize the Ethereum address
      const cleanAddress = extractAddress(address);
      console.log("Extracted clean address:", cleanAddress);
      
      const normalizedAddress = ethers.utils.getAddress(cleanAddress);
      console.log("Normalized address:", normalizedAddress);
      
      // Create provider without ENS resolution
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      
      // Get the network for logging purposes
      const network = await provider.getNetwork();
      console.log("Connected to network:", network.name, "chainId:", network.chainId);
      
      // Create contract instance with explicit address
      const contract = new ethers.Contract(
        normalizedAddress,
        DOCUMENT_STORE_ABI,
        provider.getSigner()
      );
      
      // Verify contract exists by calling a view function
      try {
        await contract.owner();
        console.log("Contract verified at address:", normalizedAddress);
      } catch (error) {
        console.error("Contract verification failed:", error);
        throw new Error("No valid Document Store contract found at the provided address. Please ensure the contract is deployed and you're on the correct network.");
      }
      
      console.log("Document store contract instance created");
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

  const issueDocument = async (contract: ethers.Contract, merkleRoot: string) => {
    try {
      console.log("Issuing document with merkle root:", merkleRoot);
      
      // Ensure merkleRoot has 0x prefix
      const prefixedMerkleRoot = merkleRoot.startsWith('0x') ? merkleRoot : `0x${merkleRoot}`;
      
      // Verify contract is ready by checking owner
      try {
        const owner = await contract.owner();
        console.log("Contract owner verified:", owner);
      } catch (error) {
        console.error("Contract verification failed:", error);
        throw new Error("Contract is not accessible. Please check your network connection and wallet settings.");
      }
      
      // Call issue function with direct address
      console.log("Calling issue function with merkle root:", prefixedMerkleRoot);
      const tx = await contract.issue(prefixedMerkleRoot);
      console.log("Issue transaction sent:", tx.hash);
      
      const receipt = await tx.wait();
      console.log("Transaction confirmed in block:", receipt.blockNumber);
      
      return tx.hash;
    } catch (error: any) {
      console.error("Error issuing document:", error);
      
      // Check for specific error types
      if (error.code === -32000) {
        throw new Error("Contract execution failed. Please ensure you have the correct permissions and are on the right network.");
      }
      
      toast({
        title: "Issue Error",
        description: "Failed to issue document. Please check the console for details.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const verifyIssuance = async (contract: ethers.Contract, merkleRoot: string) => {
    try {
      console.log("Verifying document issuance for merkle root:", merkleRoot);
      
      // Ensure merkleRoot has 0x prefix
      const prefixedMerkleRoot = merkleRoot.startsWith('0x') ? merkleRoot : `0x${merkleRoot}`;
      
      const isIssued = await contract.issued(prefixedMerkleRoot);
      console.log("Document issuance status:", isIssued);
      
      return isIssued;
    } catch (error: any) {
      console.error("Error verifying document issuance:", error);
      throw error;
    }
  };

  return {
    initializeContract,
    issueDocument,
    verifyIssuance
  };
};