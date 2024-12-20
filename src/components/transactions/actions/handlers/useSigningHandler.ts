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

        if (fetchError) {
          console.log("Wrapped document not found, wrapping now...");
          wrappedDoc = await handleWrapDocument(transaction);
        } else {
          wrappedDoc = JSON.parse(await wrappedDocData.text());
        }
      } catch (error) {
        console.log("Error fetching wrapped document, wrapping now...");
        wrappedDoc = await handleWrapDocument(transaction);
      }

      console.log("WRAPPED DOCUMENT BEFORE SIGNING:", JSON.stringify(wrappedDoc, null, 2));

      // Ensure we have the token registry address for transferable documents
      if (isTransferable) {
        const tokenRegistryAddress = wrappedDoc.data?.issuers?.[0]?.tokenRegistry;
        if (!tokenRegistryAddress) {
          console.error("Token registry address not found in document:", wrappedDoc);
          throw new Error("Token registry address not found in document");
        }
        console.log("Found token registry address:", tokenRegistryAddress);
      }

      let finalDocument;
      let transactionHash;

      if (isTransferable && wrappedDoc.data?.issuers?.[0]?.tokenRegistry) {
        const { ethereum } = window as any;
        if (!ethereum) throw new Error("MetaMask not found");
        
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        
        const registryAddress = wrappedDoc.data.issuers[0].tokenRegistry;
        console.log("Using token registry at address:", registryAddress);
        
        const tokenRegistry = new ethers.Contract(
          registryAddress,
          TokenRegistryArtifact.abi,
          signer
        );

        const documentHash = ethers.utils.keccak256(
          ethers.utils.toUtf8Bytes(JSON.stringify(wrappedDoc))
        );
        console.log("Document hash for minting:", documentHash);
        
        const mintTx = await tokenRegistry.safeMint(walletAddress, documentHash);
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
            verificationMethod: walletAddress,
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
            verificationMethod: walletAddress,
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