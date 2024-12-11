import {
  MoreVertical,
  Package,
  Trash2,
  Eye,
  FileSignature,
  Download,
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
import { signAndStoreDocument } from "@/utils/document-signer";
import { useTransactions } from "@/hooks/useTransactions";
import { useWallet } from "@/contexts/WalletContext";

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
  const { invalidateTransactions } = useTransactions();
  const { walletAddress } = useWallet();

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

      // Create file name for wrapped document based on transaction ID
      const fileName = `${transaction.id}_wrapped.json`;
      console.log("Creating wrapped document with filename:", fileName);

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

      // Update transaction status to document_wrapped
      console.log("Updating transaction status to document_wrapped");
      const { error: updateError } = await supabase
        .from('transactions')
        .update({ 
          status: 'document_wrapped',
          updated_at: new Date().toISOString()
        })
        .eq('id', transaction.id);

      if (updateError) {
        console.error("Error updating transaction status:", updateError);
        throw updateError;
      }

      // Get public URL for the wrapped document
      const { data: { publicUrl } } = supabase.storage
        .from('wrapped-documents')
        .getPublicUrl(fileName);

      console.log("Document wrapped and stored successfully at:", publicUrl);
      console.log("Document merkle root:", merkleRoot);

      // Invalidate transactions cache to refresh the UI
      console.log("Invalidating transactions cache");
      await invalidateTransactions();
      console.log("Cache invalidated, UI should update");

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

  const handleSignDocument = async () => {
    try {
      if (!walletAddress) {
        throw new Error("Please connect your wallet first");
      }

      console.log("Starting document signing process for transaction:", transaction.id);

      // Fetch wrapped document from storage
      const wrappedFileName = `${transaction.id}_wrapped.json`;
      const { data: wrappedDocData, error: fetchError } = await supabase.storage
        .from('wrapped-documents')
        .download(wrappedFileName);

      if (fetchError) {
        console.error("Error fetching wrapped document:", fetchError);
        throw new Error("Failed to fetch wrapped document");
      }

      const wrappedDoc = JSON.parse(await wrappedDocData.text());
      wrappedDoc.transactionId = transaction.id;

      // Sign and store the document
      const { signedDocument, publicUrl } = await signAndStoreDocument(wrappedDoc, walletAddress);

      // Update transaction status
      console.log("Updating transaction status to document_issued");
      const { error: updateError } = await supabase
        .from('transactions')
        .update({ 
          status: 'document_issued',
          updated_at: new Date().toISOString()
        })
        .eq('id', transaction.id);

      if (updateError) {
        console.error("Error updating transaction status:", updateError);
        throw updateError;
      }

      // Invalidate transactions cache to refresh the UI
      await invalidateTransactions();

      toast({
        title: "Success",
        description: "Document signed successfully",
      });
    } catch (error: any) {
      console.error("Error signing document:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to sign document",
        variant: "destructive",
      });
    }
  };

  const handleDownloadSignedDocument = async () => {
    try {
      const signedFileName = `${transaction.id}_signed.json`;
      const { data, error } = await supabase.storage
        .from('signed-documents')
        .download(signedFileName);

      if (error) {
        throw error;
      }

      // Create a download link
      const blob = new Blob([await data.text()], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = signedFileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success",
        description: "Document downloaded successfully",
      });
    } catch (error: any) {
      console.error("Error downloading signed document:", error);
      toast({
        title: "Error",
        description: "Failed to download signed document",
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
        {transaction.status === 'document_issued' && (
          <DropdownMenuItem onClick={handleDownloadSignedDocument}>
            <Download className="mr-2 h-4 w-4" />
            Download Signed Document
          </DropdownMenuItem>
        )}
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