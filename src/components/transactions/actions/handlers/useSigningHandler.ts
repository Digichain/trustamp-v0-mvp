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
        const { ethereum } = window as any;
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        
        // Extract token registry address with detailed validation
        console.log("Wrapped document data structure:", JSON.stringify(transaction.wrapped_document.data, null, 2));
        console.log("Issuers array:", JSON.stringify(transaction.wrapped_document.data.issuers, null, 2));
        
        const rawTokenRegistryAddress = transaction.wrapped_document.data.issuers[0]?.tokenRegistry;
        console.log("Raw token registry address from document:", rawTokenRegistryAddress);
        
        if (!rawTokenRegistryAddress) {
          console.error("No token registry address found in issuer");
          throw new Error("Invalid document structure: missing token registry address");
        }

        // Extract the actual address from the end of the string (after the last ':')
        const addressParts = rawTokenRegistryAddress.toString().split(':');
        const actualAddress = addressParts[addressParts.length - 1].trim();
        console.log("Extracted actual address:", actualAddress);

        // Ensure the address has the 0x prefix and is properly formatted
        const prefixedAddress = actualAddress.startsWith('0x') ? actualAddress : `0x${actualAddress}`;
        console.log("Prefixed token registry address:", prefixedAddress);

        // Validate the address format using ethers utility
        if (!ethers.utils.isAddress(prefixedAddress)) {
          console.error("Invalid token registry address format:", prefixedAddress);
          throw new Error(`Invalid token registry address format: ${prefixedAddress}`);
        }

        // Convert to checksum address for contract interaction
        const normalizedAddress = ethers.utils.getAddress(prefixedAddress);
        console.log("Final normalized token registry address:", normalizedAddress);

        // Initialize contract with proper error handling
        console.log("Initializing token registry contract...");
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

        // Check if token already exists
        console.log("Checking if token already exists...");
        try {
          const existingOwner = await tokenRegistry.ownerOf(tokenId);
          console.log("Token already exists, owned by:", existingOwner);
          throw new Error("Document has already been minted");
        } catch (error: any) {
          // ERC721 throws when token doesn't exist, which is what we want
          if (!error.message.includes("owner query for nonexistent token")) {
            throw error;
          }
          console.log("Token does not exist yet, proceeding with mint...");
        }

        // Mint token with higher gas limit to ensure transaction success
        console.log("Minting token...");
        const mintTx = await tokenRegistry.safeMint(walletAddress, tokenId, {
          gasLimit: 500000 // Increase gas limit to ensure transaction success
        });
        console.log("Mint transaction hash:", mintTx.hash);
        
        // Wait for confirmation with more blocks
        console.log("Waiting for transaction confirmation...");
        const receipt = await mintTx.wait(2); // Wait for 2 block confirmations
        console.log("Transaction confirmed, receipt:", receipt);

        // Verify token was minted with retries
        console.log("Verifying token ownership...");
        let retries = 3;
        let tokenOwner;
        while (retries > 0) {
          try {
            tokenOwner = await tokenRegistry.ownerOf(tokenId);
            console.log("Token owner after minting:", tokenOwner);
            if (tokenOwner.toLowerCase() === walletAddress.toLowerCase()) {
              break;
            }
            throw new Error("Owner mismatch");
          } catch (error) {
            if (retries === 1) throw error;
            retries--;
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds between retries
          }
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