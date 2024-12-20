import { useToast } from "@/components/ui/use-toast";
import { useTransactions } from "@/hooks/useTransactions";
import { ethers } from "ethers";
import TokenRegistryArtifact from "@/contracts/TokenRegistry";
import { useWallet } from "@/contexts/WalletContext";
import { useDocumentStorage } from "./useDocumentStorage";
import { supabase } from "@/integrations/supabase/client";
import { useWrappingHandler } from "./useWrappingHandler";

export const useSigningHandler = () => {
  const { toast } = useToast();
  const { invalidateTransactions } = useTransactions();
  const { walletAddress } = useWallet();
  const { storeSignedDocument } = useDocumentStorage();
  const { handleWrapDocument } = useWrappingHandler();

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
          console.log("Wrapped document not found or error, wrapping now...");
          wrappedDoc = await handleWrapDocument(transaction);
        } else {
          const text = await wrappedDocData.text();
          console.log("Retrieved wrapped document text:", text);
          wrappedDoc = JSON.parse(text);
        }
      } catch (error) {
        console.log("Error fetching wrapped document, wrapping now...", error);
        wrappedDoc = await handleWrapDocument(transaction);
      }

      if (!wrappedDoc) {
        throw new Error("Failed to get or create wrapped document");
      }

      console.log("WRAPPED DOCUMENT BEFORE SIGNING:", JSON.stringify(wrappedDoc, null, 2));

      let finalDocument;
      let transactionHash;

      if (isTransferable && wrappedDoc.data?.issuers?.[0]?.tokenRegistry) {
        const { ethereum } = window as any;
        if (!ethereum) throw new Error("MetaMask not found");
        
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        
        const registryAddress = wrappedDoc.data.issuers[0].tokenRegistry;
        console.log("Using token registry at address:", registryAddress);
        
        // Create contract instance
        const tokenRegistry = new ethers.Contract(
          registryAddress,
          TokenRegistryArtifact.abi,
          signer
        );

        // Calculate document hash and ensure 0x prefix
        const documentHash = ethers.utils.keccak256(
          ethers.utils.toUtf8Bytes(JSON.stringify(wrappedDoc))
        );
        const tokenId = documentHash.startsWith('0x') ? documentHash : `0x${documentHash}`;
        console.log("Document hash for minting:", tokenId);
        
        // Call safeMint function
        console.log("Calling safeMint with params:", { to: walletAddress, tokenId });
        const mintTx = await tokenRegistry.safeMint(walletAddress, tokenId);
        console.log("Mint transaction sent:", mintTx.hash);
        
        const receipt = await mintTx.wait();
        console.log("Mint transaction confirmed:", receipt);
        
        transactionHash = receipt.transactionHash;
        
        finalDocument = {
          ...wrappedDoc,
          proof: [{
            type: "TokenRegistryMint",
            created: new Date().toISOString(),
            proofPurpose: "assertionMethod",
            verificationMethod: walletAddress, // Removed ENS-related formatting
            signature: transactionHash
          }]
        };
      } else {
        const messageBytes = ethers.utils.arrayify(wrappedDoc.signature.merkleRoot);
        const provider = new ethers.providers.Web3Provider((window as any).ethereum);
        const signer = provider.getSigner();
        const signature = await signer.signMessage(messageBytes);
        
        finalDocument = {
          ...wrappedDoc,
          proof: [{
            type: "OpenAttestationSignature2018",
            created: new Date().toISOString(),
            proofPurpose: "assertionMethod",
            verificationMethod: walletAddress, // Removed ENS-related formatting
            signature: signature
          }]
        };
      }

      // Store the signed document
      await storeSignedDocument(transaction.id, finalDocument);

      // Update transaction status
      const { error: updateError } = await supabase
        .from('transactions')
        .update({ 
          status: 'document_issued',
          updated_at: new Date().toISOString(),
          transaction_hash: transactionHash || null
        })
        .eq('id', transaction.id);

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
        description: error.message || `Failed to ${transaction.document_subtype === 'transferable' ? 'issue' : 'sign'} document`,
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    handleSignDocument
  };
};