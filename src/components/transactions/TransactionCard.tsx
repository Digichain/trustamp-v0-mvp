import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction } from "@/types/transactions";
import { Document } from "@/types/documents";
import { TransactionStatus } from "./TransactionStatus";
import { TransactionActions } from "./actions/TransactionActions";
import { DocumentActions } from "./actions/DocumentActions";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TransactionCardProps {
  transaction: Transaction;
  onDelete: (transaction: Transaction) => void;
}

export const TransactionCard = ({ transaction, onDelete }: TransactionCardProps) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const { toast } = useToast();

  // Fetch documents associated with this transaction
  const fetchDocuments = async () => {
    console.log("TransactionCard - Fetching documents for transaction:", transaction.id);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.error("No authenticated session found");
        return;
      }

      const { data, error } = await supabase
        .from('transaction_documents')
        .select(`
          document_id,
          documents:document_id (
            id,
            user_id,
            transaction_hash,
            network,
            status,
            transaction_type,
            document_subtype,
            title,
            created_at,
            raw_document,
            wrapped_document,
            signed_document
          )
        `)
        .eq('transaction_id', transaction.id);

      if (error) throw error;

      const formattedDocs = data.map(item => item.documents) as Document[];

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
                  <span className="text-sm">{doc.title || `Document ${doc.id}`}</span>
                  <DocumentActions document={doc} />
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