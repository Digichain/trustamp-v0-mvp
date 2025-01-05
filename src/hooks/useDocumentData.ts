import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Document } from "@/types/documents";

export const useDocumentData = () => {
  const { toast } = useToast();

  const fetchDocumentData = async (document: Document) => {
    console.log("Fetching document data for document:", document);
    
    if (document.document_subtype === "verifiable") {
      const { data, error } = await supabase
        .from("invoice_documents")
        .select("*")
        .eq("document_id", document.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching invoice document:", error);
        return null;
      }

      return data;

    } else if (document.document_subtype === "transferable") {
      const { data, error } = await supabase
        .from("bill_of_lading_documents")
        .select("*")
        .eq("document_id", document.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching bill of lading document:", error);
        return null;
      }

      return data;
    }

    return null;
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