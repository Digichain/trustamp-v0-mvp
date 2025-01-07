import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Document {
  id: string;
  title: string;
  status: string;
}

interface DocumentSelectorProps {
  selectedDocument: string;
  onDocumentSelect: (documentId: string) => void;
}

export const DocumentSelector = ({ selectedDocument, onDocumentSelect }: DocumentSelectorProps) => {
  const { data: documents } = useQuery({
    queryKey: ["signed-documents"],
    queryFn: async () => {
      console.log("Fetching signed/issued documents");
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");

      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("user_id", user.id)
        .in("status", ["document_signed", "document_issued"]);
      
      if (error) {
        console.error("Error fetching documents:", error);
        throw error;
      }
      console.log("Fetched documents:", data);
      return data as Document[];
    },
  });

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Attach Document</label>
      <Select
        value={selectedDocument}
        onValueChange={onDocumentSelect}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a document" />
        </SelectTrigger>
        <SelectContent>
          {documents?.map((doc) => (
            <SelectItem key={doc.id} value={doc.id}>
              {doc.title || `Document ${doc.id}`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};