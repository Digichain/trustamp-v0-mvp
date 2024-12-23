import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useWallet } from "@/contexts/WalletContext";
import { ethers } from 'ethers';
import { DOCUMENT_STORE_ABI } from "./documentStore/constants";
import { signAndStoreDocument } from "@/utils/document-signer";

export const useSigningHandler = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { walletAddress } = useWallet();

  const handleSignDocument = async (transaction: any) => {
    console.log("Starting document signing process for:", transaction.id);
    const isTransferable = transaction.document_subtype === 'transferable';
    
    try {
      if (!transaction.wrapped_document) {
        throw new Error("No wrapped document found");
      }

      if (!walletAddress) {
        throw new Error("Wallet not connected");
      }

      if (isTransferable) {
        console.log("Handling transferable document issuance");
        const { ethereum } = window as any;
        if (!ethereum) throw new Error("MetaMask not installed");

        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        // Get document store address from wrapped document
        const documentStoreAddress = transaction.wrapped_document.data.issuers[0]?.documentStore;
        if (!documentStoreAddress) {
          console.error("Document store address missing from wrapped document:", transaction.wrapped_document);
          throw new Error("Document store address not found in wrapped document");
        }

        // Extract the actual address from the end of the string (after the last ':')
        const addressParts = documentStoreAddress.toString().split(':');
        const actualAddress = addressParts[addressParts.length - 1].trim();
        console.log("Extracted actual address:", actualAddress);

        // Ensure the address has the 0x prefix
        const prefixedAddress = actualAddress.startsWith('0x') ? actualAddress : `0x${actualAddress}`;
        console.log("Prefixed address:", prefixedAddress);

        // Validate the address format
        if (!ethers.utils.isAddress(prefixedAddress)) {
          console.error("Invalid address format:", prefixedAddress);
          throw new Error(`Invalid document store address format: ${prefixedAddress}`);
        }

        // Convert to checksum address
        const checksummedAddress = ethers.utils.getAddress(prefixedAddress);
        console.log("Final checksummed address:", checksummedAddress);

        // Initialize contract with complete ABI
        const contract = new ethers.Contract(
          checksummedAddress,
          DOCUMENT_STORE_ABI,
          signer
        );

        // Get merkle root from wrapped document and format it properly
        const rawMerkleRoot = transaction.wrapped_document.signature.merkleRoot;
        if (!rawMerkleRoot) {
          throw new Error("Merkle root not found in wrapped document");
        }

        // Clean up the merkle root string and ensure it's the correct length
        const cleanMerkleRoot = rawMerkleRoot.replace('0x', '').padStart(64, '0');
        console.log("Cleaned merkle root:", cleanMerkleRoot);
        
        // Convert the merkle root to bytes32
        const merkleRootBytes = ethers.utils.hexZeroPad(`0x${cleanMerkleRoot}`, 32);
        console.log("Formatted merkle root bytes:", merkleRootBytes);

        // Check if merkle root is already issued
        const isAlreadyIssued = await contract.isMerkleRootIssued(merkleRootBytes);
        console.log("Is merkle root already issued?", isAlreadyIssued);
        
        if (isAlreadyIssued) {
          throw new Error("Document has already been issued");
        }

        // Get the owner of the contract
        const contractOwner = await contract.owner();
        console.log("Contract owner:", contractOwner);
        console.log("Current signer:", walletAddress);

        if (contractOwner.toLowerCase() !== walletAddress.toLowerCase()) {
          throw new Error("Only the contract owner can issue documents");
        }

        // Issue document using safeMint
        console.log("Minting document with parameters:", {
          to: walletAddress,
          merkleRoot: merkleRootBytes
        });
        
        const tx = await contract.safeMint(walletAddress, merkleRootBytes);
        console.log("Transaction sent:", tx.hash);
        
        console.log("Waiting for transaction confirmation...");
        await tx.wait();
        console.log("Document issued successfully");

        // Update transaction status
        const { error: updateError } = await supabase
          .from("transactions")
          .update({ 
            status: "document_issued",
            signed_document: transaction.wrapped_document,
            updated_at: new Date().toISOString()
          })
          .eq("id", transaction.id);

        if (updateError) throw updateError;

        await queryClient.invalidateQueries({ queryKey: ["transactions"] });
        
        toast({
          title: "Success",
          description: "Document issued successfully",
        });
        
        return true;
      } else {
        // Handle verifiable documents (non-transferable)
        const result = await signAndStoreDocument(
          transaction.wrapped_document,
          walletAddress.toLowerCase(),
          transaction.id
        );
        console.log("Verifiable document signed and stored:", result);
      }
    } catch (error: any) {
      console.error("Error in handleSignDocument:", error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    handleSignDocument,
  };
};