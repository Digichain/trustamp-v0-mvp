import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { signAndStoreDocument } from "@/utils/document-signer";
import { useWallet } from "@/contexts/WalletContext";
import { ethers } from 'ethers';
import { useTokenRegistry } from "./token/useTokenRegistry";
import { useAddressValidation } from "./token/useAddressValidation";

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
  const { 
    initializeContract, 
    checkTokenExists, 
    mintToken, 
    verifyTokenOwnership 
  } = useTokenRegistry();
  const { normalizeTokenRegistryAddress } = useAddressValidation();

  const handleSignDocument = async (transaction: Transaction) => {
    console.log("Starting document signing process for:", transaction.id);
    const isTransferable = transaction.document_subtype === 'transferable';
    
    try {
      if (!transaction.wrapped_document) {
        throw new Error("No wrapped document found to sign");
      }

      if (!walletAddress) {
        throw new Error("Wallet not connected");
      }

      let signedDocument;
      let signedStatus;

      if (isTransferable) {
        console.log("Signing transferable document using token registry");
        const { ethereum } = window as any;
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        
        // Extract and validate token registry address
        const rawTokenRegistryAddress = transaction.wrapped_document.data.issuers[0]?.tokenRegistry;
        if (!rawTokenRegistryAddress) {
          throw new Error("Invalid document structure: missing token registry address");
        }

        // Normalize the address
        const normalizedAddress = normalizeTokenRegistryAddress(rawTokenRegistryAddress);
        
        // Initialize contract
        const tokenRegistry = await initializeContract(normalizedAddress, signer);

        // Get merkle root and format for token ID
        const merkleRoot = transaction.wrapped_document.signature.merkleRoot;
        const formattedMerkleRoot = merkleRoot.startsWith('0x') ? merkleRoot : `0x${merkleRoot}`;
        const tokenId = ethers.BigNumber.from(formattedMerkleRoot);

        // Check if token exists
        const exists = await checkTokenExists(tokenRegistry, tokenId);
        if (exists) {
          throw new Error("Document has already been minted");
        }

        // Mint token
        await mintToken(tokenRegistry, walletAddress, tokenId);
        
        // Verify ownership
        await verifyTokenOwnership(tokenRegistry, tokenId, walletAddress);

        // Update signature with proof for transferable documents
        signedDocument = {
          ...transaction.wrapped_document,
          signature: {
            ...transaction.wrapped_document.signature,
            proof: {
              type: "OpenAttestationSignature2018",
              created: new Date().toISOString(),
              proofPurpose: "assertionMethod",
              verificationMethod: `did:ethr:${normalizedAddress}`,
              signature: formattedMerkleRoot,
              tokenRegistry: normalizedAddress,
              mintedOnTokenRegistry: true
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

      // Update transaction in database
      const { error: updateError } = await supabase
        .from("transactions")
        .update({ 
          status: signedStatus,
          signed_document: signedDocument,
          updated_at: new Date().toISOString()
        })
        .eq("id", transaction.id);

      if (updateError) {
        throw updateError;
      }

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