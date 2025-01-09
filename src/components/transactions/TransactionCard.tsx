import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction } from "@/types/transactions";
import { TransactionStatus } from "./TransactionStatus";
import { TransactionActions } from "./actions/TransactionActions";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TransactionCardProps {
  transaction: Transaction;
  onDelete: (transaction: Transaction) => void;
}

export const TransactionCard = ({ transaction, onDelete }: TransactionCardProps) => {
  const [documents, setDocuments] = useState<Array<{ id: string; title: string; status: string }>>([]);
  const { toast } = useToast();

  // Fetch documents associated with this transaction
  const fetchDocuments = async () => {
    console.log("TransactionCard - Fetching documents for transaction:", transaction.id);
    try {
      const { data, error } = await supabase
        .from('transaction_documents')
        .select(`
          document_id,
          documents:document_id (
            id,
            title,
            status
          )
        `)
        .eq('transaction_id', transaction.id);

      if (error) throw error;

      const formattedDocs = data.map(item => ({
        id: item.documents.id,
        title: item.documents.title || `Document ${item.documents.id}`,
        status: item.documents.status
      }));

      console.log("TransactionCard - Documents fetched:", formattedDocs);
      setDocuments(formattedDocs);
    } catch (error) {
      console.error("TransactionCard - Error fetching documents:", error);
      toast({
        title: "Error",
        description: "Failed to load documents",
        variant: "destructive",
      });
    }
  };

  // Fetch documents when component mounts
  useEffect(() => {
    fetchDocuments();
  }, [transaction.id]);

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-medium">
              {transaction.title || `Transaction ${transaction.transaction_hash}`}
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              {new Date(transaction.created_at).toLocaleDateString()}
            </p>
          </div>
          <TransactionStatus status={transaction.status} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Documents</h4>
            <div className="space-y-2">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">{doc.title}</span>
                  <TransactionActions
                    transaction={transaction}
                    onDelete={() => onDelete(transaction)}
                    documents={[doc]}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-gray-500">
          {transaction.payment_bound ? "Payment Required" : "No Payment Required"}
        </div>
        <TransactionActions
          transaction={transaction}
          onDelete={() => onDelete(transaction)}
          documents={documents}
        />
      </CardFooter>
    </Card>
  );
};