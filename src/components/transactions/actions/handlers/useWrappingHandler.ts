import { useToast } from "@/components/ui/use-toast";
import { useDocuments } from "@/hooks/useDocuments";
import { wrapDocument } from "@govtechsg/open-attestation";
import { useDocumentStorage } from "./useDocumentStorage";
import { supabase } from "@/integrations/supabase/client";

export const useWrappingHandler = () => {
  const { toast } = useToast();
  const { invalidateDocuments } = useDocuments();
  const { storeWrappedDocument } = useDocumentStorage();

  const handleWrapDocument = async (document: any) => {
    try {
      console.log("Starting document wrapping process for document:", document.id);
      
      if (!document.raw_document) {
        throw new Error("No raw document found");
      }

      // Use OpenAttestation's wrap function directly
      console.log("RAW DOCUMENT BEFORE WRAPPING:", JSON.stringify(document.raw_document, null, 2));
      const wrappedDoc = wrapDocument(document.raw_document);
      console.log("WRAPPED DOCUMENT STRUCTURE:", JSON.stringify(wrappedDoc, null, 2));

      // Store the wrapped document
      await storeWrappedDocument(document.id, wrappedDoc);
      console.log("Wrapped document stored successfully");

      // Convert wrapped document to JSON for database storage
      const wrappedDocJson = JSON.parse(JSON.stringify(wrappedDoc));

      // Update document status in database
      console.log("Updating document status to document_wrapped");
      const { error: updateError } = await supabase
        .from('documents')  // Changed from 'transactions' to 'documents'
        .update({ 
          status: 'document_wrapped',
          wrapped_document: wrappedDocJson,
          updated_at: new Date().toISOString()
        })
        .eq('id', document.id);

      if (updateError) {
        console.error("Error updating document status:", updateError);
        throw updateError;
      }

      console.log("Document status updated successfully");

      // Force cache invalidation to update UI
      console.log("Invalidating documents cache");
      await invalidateDocuments();
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