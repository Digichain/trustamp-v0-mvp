import { useToast } from "@/components/ui/use-toast";
import { useTransactions } from "@/hooks/useTransactions";
import { wrapDocument } from "@govtechsg/open-attestation";
import { useDocumentStorage } from "./useDocumentStorage";
import { supabase } from "@/integrations/supabase/client";

export const useWrappingHandler = () => {
  const { toast } = useToast();
  const { invalidateTransactions } = useTransactions();
  const { storeWrappedDocument } = useDocumentStorage();

  const handleWrapDocument = async (transaction: any) => {
    try {
      console.log("Starting document wrapping process for transaction:", transaction.id);
      
      if (!transaction.raw_document) {
        throw new Error("No raw document found");
      }

      // Use OpenAttestation's wrap function directly
      console.log("RAW DOCUMENT BEFORE WRAPPING:", JSON.stringify(transaction.raw_document, null, 2));
      const wrappedDoc = wrapDocument(transaction.raw_document);
      console.log("WRAPPED DOCUMENT STRUCTURE:", JSON.stringify(wrappedDoc, null, 2));

      // Store the wrapped document
      await storeWrappedDocument(transaction.id, wrappedDoc);
      console.log("Wrapped document stored successfully");

      // Convert wrapped document to JSON for database storage
      const wrappedDocJson = JSON.parse(JSON.stringify(wrappedDoc));

      // Update transaction status in database
      console.log("Updating transaction status to document_wrapped");
      const { error: updateError } = await supabase
        .from('transactions')
        .update({ 
          status: 'document_wrapped',
          wrapped_document: wrappedDocJson,
          updated_at: new Date().toISOString()
        })
        .eq('id', transaction.id);

      if (updateError) {
        console.error("Error updating transaction status:", updateError);
        throw updateError;
      }

      console.log("Transaction status updated successfully");

      // Force cache invalidation to update UI
      console.log("Invalidating transactions cache");
      await invalidateTransactions();
      console.log("Cache invalidated, UI should update");

      toast({
        title: "Success",
        description: "Document wrapped successfully",
      });

      return wrappedDoc;
    } catch (error: any) {
      console.error("Error wrapping document:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to wrap document",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    handleWrapDocument
  };
};