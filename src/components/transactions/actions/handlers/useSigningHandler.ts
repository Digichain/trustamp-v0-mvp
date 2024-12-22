import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { signAndStoreDocument } from "@/utils/document-signer";
import { useWallet } from "@/contexts/WalletContext";
import { ethers } from 'ethers';
import { useTokenRegistry } from "./token/useTokenRegistry";
import { useAddressValidation } from "./token/useAddressValidation";
import { Contract } from "ethers";

interface Transaction {
  id: string;
  document_subtype?: string;
  status: string;
  wrapped_document: any;
}

// Define the interface for the token registry contract
interface TokenRegistryContract extends Contract {
  mint(to: string, tokenId: any): Promise<any>;
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
        console.log("Signing transferable document using token registry");
        const { ethereum } = window as any;
        if (!ethereum) {
          throw new Error("MetaMask not installed");
        }
        
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        console.log("Got signer from provider");
        
        // Extract and validate token registry address
        const rawTokenRegistryAddress = transaction.wrapped_document.data.issuers[0]?.tokenRegistry;
        if (!rawTokenRegistryAddress) {
          console.error("Missing token registry address in document");
          throw new Error("Invalid document structure: missing token registry address");
        }

        // Normalize the address
        const normalizedAddress = normalizeTokenRegistryAddress(rawTokenRegistryAddress);
        console.log("Normalized token registry address:", normalizedAddress);
        
        // Initialize contract with the correct type
        console.log("Initializing token registry contract...");
        const tokenRegistry = await initializeContract(normalizedAddress, signer) as TokenRegistryContract;
        console.log("Token registry contract initialized");

        // Get merkle root and format for token ID
        const merkleRoot = transaction.wrapped_document.signature.merkleRoot;
        const formattedMerkleRoot = merkleRoot.startsWith('0x') ? merkleRoot : `0x${merkleRoot}`;
        const tokenId = ethers.BigNumber.from(formattedMerkleRoot);
        console.log("Token ID created from merkle root:", tokenId.toString());

        // Check if token exists
        console.log("Checking if token already exists...");
        const exists = await checkTokenExists(tokenRegistry, tokenId);
        if (exists) {
          console.error("Token already exists for this document");
          throw new Error("Document has already been minted");
        }

        // Mint token
        console.log("Minting token...");
        await mintToken(tokenRegistry, walletAddress, tokenId);
        console.log("Token minted successfully");
        
        // Verify ownership
        console.log("Verifying token ownership...");
        await verifyTokenOwnership(tokenRegistry, tokenId, walletAddress);
        console.log("Token ownership verified");

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