import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useWallet } from "@/contexts/WalletContext";
import { ethers } from 'ethers';
import { DOCUMENT_STORE_ABI } from "./documentStore/constants";

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
          throw new Error("Document store address not found in wrapped document");
        }

        // Get merkle root from wrapped document
        const merkleRoot = transaction.wrapped_document.signature.merkleRoot;
        console.log("Merkle root to be issued:", merkleRoot);

        // Initialize contract with minimal ABI
        const contract = new ethers.Contract(documentStoreAddress, DOCUMENT_STORE_ABI, signer);

        // Check if already issued
        const isAlreadyIssued = await contract.isIssued(merkleRoot);
        if (isAlreadyIssued) {
          throw new Error("Document has already been issued");
        }

        // Issue document by calling issue() with merkle root
        console.log("Issuing document to store:", documentStoreAddress);
        const tx = await contract.issue(merkleRoot);
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