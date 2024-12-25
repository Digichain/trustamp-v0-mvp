import { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { PreviewDialog } from "./previews/PreviewDialog";
import { InvoicePreview } from "./previews/InvoicePreview";
import { BillOfLadingPreview } from "./previews/BillOfLadingPreview";
import { TransactionActions } from "./actions/TransactionActions";
import { useTransactions } from "@/hooks/useTransactions";
import { useDocumentData } from "@/hooks/useDocumentData";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Define a more complete Transaction interface based on our database schema
interface Transaction {
  id: string;
  user_id: string;
  transaction_hash: string | null;
  network: string;
  status: string;
  transaction_type: string;
  document_subtype: string | null;
  title: string | null;
  created_at: string;
  raw_document: any | null;
  wrapped_document: any | null;
  signed_document: any | null;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "document_created":
      return "text-blue-600";
    case "document_wrapped":
      return "text-purple-600";
    case "document_signed":
      return "text-orange-600";
    case "document_issued":
      return "text-green-600";
    case "failed":
      return "text-red-600";
    default:
      return "text-gray-600";
  }
};

const getStatusDisplay = (status: string) => {
  switch (status.toLowerCase()) {
    case "document_created":
      return "Created";
    case "document_wrapped":
      return "Wrapped";
    case "document_signed":
      return "Signed";
    case "document_issued":
      return "Issued";
    case "failed":
      return "Failed";
    default:
      return status;
  }
};

export const TransactionsTable = () => {
  const [showPreview, setShowPreview] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [documentData, setDocumentData] = useState<any>(null);
  const { toast } = useToast();
  
  const { transactions, isLoading, invalidateTransactions } = useTransactions();
  const { fetchDocumentData, handleDelete } = useDocumentData();

  // Set up real-time subscription
  useEffect(() => {
    console.log("Setting up real-time subscription for transactions");
    const channel = supabase
      .channel('transactions-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'transactions'
        },
        async (payload) => {
          console.log("Received real-time update:", payload);
          await invalidateTransactions();
        }
      )
      .subscribe();

    // Cleanup subscription on component unmount
    return () => {
      console.log("Cleaning up real-time subscription");
      supabase.removeChannel(channel);
    };
  }, [invalidateTransactions]);

  const handlePreviewClick = async (transaction: Transaction) => {
    try {
      const docData = await fetchDocumentData(transaction);
      if (!docData) {
        toast({
          title: "Document Not Found",
          description: "The document data could not be retrieved.",
          variant: "destructive",
        });
        return;
      }
      setSelectedTransaction(transaction);
      setDocumentData(docData);
      setShowPreview(true);
    } catch (error) {
      console.error("Error in handlePreviewClick:", error);
      toast({
        title: "Error",
        description: "Failed to load document preview",
        variant: "destructive",
      });
    }
  };

  const onDelete = async (transaction: Transaction) => {
    console.log("Starting delete process for transaction:", transaction.id);
    const success = await handleDelete(transaction);
    if (success) {
      console.log("Delete successful, invalidating transactions cache");
      await invalidateTransactions();
      console.log("Cache invalidated, UI should update");
    }
  };

  const renderPreview = () => {
    if (!selectedTransaction || !documentData) return null;

    switch (selectedTransaction.document_subtype?.toLowerCase()) {
      case "verifiable":
        return <InvoicePreview data={documentData} />;
      case "transferable":
        return <BillOfLadingPreview data={documentData} />;
      default:
        return <div>Unsupported document type</div>;
    }
  };

  const transactionRows = useMemo(() => {
    if (!transactions) return null;

    return transactions.map((tx: Transaction) => (
      <TableRow key={tx.id}>
        <TableCell className="font-mono">
          {tx.transaction_hash ? 
            `${tx.transaction_hash.slice(0, 10)}...${tx.transaction_hash.slice(-8)}` :
            '-'
          }
        </TableCell>
        <TableCell className="capitalize">{tx.document_subtype || '-'}</TableCell>
        <TableCell>{tx.title || '-'}</TableCell>
        <TableCell>
          <span className={getStatusColor(tx.status)}>
            {getStatusDisplay(tx.status)}
          </span>
        </TableCell>
        <TableCell>
          {formatDistanceToNow(new Date(tx.created_at), {
            addSuffix: true,
          })}
        </TableCell>
        <TableCell className="text-right">
          <TransactionActions
            transaction={tx}
            onPreviewClick={() => handlePreviewClick(tx)}
            onDelete={() => onDelete(tx)}
          />
        </TableCell>
      </TableRow>
    ));
  }, [transactions]);

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction Hash</TableHead>
              <TableHead>Subtype</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Time</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactionRows}
            {(!transactions || transactions.length === 0) && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-gray-500"
                >
                  No transactions found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <PreviewDialog
        title={`${selectedTransaction?.title || 'Document'} Preview`}
        isOpen={showPreview}
        onOpenChange={setShowPreview}
      >
        {renderPreview()}
      </PreviewDialog>
    </>
  );
};
