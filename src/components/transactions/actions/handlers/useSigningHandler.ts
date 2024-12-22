import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { signAndStoreDocument } from "@/utils/document-signer";
import { useWallet } from "@/contexts/WalletContext";
import { ethers } from 'ethers';
import TokenRegistryArtifact from '@/contracts/TokenRegistry';

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

  const handleSignDocument = async (transaction: Transaction) => {
    console.log("Starting document signing process for:", transaction.id);
    console.log("Full wrapped document:", JSON.stringify(transaction.wrapped_document, null, 2));
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
        // Get token registry instance
        const { ethereum } = window as any;
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        
        // Extract token registry address from wrapped document
        const tokenRegistryAddress = transaction.wrapped_document.data.issuers[0]?.tokenRegistry;
        console.log("Token registry address from document:", tokenRegistryAddress);
        
        if (!tokenRegistryAddress) {
          console.error("No token registry address found in issuer");
          throw new Error("Invalid document structure: missing token registry address");
        }

        // Ensure address is lowercase for consistency
        const normalizedAddress = tokenRegistryAddress.toLowerCase();
        console.log("Normalized token registry address:", normalizedAddress);

        if (!ethers.utils.isAddress(normalizedAddress)) {
          throw new Error("Invalid token registry address");
        }

        const tokenRegistry = new ethers.Contract(
          normalizedAddress,
          TokenRegistryArtifact.abi,
          signer
        );

        // Get merkle root and ensure 0x prefix
        const merkleRoot = transaction.wrapped_document.signature.merkleRoot;
        const formattedMerkleRoot = merkleRoot.startsWith('0x') ? merkleRoot : `0x${merkleRoot}`;
        console.log("Formatted merkle root:", formattedMerkleRoot);

        // Convert merkle root to BigNumber for token ID
        const tokenId = ethers.BigNumber.from(formattedMerkleRoot);
        console.log("Token ID for minting:", tokenId.toString());

        // Mint token
        console.log("Minting token...");
        const mintTx = await tokenRegistry.safeMint(walletAddress.toLowerCase(), tokenId);
        console.log("Mint transaction hash:", mintTx.hash);
        
        // Wait for confirmation
        const receipt = await mintTx.wait();
        console.log("Transaction confirmed, receipt:", receipt);

        // Verify token was minted
        const tokenOwner = await tokenRegistry.ownerOf(tokenId);
        console.log("Token owner after minting:", tokenOwner.toLowerCase());
        
        if (tokenOwner.toLowerCase() !== walletAddress.toLowerCase()) {
          throw new Error("Token minting verification failed - owner mismatch");
        }

        // Create proof with proper format for OpenAttestation verification
        const proof = [{
          type: "OpenAttestationMintable",
          method: "TOKEN_REGISTRY",
          value: normalizedAddress,
          tokenRegistry: normalizedAddress
        }];

        console.log("Created proof:", proof);

        signedDocument = {
          ...transaction.wrapped_document,
          proof
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
        console.error("Error updating transaction:", updateError);
        throw updateError;
      }

      console.log("Document signed successfully");
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