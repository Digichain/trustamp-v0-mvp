import { TableCell, TableRow } from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { TransactionStatus } from "./TransactionStatus";
import { TransactionActions } from "./actions/TransactionActions";
import { Transaction } from "@/types/transactions";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface TransactionRowProps {
  transaction: Transaction;
  onDelete: (transaction: Transaction) => void;
}

export const TransactionRow = ({ 
  transaction, 
  onDelete 
}: TransactionRowProps) => {
  const { data: documents } = useQuery({
    queryKey: ["transaction-documents", transaction.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transaction_documents")
        .select(`
          document_id,
          documents:document_id (
            id,
            title,
            status
          )
        `)
        .eq("transaction_id", transaction.id);

      if (error) throw error;
      return data;
    }
  });

  return (
    <TableRow>
      <TableCell className="font-mono">
        {transaction.transaction_hash ? 
          `${transaction.transaction_hash.slice(0, 10)}...${transaction.transaction_hash.slice(-8)}` :
          '-'
        }
      </TableCell>
      <TableCell className="capitalize">{transaction.transaction_type}</TableCell>
      <TableCell>
        <TransactionStatus status={transaction.status} />
      </TableCell>
      <TableCell>
        {formatDistanceToNow(new Date(transaction.created_at), {
          addSuffix: true,
        })}
      </TableCell>
      <TableCell>
        {transaction.payment_bound && (
          <Badge variant="secondary">Payment Bound</Badge>
        )}
      </TableCell>
      <TableCell>
        {documents?.map((doc: any) => (
          <Badge key={doc.document_id} variant="outline" className="mr-2">
            {doc.documents.title || `Document ${doc.document_id}`}
          </Badge>
        ))}
      </TableCell>
      <TableCell className="text-right">
        <TransactionActions
          transaction={transaction}
          onDelete={() => onDelete(transaction)}
          documents={documents?.map((d: any) => d.documents) || []}
        />
      </TableCell>
    </TableRow>
  );
};