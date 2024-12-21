import { useToast } from "@/components/ui/use-toast";
import { useTransactions } from "@/hooks/useTransactions";
import { wrapDocument } from "@/utils/document-wrapper";
import { useDocumentStorage } from "./useDocumentStorage";
import { supabase } from "@/integrations/supabase/client";

export const useWrappingHandler = () => {
  const { toast } = useToast();
  const { invalidateTransactions } = useTransactions();
  const { storeRawDocument, storeWrappedDocument } = useDocumentStorage();

  const handleWrapDocument = async (transaction: any) => {
    try {
      console.log("Starting document wrapping process for transaction:", transaction.id);
      
      if (!transaction.raw_document) {
        throw new Error("No raw document found");
      }

      // Use the shared document wrapper utility
      const wrappedDoc = wrapDocument(transaction.raw_document);
      console.log("WRAPPED DOCUMENT STRUCTURE:", JSON.stringify(wrappedDoc, null, 2));

      // Store the wrapped document
      await storeWrappedDocument(transaction.id, wrappedDoc);
      console.log("Wrapped document stored successfully");

      // Update transaction status in database
      console.log("Updating transaction status to document_wrapped");
      const { data: updateData, error: updateError } = await supabase
        .from('transactions')
        .update({ 
          status: 'document_wrapped',
          updated_at: new Date().toISOString()
        })
        .eq('id', transaction.id)
        .select();

      if (updateError) {
        console.error("Error updating transaction status:", updateError);
        throw updateError;
      }

      console.log("Transaction status updated successfully:", updateData);

      // Force cache invalidation
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
