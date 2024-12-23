import { ethers } from "ethers";
import { useToast } from "@/components/ui/use-toast";
import { DOCUMENT_STORE_ABI } from "./constants";

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

  const mintDocument = async (contractAddress: string, toAddress: string, merkleRoot: string) => {
    try {
      console.log("Starting document minting process...");
      console.log("Contract address:", contractAddress);
      console.log("To address:", toAddress);
      console.log("Raw merkle root:", merkleRoot);

      const contract = await getContract(contractAddress);

      // Validate merkle root format
      if (!merkleRoot || merkleRoot.length !== 66) { // 0x + 64 hex chars
        console.error("Invalid merkle root format:", merkleRoot);
        throw new Error("Invalid merkle root format");
      }

      // Ensure merkle root is properly formatted
      const merkleRootHex = merkleRoot.startsWith('0x') ? merkleRoot : `0x${merkleRoot}`;
      console.log("Merkle root in hex format:", merkleRootHex);

      // Validate the merkle root is a valid hex string
      if (!ethers.utils.isHexString(merkleRootHex)) {
        console.error("Invalid hex string for merkle root:", merkleRootHex);
        throw new Error("Invalid merkle root hex format");
      }

      // Check if document is already minted
      const isIssued = await contract.isIssued(merkleRootHex);
      if (isIssued) {
        console.error("Document already minted for merkle root:", merkleRootHex);
        throw new Error("Document has already been minted");
      }

      console.log("Attempting to mint document with merkle root:", merkleRootHex);

      // Mint the document with higher gas limit to ensure completion
      const tx = await contract.safeMint(toAddress, merkleRootHex, {
        gasLimit: 1000000 // Increased gas limit
      });
      console.log("Minting transaction sent:", tx.hash);

      // Wait for confirmation with more blocks
      const receipt = await tx.wait(2); // Wait for 2 block confirmations
      console.log("Minting confirmed in block:", receipt.blockNumber);

      if (receipt.status === 0) {
        throw new Error("Transaction failed during execution");
      }

      return receipt;
    } catch (error: any) {
      console.error("Error minting document:", error);
      
      // Provide more specific error messages based on the error type
      if (error.message.includes("gas")) {
        throw new Error("Transaction failed due to gas estimation. Please try with a higher gas limit.");
      } else if (error.message.includes("rejected")) {
        throw new Error("Transaction was rejected by the user");
      } else {
        throw new Error(error.message || "Failed to mint document");
      }
    }
  };

  const checkMerkleRoot = async (contractAddress: string, merkleRoot: string) => {
    try {
      const contract = await getContract(contractAddress);
      const merkleRootHex = merkleRoot.startsWith('0x') ? merkleRoot : `0x${merkleRoot}`;
      
      if (!ethers.utils.isHexString(merkleRootHex)) {
        throw new Error("Invalid merkle root format");
      }
      
      const isIssued = await contract.isIssued(merkleRootHex);
      return isIssued;
    } catch (error) {
      console.error("Error checking merkle root:", error);
      throw error;
    }
  };

  return {
    getContract,
    mintDocument,
    checkMerkleRoot
  };
};