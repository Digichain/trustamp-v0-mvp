import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Document } from "@/types/documents";

export const useDocumentData = () => {
  const { toast } = useToast();

  const fetchDocumentData = async (document: Document) => {
    console.log("Fetching document data for document:", document);
    
    try {
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
          return null;
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
          return null;
        }

        console.log("Retrieved bill of lading document data:", bolData);
        return bolData;
      }

      console.log("Unknown document subtype:", document.document_subtype);
      return null;
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

      // First delete from the related document table
      if (document.document_subtype === "verifiable") {
        console.log("Deleting from invoice_documents...");
        const { error: invoiceError } = await supabase
          .from("invoice_documents")
          .delete()
          .eq("document_id", document.id);

        if (invoiceError) {
          console.error("Error deleting from invoice_documents:", invoiceError);
          throw invoiceError;
        }
      } else if (document.document_subtype === "transferable") {
        console.log("Deleting from bill_of_lading_documents...");
        const { error: bolError } = await supabase
          .from("bill_of_lading_documents")
          .delete()
          .eq("document_id", document.id);

        if (bolError) {
          console.error("Error deleting from bill_of_lading_documents:", bolError);
          throw bolError;
        }
      }

      // Then delete from storage if it exists
      const fileName = `${document.id}.json`;
      console.log("Checking storage for file:", fileName);
      
      const { data: fileExists } = await supabase.storage
        .from('raw-documents')
        .list('', {
          search: fileName
        });

      if (fileExists && fileExists.length > 0) {
        console.log("Deleting file from storage:", fileName);
        const { error: storageError } = await supabase.storage
          .from('raw-documents')
          .remove([fileName]);

        if (storageError) {
          console.error("Error deleting from storage:", storageError);
          throw storageError;
        }
      } else {
        console.log("No file found in storage:", fileName);
      }

      // Finally delete from documents table
      console.log("Deleting from documents table...");
      const { error: mainDocError } = await supabase
        .from("documents")
        .delete()
        .eq("id", document.id)
        .eq("user_id", session.user.id);

      if (mainDocError) {
        console.error("Error deleting from documents:", mainDocError);
        throw mainDocError;
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