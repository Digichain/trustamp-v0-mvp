import { useToast } from "@/components/ui/use-toast";
import { useTransactions } from "@/hooks/useTransactions";
import { ethers } from 'ethers';
import TokenRegistryArtifact from "@/contracts/TokenRegistry";
import { useWallet } from "@/contexts/WalletContext";
import { useDocumentStorage } from "./useDocumentStorage";
import { supabase } from "@/integrations/supabase/client";

export const useSigningHandler = () => {
  const { toast } = useToast();
  const { invalidateTransactions } = useTransactions();
  const { walletAddress } = useWallet();
  const { storeSignedDocument } = useDocumentStorage();

  const handleSignDocument = async (transaction: any) => {
    try {
      if (!walletAddress) {
        throw new Error("Please connect your wallet first");
      }

      const isTransferable = transaction.document_subtype === 'transferable';
      console.log("Starting document signing/issuing process for transaction:", transaction.id);
      console.log("Document is transferable:", isTransferable);
      
      // Try to fetch wrapped document
      const wrappedFileName = `${transaction.id}_wrapped.json`;
      console.log("Attempting to fetch wrapped document:", wrappedFileName);
      
      let wrappedDoc;
      try {
        const { data: wrappedDocData, error: fetchError } = await supabase.storage
          .from('wrapped-documents')
          .download(wrappedFileName);

        if (fetchError || !wrappedDocData) {
          console.log("Wrapped document not found or error:", fetchError);
          throw new Error("Failed to get wrapped document");
        }

        const text = await wrappedDocData.text();
        console.log("Retrieved wrapped document text:", text);
        wrappedDoc = JSON.parse(text);
      } catch (error) {
        console.error("Error fetching wrapped document:", error);
        throw new Error("Failed to get wrapped document");
      }

      if (!wrappedDoc) {
        throw new Error("Failed to get wrapped document");
      }

      let finalDocument;
      let transactionHash;

      if (isTransferable && wrappedDoc.data?.issuers?.[0]?.tokenRegistry) {
        const { ethereum } = window as any;
        if (!ethereum) throw new Error("MetaMask not found");
        
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        
        // Log the entire issuers array and token registry value
        console.log("Issuers data:", wrappedDoc.data.issuers);
        const rawRegistryAddress = wrappedDoc.data.issuers[0].tokenRegistry;
        console.log("Raw registry address:", rawRegistryAddress);

        if (!rawRegistryAddress) {
          throw new Error("Token registry address is missing");
        }

        const registryAddress = rawRegistryAddress.split(":").pop();
        console.log("Extracted registry address:", registryAddress);

        if (!registryAddress || !ethers.utils.isAddress(registryAddress)) {
          throw new Error(`Invalid token registry address: ${registryAddress}`);
        }

        // Create contract instance
        const tokenRegistry = new ethers.Contract(
          registryAddress,
          TokenRegistryArtifact.abi,
          signer
        );

        // Use the merkleRoot from the wrapped document as tokenId
        const merkleRoot = wrappedDoc.signature.merkleRoot;
        console.log("Using merkle root as token ID:", merkleRoot);

        // Call safeMint function with merkleRoot as tokenId
        console.log("Calling safeMint with params:", { to: walletAddress, tokenId: merkleRoot });
        const mintTx = await tokenRegistry.safeMint(walletAddress, merkleRoot);
        console.log("Mint transaction sent:", mintTx.hash);
        
        const receipt = await mintTx.wait();
        console.log("Mint transaction confirmed:", receipt);
        
        // Remove '0x' prefix from transaction hash for the proof
        transactionHash = receipt.transactionHash.replace('0x', '');
        
        // Keep the same wrapped document structure, just add the proof
        finalDocument = {
          ...wrappedDoc,
          signature: {
            ...wrappedDoc.signature,
            proof: [transactionHash]
          }
        };
      } else {
        // For non-transferable documents, sign the merkle root
        const merkleRoot = wrappedDoc.signature.merkleRoot;
        console.log("Merkle root to sign:", merkleRoot);
        
        // Ensure merkleRoot has 0x prefix for proper byte conversion
        const prefixedMerkleRoot = merkleRoot.startsWith('0x') ? merkleRoot : `0x${merkleRoot}`;
        console.log("Prefixed merkle root:", prefixedMerkleRoot);
        
        const messageBytes = ethers.utils.arrayify(prefixedMerkleRoot);
        console.log("Message bytes:", messageBytes);
        
        const provider = new ethers.providers.Web3Provider((window as any).ethereum);
        const signer = provider.getSigner();
        const signature = await signer.signMessage(messageBytes);
        
        finalDocument = {
          ...wrappedDoc,
          proof: [{
            type: "OpenAttestationSignature2018",
            created: new Date().toISOString(),
            proofPurpose: "assertionMethod",
            verificationMethod: walletAddress,
            signature: signature
          }]
        };
      }

      // Store the signed document
      await storeSignedDocument(transaction.id, finalDocument);

      // Update transaction status
      const newStatus = isTransferable ? 'document_issued' : 'document_signed';
      console.log(`Updating transaction status to ${newStatus}`);
      
      const { error: updateError } = await supabase
        .from('transactions')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString(),
          transaction_hash: transactionHash ? `0x${transactionHash}` : null
        })
        .eq('id', transaction.id)
        .select();

      if (updateError) {
        throw updateError;
      }

      await invalidateTransactions();

      toast({
        title: "Success",
        description: `Document ${isTransferable ? 'issued' : 'signed'} successfully`,
      });
    } catch (error: any) {
      console.error("Error signing/issuing document:", error);
      toast({
        title: "Error",
        description: error.message || `Failed to ${isTransferable ? 'issue' : 'sign'} document`,
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    handleSignDocument
  };
};
