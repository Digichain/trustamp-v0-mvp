import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useWallet } from "@/contexts/WalletContext";
import { signAndStoreDocument } from "@/utils/document-signer";
import { useDocumentStoreInteraction } from "./documentStore/useDocumentStoreInteraction";

export const useSigningHandler = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { walletAddress } = useWallet();
  const { issueDocument } = useDocumentStoreInteraction();

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

        // Get merkle root from wrapped document and ensure it has 0x prefix
        const rawMerkleRoot = transaction.wrapped_document.signature.merkleRoot;
        if (!rawMerkleRoot) {
          throw new Error("Merkle root not found in wrapped document");
        }

        // Ensure merkle root has 0x prefix
        const prefixedMerkleRoot = rawMerkleRoot.startsWith('0x') ? rawMerkleRoot : `0x${rawMerkleRoot}`;
        console.log("Using merkle root with prefix:", prefixedMerkleRoot);

        // Issue the document
        const receipt = await issueDocument(
          prefixedAddress,
          prefixedMerkleRoot
        );

        console.log("Document issued successfully:", receipt);

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