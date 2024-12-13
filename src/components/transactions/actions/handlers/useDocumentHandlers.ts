import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useTransactions } from "@/hooks/useTransactions";
import { wrapDocument } from "@/utils/document-wrapper";
import { signAndStoreDocument } from "@/utils/document-signer";
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

      const wrappedDoc = wrapDocument(transaction.raw_document);
      console.log("Document wrapped successfully:", wrappedDoc);

      const merkleRoot = wrappedDoc.signature.merkleRoot;
      console.log("Generated merkle root:", merkleRoot);

      // Use transaction ID for file naming
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

      console.log("Starting document signing process for transaction:", transaction.id);
      console.log("Transaction data:", transaction);

      // Use transaction ID for file operations
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
      console.log("Successfully retrieved wrapped document:", wrappedDoc);

      const { signedDocument, publicUrl } = await signAndStoreDocument(
        wrappedDoc,
        walletAddress,
        transaction.id // Use transaction ID for signed document
      );

      console.log("Updating transaction status to document_issued");
      const { error: updateError } = await supabase
        .from('transactions')
        .update({ 
          status: 'document_issued',
          updated_at: new Date().toISOString()
        })
        .eq('id', transaction.id);

      if (updateError) {
        console.error("Error updating transaction status:", updateError);
        throw updateError;
      }

      await invalidateTransactions();

      toast({
        title: "Success",
        description: "Document signed successfully",
      });
    } catch (error: any) {
      console.error("Error signing document:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to sign document",
        variant: "destructive",
      });
    }
  };

  const handleDownloadSignedDocument = async (transaction: any) => {
    try {
      // Use transaction ID for file operations
      const signedFileName = `${transaction.id}_signed.json`;
      const { data, error } = await supabase.storage
        .from('signed-documents')
        .download(signedFileName);

      if (error) {
        throw error;
      }

      const blob = new Blob([await data.text()], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = signedFileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success",
        description: "Document downloaded successfully",
      });
    } catch (error: any) {
      console.error("Error downloading signed document:", error);
      toast({
        title: "Error",
        description: "Failed to download signed document",
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