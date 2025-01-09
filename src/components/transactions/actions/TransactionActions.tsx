import { MoreVertical, Trash2, Download, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Transaction } from "@/types/transactions";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface TransactionActionsProps {
  transaction: Transaction;
  onDelete: () => void;
  documents: Array<{
    id: string;
    title: string;
    status: string;
  }>;
}

export const TransactionActions = ({ 
  transaction, 
  onDelete,
  documents
}: TransactionActionsProps) => {
  const { toast } = useToast();

  const handleDownload = async (documentId: string) => {
    try {
      console.log("TransactionActions - Starting document download for ID:", documentId);
      
      const { data: doc, error: docError } = await supabase
        .from("documents")
        .select("*")
        .eq("id", documentId)
        .maybeSingle();

      if (docError) {
        console.error("TransactionActions - Error fetching document:", docError);
        throw docError;
      }

      if (!doc) {
        console.log("TransactionActions - No document found with ID:", documentId);
        toast({
          title: "Document Not Found",
          description: "The requested document could not be found.",
          variant: "destructive",
        });
        return;
      }

      console.log("TransactionActions - Document found:", doc);
      
      // Get the latest version of the document
      const documentData = doc.signed_document || doc.wrapped_document || doc.raw_document;
      
      if (!documentData) {
        console.log("TransactionActions - No document data found");
        toast({
          title: "Error",
          description: "No document data available for download",
          variant: "destructive",
        });
        return;
      }
      
      // Create a blob from the document data
      const blob = new Blob([JSON.stringify(documentData, null, 2)], { 
        type: 'application/json' 
      });
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `${doc.title || 'document'}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log("TransactionActions - Document downloaded successfully");
      toast({
        title: "Success",
        description: "Document downloaded successfully",
      });
    } catch (error: any) {
      console.error("TransactionActions - Error downloading document:", error);
      toast({
        title: "Error",
        description: "Failed to download document",
        variant: "destructive",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Plus className="mr-2 h-4 w-4" />
          Attach Document
        </DropdownMenuItem>
        
        {documents.map((doc) => (
          <DropdownMenuItem 
            key={doc.id}
            onClick={() => handleDownload(doc.id)}
          >
            <Download className="mr-2 h-4 w-4" />
            Download {doc.title || `Document ${doc.id}`}
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuItem 
          onClick={onDelete}
          className="text-red-600 focus:text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Transaction
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};