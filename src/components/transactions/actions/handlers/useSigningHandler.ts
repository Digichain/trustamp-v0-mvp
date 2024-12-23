import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { signAndStoreDocument } from "@/utils/document-signer";
import { useWallet } from "@/contexts/WalletContext";
import { ethers } from 'ethers';
import { useDocumentStore } from "./documentStore/useDocumentStore";

interface Transaction {
  id: string;
  document_subtype?: string;
  status: string;
  wrapped_document: any;
}

export const useSigningHandler = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { walletAddress } = useWallet();
  const { initializeDocumentStore, issueDocument } = useDocumentStore();

  const extractEthereumAddress = (input: string): string => {
    // Match the last occurrence of 0x followed by 40 hex characters
    const matches = input.match(/0x[a-fA-F0-9]{40}/g);
    if (!matches || matches.length === 0) {
      throw new Error("No valid Ethereum address found in input");
    }
    // Get the last match (in case there are multiple addresses)
    const address = matches[matches.length - 1];
    // Normalize the address
    return ethers.utils.getAddress(address);
  };

  const handleSignDocument = async (transaction: Transaction) => {
    console.log("Starting document signing process for:", transaction.id);
    const isTransferable = transaction.document_subtype === 'transferable';
    
    try {
      if (!transaction.wrapped_document) {
        console.error("No wrapped document found");
        throw new Error("No wrapped document found to sign");
      }

      if (!walletAddress) {
        console.error("No wallet address found");
        throw new Error("Wallet not connected");
      }

      let signedDocument;
      let signedStatus;

      if (isTransferable) {
        console.log("Signing transferable document using document store");
        const { ethereum } = window as any;
        if (!ethereum) {
          throw new Error("MetaMask not installed");
        }
        
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        console.log("Got signer from provider");

        // Get document store address from the document and normalize it
        const rawDocumentStore = transaction.wrapped_document.data.issuers[0]?.documentStore;
        console.log("Raw document store address:", rawDocumentStore);
        
        if (!rawDocumentStore) {
          console.error("Document store address not found in wrapped document:", transaction.wrapped_document);
          throw new Error("Document store address not found in document. Please ensure the document was created with a valid document store.");
        }

        // Extract and normalize the Ethereum address
        const documentStoreAddress = extractEthereumAddress(rawDocumentStore);
        console.log("Normalized document store address:", documentStoreAddress);

        // Initialize document store contract with normalized address
        const documentStore = await initializeDocumentStore(signer, documentStoreAddress);
        console.log("Document store contract initialized");

        // Get merkle root and issue document
        const merkleRoot = transaction.wrapped_document.signature.merkleRoot;
        console.log("Using merkle root for issuance:", merkleRoot);
        
        const txHash = await issueDocument(signer, documentStoreAddress, merkleRoot);
        console.log("Document issued with transaction hash:", txHash);

        // Update signature with proof
        signedDocument = {
          ...transaction.wrapped_document,
          signature: {
            ...transaction.wrapped_document.signature,
            proof: {
              type: "OpenAttestationSignature2018",
              created: new Date().toISOString(),
              proofPurpose: "assertionMethod",
              verificationMethod: documentStoreAddress,
              signature: merkleRoot
            }
          }
        };
        signedStatus = "document_issued";

      } else {
        console.log("Signing verifiable document using DID method");
        const result = await signAndStoreDocument(
          transaction.wrapped_document,
          walletAddress.toLowerCase(),
          transaction.id
        );
        signedDocument = result.signedDocument;
        signedStatus = "document_signed";
      }

      console.log("Updating transaction in database...");
      const { error: updateError } = await supabase
        .from("transactions")
        .update({ 
          status: signedStatus,
          signed_document: signedDocument,
          updated_at: new Date().toISOString()
        })
        .eq("id", transaction.id);

      if (updateError) {
        console.error("Error updating transaction:", updateError);
        throw updateError;
      }

      console.log("Transaction updated successfully");
      await queryClient.invalidateQueries({ queryKey: ["transactions"] });
      
      toast({
        title: "Success",
        description: isTransferable ? "Document issued successfully" : "Document signed successfully",
      });
      
      return true;
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