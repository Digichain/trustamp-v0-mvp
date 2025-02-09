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

  const handleSignDocument = async (document: any) => {
    console.log("Starting document signing process for:", document.id);
    const isTransferable = document.document_subtype === 'transferable';
    
    try {
      if (!document.wrapped_document) {
        throw new Error("No wrapped document found");
      }

      if (!walletAddress) {
        throw new Error("Wallet not connected");
      }

      if (isTransferable) {
        console.log("Handling transferable document issuance");
        
        // Get document store address from wrapped document
        const documentStoreAddress = document.wrapped_document.data.issuers[0]?.documentStore;
        if (!documentStoreAddress) {
          console.error("Document store address missing from wrapped document:", document.wrapped_document);
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
        const rawMerkleRoot = document.wrapped_document.signature.merkleRoot;
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

        // Update document status
        const { error: updateError } = await supabase
          .from("documents")  // Changed from 'transactions' to 'documents'
          .update({ 
            status: "document_issued",
            signed_document: document.wrapped_document,
            updated_at: new Date().toISOString()
          })
          .eq("id", document.id);

        if (updateError) throw updateError;

        await queryClient.invalidateQueries({ queryKey: ["documents"] }); // Changed from 'transactions' to 'documents'
        
        toast({
          title: "Success",
          description: "Document issued successfully",
        });
        
        return true;
      } else {
        // Handle verifiable documents (non-transferable)
        console.log("Handling verifiable document signing");
        const result = await signAndStoreDocument(
          document.wrapped_document,
          walletAddress.toLowerCase(),
          document.id
        );
        
        console.log("Document signed and stored:", result);

        // Update document status for verifiable documents
        const { error: updateError } = await supabase
          .from("documents")  // Changed from 'transactions' to 'documents'
          .update({ 
            status: "document_signed",
            signed_document: result.signedDocument,
            updated_at: new Date().toISOString()
          })
          .eq("id", document.id);

        if (updateError) {
          console.error("Error updating document status:", updateError);
          throw updateError;
        }

        console.log("Document status updated to document_signed");
        await queryClient.invalidateQueries({ queryKey: ["documents"] }); // Changed from 'transactions' to 'documents'
        
        toast({
          title: "Success",
          description: "Document signed successfully",
        });

        return true;
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