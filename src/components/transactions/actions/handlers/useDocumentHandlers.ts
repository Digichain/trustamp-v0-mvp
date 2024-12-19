import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useTransactions } from "@/hooks/useTransactions";
import { wrapDocument } from "@/utils/document-wrapper";
import { ethers } from "ethers";
import TokenRegistryArtifact from "@/contracts/TokenRegistry";
import { useWallet } from "@/contexts/WalletContext";

export const useDocumentHandlers = () => {
  const { toast } = useToast();
  const { invalidateTransactions } = useTransactions();
  const { walletAddress } = useWallet();

  const handleWrapDocument = async (transaction: any) => {
    try {
      console.log("Starting document wrapping process for transaction:", transaction.id);
      
      if (!transaction.raw_document) {
        throw new Error("No raw document found");
      }

      console.log("RAW DOCUMENT BEFORE WRAPPING:", JSON.stringify(transaction.raw_document, null, 2));

      const wrappedDoc = wrapDocument(transaction.raw_document);
      console.log("WRAPPED DOCUMENT STRUCTURE:", JSON.stringify(wrappedDoc, null, 2));

      const fileName = `${transaction.id}_wrapped.json`;
      console.log("Creating wrapped document with filename:", fileName);

      const { error: uploadError } = await supabase.storage
        .from('wrapped-documents')
        .upload(fileName, JSON.stringify(wrappedDoc, null, 2), {
          contentType: 'application/json',
          upsert: true
        });

      if (uploadError) {
        console.error("Error uploading wrapped document:", uploadError);
        throw uploadError;
      }

      console.log("Updating transaction status to document_wrapped");
      const { error: updateError } = await supabase
        .from('transactions')
        .update({ 
          status: 'document_wrapped',
          updated_at: new Date().toISOString()
        })
        .eq('id', transaction.id);

      if (updateError) {
        console.error("Error updating transaction status:", updateError);
        throw updateError;
      }

      await invalidateTransactions();
      console.log("Cache invalidated, UI should update");

      toast({
        title: "Success",
        description: "Document wrapped successfully",
      });
    } catch (error: any) {
      console.error("Error wrapping document:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to wrap document",
        variant: "destructive",
      });
    }
  };

  const handleSignDocument = async (transaction: any) => {
    try {
      if (!walletAddress) {
        throw new Error("Please connect your wallet first");
      }

      const isTransferable = transaction.document_subtype === 'transferable';
      console.log("Starting document signing/issuing process for transaction:", transaction.id);
      console.log("Document is transferable:", isTransferable);
      
      const wrappedFileName = `${transaction.id}_wrapped.json`;
      console.log("Attempting to fetch wrapped document:", wrappedFileName);
      
      const { data: wrappedDocData, error: fetchError } = await supabase.storage
        .from('wrapped-documents')
        .download(wrappedFileName);

      if (fetchError) {
        console.error("Error fetching wrapped document:", fetchError);
        throw new Error("Failed to fetch wrapped document");
      }

      const wrappedDoc = JSON.parse(await wrappedDocData.text());
      console.log("WRAPPED DOCUMENT BEFORE SIGNING:", JSON.stringify(wrappedDoc, null, 2));

      let finalDocument;
      let transactionHash;

      if (isTransferable && wrappedDoc.data?.issuers?.[0]?.tokenRegistry) {
        // For transferable documents, mint token and add proof
        const { ethereum } = window as any;
        if (!ethereum) throw new Error("MetaMask not found");
        
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        
        // Get the token registry contract
        const registryAddress = wrappedDoc.data.issuers[0].tokenRegistry;
        console.log("Using token registry at address:", registryAddress);
        
        const tokenRegistry = new ethers.Contract(
          registryAddress,
          TokenRegistryArtifact.abi,
          signer
        );

        // Mint token with document hash as tokenId
        const documentHash = ethers.utils.keccak256(
          ethers.utils.toUtf8Bytes(JSON.stringify(wrappedDoc))
        );
        console.log("Document hash for minting:", documentHash);
        
        const mintTx = await tokenRegistry.safeMint(walletAddress, documentHash);
        console.log("Mint transaction sent:", mintTx.hash);
        
        const receipt = await mintTx.wait();
        console.log("Mint transaction confirmed:", receipt);
        
        transactionHash = receipt.transactionHash;
        
        // Add proof to document
        finalDocument = {
          ...wrappedDoc,
          proof: [{
            type: "TokenRegistryMint",
            created: new Date().toISOString(),
            proofPurpose: "assertionMethod",
            verificationMethod: `did:ethr:${walletAddress}#controller`,
            signature: transactionHash
          }]
        };
      } else if (!isTransferable) {
        // For verifiable documents, sign with wallet
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
            verificationMethod: `did:ethr:${walletAddress}#controller`,
            signature: signature
          }]
        };
      } else {
        throw new Error("Token registry address not found in document");
      }

      // Store final document
      const fileName = `${transaction.id}_${isTransferable ? 'issued' : 'signed'}.json`;
      const { error: uploadError } = await supabase.storage
        .from('signed-documents')
        .upload(fileName, JSON.stringify(finalDocument, null, 2), {
          contentType: 'application/json',
          upsert: true
        });

      if (uploadError) {
        throw uploadError;
      }

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
    }
  };

  const handleDownloadSignedDocument = async (transaction: any) => {
    try {
      const isTransferable = transaction.document_subtype === 'transferable';
      const fileName = `${transaction.id}_${isTransferable ? 'issued' : 'signed'}.json`;
      const { data, error } = await supabase.storage
        .from('signed-documents')
        .download(fileName);

      if (error) {
        throw error;
      }

      const blob = new Blob([await data.text()], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success",
        description: "Document downloaded successfully",
      });
    } catch (error: any) {
      console.error("Error downloading document:", error);
      toast({
        title: "Error",
        description: "Failed to download document",
        variant: "destructive",
      });
    }
  };

  return {
    handleWrapDocument,
    handleSignDocument,
    handleDownloadSignedDocument,
  };
};