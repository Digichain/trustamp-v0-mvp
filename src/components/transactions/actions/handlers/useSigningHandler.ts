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
        const tokenRegistryData = transaction.wrapped_document.data.tokenRegistry;
        let tokenRegistryAddress;

        // Check if tokenRegistry is in format "tokenRegistry: address"
        if (typeof tokenRegistryData === 'string' && tokenRegistryData.includes(': ')) {
          tokenRegistryAddress = tokenRegistryData.split(': ')[1].trim();
        } else {
          tokenRegistryAddress = tokenRegistryData;
        }

        console.log("Token registry address extracted:", tokenRegistryAddress);

        if (!tokenRegistryAddress || !ethers.utils.isAddress(tokenRegistryAddress)) {
          throw new Error("Invalid token registry address found in document");
        }

        const tokenRegistry = new ethers.Contract(
          tokenRegistryAddress,
          TokenRegistryArtifact.abi,
          signer
        );

        // Use merkle root as token ID
        const merkleRoot = transaction.wrapped_document.signature.merkleRoot;
        console.log("Using merkle root as token ID:", merkleRoot);

        // Mint token and set issuer as owner
        const mintTx = await tokenRegistry.mint(merkleRoot);
        console.log("Token minted, transaction:", mintTx.hash);
        await mintTx.wait();

        // Create proof with transaction hash
        const proof = {
          type: "OpenAttestationMintable",
          method: "TOKEN_REGISTRY",
          value: mintTx.hash,
          salt: ethers.utils.hexlify(ethers.utils.randomBytes(32))
        };

        signedDocument = {
          ...transaction.wrapped_document,
          proof: [proof]
        };
        signedStatus = "document_issued";

      } else {
        console.log("Signing verifiable document using DID method");
        const result = await signAndStoreDocument(
          transaction.wrapped_document,
          walletAddress,
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