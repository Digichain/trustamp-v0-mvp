import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Transaction {
  id: string;
  document_subtype?: string;
  status: string;
}

export const useSigningHandler = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSignDocument = async (transaction: Transaction) => {
    console.log("Starting document signing process for:", transaction.id);
    const isTransferable = transaction.document_subtype === 'transferable';
    
    try {
      const { data, error } = await supabase
        .from("transactions")
        .update({ status: isTransferable ? "document_issued" : "document_signed" })
        .eq("id", transaction.id)
        .select()
        .single();

      if (error) {
        console.error("Error signing document:", error);
        toast({
          title: "Error",
          description: "Failed to sign document",
          variant: "destructive",
        });
        return false;
      }

      console.log("Document signed successfully:", data);
      await queryClient.invalidateQueries({ queryKey: ["transactions"] });
      
      toast({
        title: "Success",
        description: isTransferable ? "Document issued successfully" : "Document signed successfully",
      });
      
      return true;
    } catch (error) {
      console.error("Error in handleSignDocument:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    handleSignDocument,
  };
};