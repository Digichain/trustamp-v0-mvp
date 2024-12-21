import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useDownloadHandler = () => {
  const { toast } = useToast();

  const handleDownloadDocument = async (transaction: any) => {
    try {
      let bucketName = 'raw-documents';
      let fileName = `${transaction.id}_raw.json`;

      // Determine which version to download based on status
      switch (transaction.status) {
        case 'document_wrapped':
          bucketName = 'wrapped-documents';
          fileName = `${transaction.id}_wrapped.json`;
          break;
        case 'document_signed':
        case 'document_issued':
          bucketName = 'signed-documents';
          fileName = `${transaction.id}_signed.json`;
          break;
      }

      console.log(`Downloading ${fileName} from ${bucketName}`);

      const { data, error } = await supabase.storage
        .from(bucketName)
        .download(fileName);

      if (error) {
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