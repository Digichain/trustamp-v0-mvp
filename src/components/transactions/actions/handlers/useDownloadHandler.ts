import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useDownloadHandler = () => {
  const { toast } = useToast();

  const handleDownloadDocument = async (transaction: any) => {
    try {
      console.log("Starting download process for transaction:", transaction);
      
      // Determine which version to download based on status
      let bucketName = 'raw-documents';
      let fileName = `${transaction.id}_raw.json`;
      let documentData = transaction.raw_document;

      switch (transaction.status) {
        case 'document_wrapped':
          bucketName = 'wrapped-documents';
          fileName = `${transaction.id}_wrapped.json`;
          documentData = transaction.wrapped_document;
          break;
        case 'document_signed':
        case 'document_issued':
          bucketName = 'signed-documents';
          fileName = `${transaction.id}_signed.json`;
          documentData = transaction.signed_document;
          break;
      }

      console.log(`Downloading document from ${bucketName}, filename: ${fileName}`);

      // If we have the document data in the transaction record, use that directly
      if (documentData) {
        console.log("Using document data from transaction record");
        const blob = new Blob([JSON.stringify(documentData, null, 2)], { 
          type: 'application/json' 
        });
        const url = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast({
          title: "Success",
          description: "Document downloaded successfully",
        });
        return;
      }

      // Fallback to storage if transaction record doesn't have the document
      console.log("Falling back to storage bucket for document download");
      const { data, error } = await supabase.storage
        .from(bucketName)
        .download(fileName);

      if (error) {
        console.error("Error downloading from storage:", error);
        throw error;
      }

      // Create a blob from the file data
      const blob = new Blob([await data.text()], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Document downloaded successfully",
      });
    } catch (error: any) {
      console.error("Error downloading document:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to download document",
        variant: "destructive",
      });
    }
  };

  return {
    handleDownloadDocument
  };
};