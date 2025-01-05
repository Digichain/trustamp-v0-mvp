import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useDocumentData = () => {
  const { toast } = useToast();

  const fetchDocumentData = async (document: any) => {
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

  const handleDelete = async (document: any) => {
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

      // Verify user owns the document before proceeding
      const { data: documentData, error: verifyError } = await supabase
        .from("documents")
        .select("*")
        .eq("id", document.id)
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (verifyError || !documentData) {
        console.error("Error verifying document ownership:", verifyError);
        toast({
          title: "Error",
          description: "You don't have permission to delete this document",
          variant: "destructive",
        });
        return false;
      }

      // First delete from the appropriate document table
      const documentTable = document.document_subtype === "verifiable" 
        ? "invoice_documents" 
        : "bill_of_lading_documents";
      
      console.log(`Deleting from ${documentTable}...`);
      const { error: documentError } = await supabase
        .from(documentTable)
        .delete()
        .eq("document_id", document.id);

      if (documentError) {
        console.error(`Error deleting from ${documentTable}:`, documentError);
        throw documentError;
      }

      // Then delete from storage if it exists
      const fileName = `${document.id}.json`;
      console.log("Deleting storage file:", fileName);
      
      const { data: fileExists } = await supabase.storage
        .from('raw-documents')
        .list('', {
          search: fileName
        });

      if (fileExists && fileExists.length > 0) {
        const { error: storageError } = await supabase.storage
          .from('raw-documents')
          .remove([fileName]);

        if (storageError) {
          console.error("Error deleting from storage:", storageError);
          throw storageError;
        }
      } else {
        console.log("File not found in storage:", fileName);
      }

      // Finally delete from documents table
      console.log("Deleting from documents table...");
      const { error: documentError } = await supabase
        .from("documents")
        .delete()
        .eq("id", document.id)
        .eq("user_id", session.user.id);

      if (documentError) {
        console.error("Error deleting from documents:", documentError);
        throw documentError;
      }

      console.log("Deletion process completed successfully");
      toast({
        title: "Success",
        description: "Document deleted successfully",
      });

      return true;
    } catch (error) {
      console.error("Error in deletion process:", error);
      toast({
        title: "Error",
        description: "Failed to delete document",
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