import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useDocumentData = () => {
  const { toast } = useToast();

  const fetchDocumentData = async (transaction: any) => {
    console.log("Fetching document data for transaction:", transaction);
    
    if (transaction.document_subtype === "verifiable") {
      const { data, error } = await supabase
        .from("invoice_documents")
        .select("*")
        .eq("transaction_id", transaction.id);

      if (error) {
        console.error("Error fetching invoice document:", error);
        return null;
      }

      return data && data.length > 0 ? data[0] : null;

    } else if (transaction.document_subtype === "transferable") {
      const { data, error } = await supabase
        .from("bill_of_lading_documents")
        .select("*")
        .eq("transaction_id", transaction.id);

      if (error) {
        console.error("Error fetching bill of lading document:", error);
        return null;
      }

      return data && data.length > 0 ? data[0] : null;
    }

    return null;
  };

  const handleDelete = async (transaction: any) => {
    try {
      console.log("Deleting document:", transaction);
      
      // Delete from the appropriate document table
      const documentTable = transaction.document_subtype === "verifiable" 
        ? "invoice_documents" 
        : "bill_of_lading_documents";
      
      const { error: documentError } = await supabase
        .from(documentTable)
        .delete()
        .eq("transaction_id", transaction.id);

      if (documentError) throw documentError;

      // Delete from transactions table
      const { error: transactionError } = await supabase
        .from("transactions")
        .delete()
        .eq("id", transaction.id);

      if (transactionError) throw transactionError;

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('raw-documents')
        .remove([`${transaction.id}.json`]);

      if (storageError) {
        console.error("Error deleting from storage:", storageError);
        // Don't throw here as the file might not exist
      }

      toast({
        title: "Success",
        description: "Document deleted successfully",
      });

      return true;
    } catch (error) {
      console.error("Error deleting document:", error);
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