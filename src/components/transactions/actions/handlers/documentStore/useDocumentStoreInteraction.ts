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

      // Convert merkle root to bytes32
      // First ensure the merkle root is in the correct hex format
      const merkleRootHex = merkleRoot.startsWith('0x') ? merkleRoot : `0x${merkleRoot}`;
      console.log("Merkle root in hex format:", merkleRootHex);

      // Pad to 32 bytes if needed
      const formattedMerkleRoot = ethers.utils.hexZeroPad(merkleRootHex, 32);
      console.log("Formatted merkle root:", formattedMerkleRoot);

      // Check ownership
      const owner = await contract.owner();
      console.log("Contract owner:", owner);
      console.log("Current signer:", toAddress);

      if (owner.toLowerCase() !== toAddress.toLowerCase()) {
        throw new Error("Only the contract owner can mint documents");
      }

      // Mint the document with explicit gas limit
      const tx = await contract.safeMint(toAddress, formattedMerkleRoot, {
        gasLimit: 500000
      });
      console.log("Minting transaction sent:", tx.hash);

      // Wait for confirmation
      const receipt = await tx.wait();
      console.log("Minting confirmed in block:", receipt.blockNumber);

      return receipt;
    } catch (error) {
      console.error("Error minting document:", error);
      throw error;
    }
  };

  const checkMerkleRoot = async (contractAddress: string, merkleRoot: string) => {
    try {
      const contract = await getContract(contractAddress);
      const merkleRootHex = merkleRoot.startsWith('0x') ? merkleRoot : `0x${merkleRoot}`;
      const formattedMerkleRoot = ethers.utils.hexZeroPad(merkleRootHex, 32);
      const isIssued = await contract.isMerkleRootIssued(formattedMerkleRoot);
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