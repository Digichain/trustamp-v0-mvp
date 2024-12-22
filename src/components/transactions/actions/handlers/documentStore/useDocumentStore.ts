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

  const initializeContract = async (address: string, signer: ethers.Signer) => {
    try {
      console.log("Initializing document store contract at address:", address);
      
      // Create provider with Sepolia network configuration
      const provider = new ethers.providers.Web3Provider(window.ethereum, {
        name: 'sepolia',
        chainId: 11155111
      });
      
      console.log("Document store contract instance created");
      return new ethers.Contract(address, DOCUMENT_STORE_ABI, provider.getSigner());
    } catch (error: any) {
      console.error("Error initializing document store:", error);
      toast({
        title: "Contract Error",
        description: "Failed to initialize document store contract",
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
      
      const tx = await contract.issue(prefixedMerkleRoot);
      console.log("Issue transaction sent:", tx.hash);
      
      await tx.wait();
      console.log("Document issued successfully");
      
      return tx.hash;
    } catch (error: any) {
      console.error("Error issuing document:", error);
      toast({
        title: "Issue Error",
        description: "Failed to issue document",
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