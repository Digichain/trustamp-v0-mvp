import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Transaction } from "@/types/transactions";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface DocumentData {
  id: string;
  title: string;
  status: string;
  document_subtype: string;
  document_data: {
    invoiceDetails?: {
      total?: number;
    };
    total?: number;
    [key: string]: any;
  };
}

interface TransactionCardProps {
  transaction: Transaction;
  onDelete: (transaction: Transaction) => void;
}

export const TransactionCard = ({ transaction, onDelete }: TransactionCardProps) => {
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [amount, setAmount] = useState<number | null>(null);
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
        title: td.document_data?.title || `Document ${td.document_id}`,
        status: td.document_data?.status || 'unknown',
        document_subtype: td.document_data?.document_subtype || 'unknown',
        document_data: td.document_data || {}
      }));

      console.log("TransactionCard - Formatted documents:", formattedDocs);
      setDocuments(formattedDocs);

      // Find invoice document and extract amount
      const invoiceDoc = formattedDocs.find(doc => {
        const rawDoc = doc.document_data;
        return rawDoc && (
          (rawDoc.invoiceDetails?.total !== undefined) ||
          (rawDoc.total !== undefined)
        );
      });
      
      if (invoiceDoc?.document_data) {
        const rawDoc = invoiceDoc.document_data;
        const total = rawDoc.invoiceDetails?.total ?? rawDoc.total ?? 0;
        console.log("TransactionCard - Found invoice amount:", total);
        setAmount(total);
      }
    };

    fetchDocuments();
  }, [transaction.id, toast]);

  const handleDownload = async (document: DocumentData) => {
    console.log("TransactionCard - Handling document download:", document);
    try {
      const documentData = document.document_data;
      if (!documentData) {
        console.error("No document data available for download");
        toast({
          title: "Error",
          description: "No document data available for download",
          variant: "destructive",
        });
        return;
      }

      const blob = new Blob([JSON.stringify(documentData, null, 2)], {
        type: "application/json",
      });
      const url = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `${document.title || 'document'}.json`;
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
          {amount !== null && (
            <p className="text-sm font-medium mt-1">Amount: ${amount}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Attached Documents:</h4>
        {documents.map((doc) => (
          <div key={doc.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
            <span className="text-sm">{doc.title}</span>
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