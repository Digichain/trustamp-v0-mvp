import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Transaction } from "@/types/transactions";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DocumentData {
  id: string;
  document_data: any; // Generic JSON data
}

interface TransactionCardProps {
  transaction: Transaction;
  onDelete: (transaction: Transaction) => void;
}

export const TransactionCard = ({ transaction, onDelete }: TransactionCardProps) => {
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDocuments = async () => {
      console.log("TransactionCard - Fetching documents for transaction:", transaction.id);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.error("No authenticated session found");
        throw new Error("Authentication required");
      }

      const { data: transactionDocs, error: tdError } = await supabase
        .from("transaction_documents")
        .select(`
          document_id,
          document_data
        `)
        .eq("transaction_id", transaction.id);

      if (tdError) {
        console.error("Error fetching transaction documents:", tdError);
        toast({
          title: "Error",
          description: "Failed to fetch transaction documents",
          variant: "destructive",
        });
        return;
      }

      const formattedDocs = transactionDocs.map(td => ({
        id: td.document_id,
        document_data: td.document_data || {}
      }));

      console.log("TransactionCard - Formatted documents:", formattedDocs);
      setDocuments(formattedDocs);
    };

    fetchDocuments();
  }, [transaction.id, toast]);

  const handleDownload = async (document: DocumentData) => {
    console.log("TransactionCard - Handling document download:", document);
    try {
      if (!document.document_data) {
        console.error("No document data available for download");
        toast({
          title: "Error",
          description: "No document data available for download",
          variant: "destructive",
        });
        return;
      }

      const blob = new Blob([JSON.stringify(document.document_data, null, 2)], {
        type: "application/json",
      });
      const url = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `document_${document.id}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Document downloaded successfully",
      });
    } catch (error) {
      console.error("Error downloading document:", error);
      toast({
        title: "Error",
        description: "Failed to download document",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{transaction.title || "Untitled Transaction"}</h3>
          <p className="text-sm text-gray-500">
            Created {formatDistanceToNow(new Date(transaction.created_at), { addSuffix: true })}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Attached Documents:</h4>
        {documents.map((doc) => (
          <div key={doc.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
            <span className="text-sm">Document {doc.id}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDownload(doc)}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {documents.length === 0 && (
          <p className="text-sm text-gray-500">No documents attached</p>
        )}
      </div>
    </Card>
  );
};