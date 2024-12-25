import { useState } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PreviewDialog } from "./previews/PreviewDialog";
import { InvoicePreview } from "./previews/InvoicePreview";
import { BillOfLadingPreview } from "./previews/BillOfLadingPreview";
import { useTransactions } from "@/hooks/useTransactions";
import { useDocumentData } from "@/hooks/useDocumentData";
import { useToast } from "@/components/ui/use-toast";
import { TransactionRow } from "./TransactionRow";
import { useTransactionSubscription } from "@/hooks/useTransactionSubscription";
import { Transaction } from "@/types/transactions";

export const TransactionsTable = () => {
  const [showPreview, setShowPreview] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [documentData, setDocumentData] = useState<any>(null);
  const { toast } = useToast();
  
  const { transactions, isLoading, invalidateTransactions } = useTransactions();
  const { fetchDocumentData, handleDelete } = useDocumentData();

  // Set up real-time subscription
  useTransactionSubscription(invalidateTransactions);

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
            {transactions?.map((tx: Transaction) => (
              <TransactionRow
                key={tx.id}
                transaction={tx}
                onPreviewClick={handlePreviewClick}
                onDelete={onDelete}
              />
            ))}
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