import {
  MoreVertical,
  Package,
  Trash2,
  Eye,
  FileSignature,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { wrapDocument } from "@/utils/document-wrapper";

interface TransactionActionsProps {
  transaction: any;
  onPreviewClick: () => void;
  onDelete: () => void;
}

export const TransactionActions = ({ 
  transaction, 
  onPreviewClick,
  onDelete,
}: TransactionActionsProps) => {
  const { toast } = useToast();

  const handleWrapDocument = async () => {
    try {
      console.log("Starting document wrapping process for transaction:", transaction.id);
      
      if (!transaction.raw_document) {
        throw new Error("No raw document found");
      }

      // Wrap the document
      const wrappedDoc = wrapDocument(transaction.raw_document);
      console.log("Document wrapped successfully:", wrappedDoc);

      // Extract merkle root for verification
      const merkleRoot = wrappedDoc.signature.merkleRoot;
      console.log("Generated merkle root:", merkleRoot);

      // Create file name for wrapped document
      const fileName = `wrapped_${transaction.id}.json`;

      // Upload wrapped document to storage
      const { error: uploadError } = await supabase.storage
        .from('wrapped-documents')
        .upload(fileName, JSON.stringify(wrappedDoc, null, 2), {
          contentType: 'application/json',
          upsert: true
        });

      if (uploadError) {
        console.error("Error uploading wrapped document:", uploadError);
        throw uploadError;
      }

      // Get public URL for the wrapped document
      const { data: { publicUrl } } = supabase.storage
        .from('wrapped-documents')
        .getPublicUrl(fileName);

      console.log("Document wrapped and stored successfully at:", publicUrl);
      console.log("Document merkle root:", merkleRoot);

      toast({
        title: "Success",
        description: "Document wrapped successfully",
      });
    } catch (error: any) {
      console.error("Error wrapping document:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to wrap document",
        variant: "destructive",
      });
    }
  };

  const handleSignDocument = () => {
    // Placeholder for sign document functionality
    console.log("Sign document clicked for transaction:", transaction.id);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onPreviewClick}>
          <Eye className="mr-2 h-4 w-4" />
          Preview Document
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleWrapDocument}>
          <Package className="mr-2 h-4 w-4" />
          Wrap Document
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignDocument}>
          <FileSignature className="mr-2 h-4 w-4" />
          Sign Document
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={onDelete}
          className="text-red-600 focus:text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Document
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};