import { ethers } from "ethers";
import { useToast } from "@/components/ui/use-toast";
import { DOCUMENT_STORE_ABI } from "./contracts/DocumentStoreConstants";

export const useDocumentStoreInteraction = () => {
  const { toast } = useToast();

  const getContract = async (contractAddress: string) => {
    try {
      console.log("Getting contract instance for address:", contractAddress);
      
      if (!window.ethereum) {
        throw new Error('MetaMask not found');
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      console.log('Got signer from provider');

      const contract = new ethers.Contract(contractAddress, DOCUMENT_STORE_ABI, signer);
      console.log('Created contract instance');
      
      return contract;
    } catch (error) {
      console.error("Error getting contract instance:", error);
      throw error;
    }
  };

  const issueDocument = async (contractAddress: string, merkleRoot: string) => {
    try {
      console.log("Starting document issuance process...");
      console.log("Contract address:", contractAddress);
      console.log("Merkle root:", merkleRoot);

      const contract = await getContract(contractAddress);
      
      console.log("Checking if document is already issued...");
      const isAlreadyIssued = await contract.isIssued(merkleRoot);
      
      if (isAlreadyIssued) {
        throw new Error("Document has already been issued");
      }

      console.log("Issuing document...");
      const tx = await contract.issue(merkleRoot, {
        gasLimit: 500000 // Increased gas limit for safety
      });
      console.log("Waiting for transaction confirmation...");
      
      const receipt = await tx.wait(2); // Wait for 2 block confirmations
      console.log("Document issued successfully:", receipt);

      toast({
        title: "Document Issued",
        description: "Document has been successfully issued to the store",
      });

      return receipt;

    } catch (error: any) {
      console.error("Error issuing document:", error);
      toast({
        title: "Issuance Failed",
        description: error.message || "Failed to issue document",
        variant: "destructive",
      });
      throw error;
    }
  };

  const revokeDocument = async (contractAddress: string, merkleRoot: string) => {
    try {
      console.log("Starting document revocation process...");
      const contract = await getContract(contractAddress);

      const tx = await contract.revoke(merkleRoot, {
        gasLimit: 500000
      });
      const receipt = await tx.wait(2);

      toast({
        title: "Document Revoked",
        description: "Document has been successfully revoked",
      });

      return receipt;
    } catch (error: any) {
      console.error("Error revoking document:", error);
      toast({
        title: "Revocation Failed",
        description: error.message || "Failed to revoke document",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    getContract,
    issueDocument,
    revokeDocument
  };
};