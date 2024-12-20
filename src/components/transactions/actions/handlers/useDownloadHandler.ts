import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useDownloadHandler = () => {
  const { toast } = useToast();

  const handleDownloadSignedDocument = async (transaction: any) => {
    try {
      const signedFileName = `${transaction.id}_signed.json`;
      const { data, error } = await supabase.storage
        .from('signed-documents')
        .download(signedFileName);

      if (error) {
        throw error;
      }

      // Create a blob from the file data
      const blob = new Blob([await data.text()], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = signedFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Document downloaded successfully",
      });
    } catch (error: any) {
      console.error("Error downloading signed document:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to download signed document",
        variant: "destructive",
      });
    }
  };

  return {
    handleDownloadSignedDocument
  };
};