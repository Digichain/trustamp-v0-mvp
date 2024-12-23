import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useWallet } from "@/contexts/WalletContext";
import { ethers } from 'ethers';
import { DOCUMENT_STORE_ABI, ISSUER_ROLE } from "./documentStore/constants";
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
          throw new Error(`Invalid token registry address format: ${prefixedAddress}`);
        }

        // Convert to checksum address
        const checksummedAddress = ethers.utils.getAddress(prefixedAddress);
        console.log("Final checksummed address:", checksummedAddress);

        // Get merkle root from wrapped document and format it properly
        const rawMerkleRoot = transaction.wrapped_document.signature.merkleRoot;
        if (!rawMerkleRoot) {
          throw new Error("Merkle root not found in wrapped document");
        }

        // Clean up the merkle root string and ensure it's the correct length
        const cleanMerkleRoot = rawMerkleRoot.replace('0x', '').trim();
        if (cleanMerkleRoot.length !== 64) {
          throw new Error(`Invalid merkle root length: ${cleanMerkleRoot.length} chars (expected 64)`);
        }

        // Convert the merkle root to bytes32
        const merkleRootBytes = ethers.utils.hexZeroPad(`0x${cleanMerkleRoot}`, 32);
        console.log("Formatted merkle root bytes:", merkleRootBytes);

        // Initialize contract with minimal ABI
        const contract = new ethers.Contract(
          checksummedAddress,
          DOCUMENT_STORE_ABI,
          signer
        );

        // Check if the user has the ISSUER_ROLE
        const hasIssuerRole = await contract.hasRole(ISSUER_ROLE, walletAddress);
        console.log("Checking ISSUER_ROLE for address:", walletAddress);
        console.log("Has ISSUER_ROLE:", hasIssuerRole);

        if (!hasIssuerRole) {
          throw new Error("You don't have permission to issue documents. ISSUER_ROLE required.");
        }

        // Check if already issued
        const isAlreadyIssued = await contract.isIssued(merkleRootBytes);
        if (isAlreadyIssued) {
          throw new Error("Document has already been issued");
        }

        // Issue document by calling issue() with merkle root bytes
        console.log("Issuing document to store:", checksummedAddress);
        const tx = await contract.issue(merkleRootBytes);
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