import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Document } from "@/types/documents";

export const useDocumentData = () => {
  const { toast } = useToast();

  const fetchDocumentData = async (document: Document) => {
    console.log("Starting document data fetch for:", document);
    
    try {
      // First fetch the document to ensure it exists and get the raw_document
      const { data: docData, error: docError } = await supabase
        .from("documents")
        .select("*")
        .eq("id", document.id)
        .maybeSingle();

      if (docError) {
        console.error("Error fetching document:", docError);
        throw docError;
      }

      if (!docData) {
        console.log("No document found with id:", document.id);
        return null;
      }

      console.log("Found document data:", docData);

      if (document.document_subtype === "verifiable") {
        console.log("Fetching verifiable document data");
        const { data: invoiceData, error: invoiceError } = await supabase
          .from("invoice_documents")
          .select("*")
          .eq("document_id", document.id)
          .maybeSingle();

        if (invoiceError) {
          console.error("Error fetching invoice document:", invoiceError);
          throw invoiceError;
        }

        if (!invoiceData) {
          console.log("No invoice data found for document:", document.id);
          return docData.raw_document;
        }

        console.log("Retrieved invoice document data:", invoiceData);
        return invoiceData;

      } else if (document.document_subtype === "transferable") {
        console.log("Fetching transferable document data");
        const { data: bolData, error: bolError } = await supabase
          .from("bill_of_lading_documents")
          .select("*")
          .eq("document_id", document.id)
          .maybeSingle();

        if (bolError) {
          console.error("Error fetching bill of lading document:", bolError);
          throw bolError;
        }

        if (!bolData) {
          console.log("No bill of lading data found for document:", document.id);
          return docData.raw_document;
        }

        console.log("Retrieved bill of lading document data:", bolData);
        return bolData;
      }

      // If no specific document type data is found, return the raw document
      console.log("Returning raw document data");
      return docData.raw_document;
    } catch (error) {
      console.error("Error in fetchDocumentData:", error);
      throw error;
    }
  };

  const handleDelete = async (document: Document) => {
    try {
      console.log("Starting deletion process for document:", document.id);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.error("No authenticated session found");
        toast({
          title: "Authentication Error",
          description: "You must be logged in to delete documents",
          variant: "destructive",
        });
        return false;
      }

      // First delete any associated bill of lading documents
      if (document.document_subtype === "transferable") {
        console.log("Deleting associated bill of lading document...");
        const { error: bolError } = await supabase
          .from("bill_of_lading_documents")
          .delete()
          .eq("document_id", document.id);

        if (bolError) {
          console.error("Error deleting bill of lading document:", bolError);
          toast({
            title: "Error",
            description: "Failed to delete associated bill of lading document",
            variant: "destructive",
          });
          return false;
        }
        
        // Wait a moment to ensure the deletion is processed
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Then delete any associated invoice documents
      if (document.document_subtype === "verifiable") {
        console.log("Deleting associated invoice document...");
        const { error: invoiceError } = await supabase
          .from("invoice_documents")
          .delete()
          .eq("document_id", document.id);

        if (invoiceError) {
          console.error("Error deleting invoice document:", invoiceError);
          toast({
            title: "Error",
            description: "Failed to delete associated invoice document",
            variant: "destructive",
          });
          return false;
        }
        
        // Wait a moment to ensure the deletion is processed
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Finally delete the main document
      console.log("Deleting main document...");
      const { error: mainDocError } = await supabase
        .from("documents")
        .delete()
        .eq("id", document.id)
        .eq("user_id", session.user.id);

      if (mainDocError) {
        console.error("Error deleting main document:", mainDocError);
        toast({
          title: "Error",
          description: "Failed to delete main document",
          variant: "destructive",
        });
        return false;
      }

      console.log("Deletion process completed successfully");
      toast({
        title: "Success",
        description: "Document deleted successfully",
      });

      return true;
    } catch (error: any) {
      console.error("Error in deletion process:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete document",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    fetchDocumentData,
    handleDelete,
  };
};