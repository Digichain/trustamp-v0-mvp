import { useState } from "react";
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

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "text-green-600";
    case "pending":
      return "text-yellow-600";
    case "failed":
      return "text-red-600";
    default:
      return "text-gray-600";
  }
};

export const TransactionsTable = () => {
  const [showPreview, setShowPreview] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [documentData, setDocumentData] = useState<any>(null);
  const { toast } = useToast();
  
  const { transactions, isLoading, invalidateTransactions } = useTransactions();
  const { fetchDocumentData, handleDelete } = useDocumentData();

  const handlePreviewClick = async (transaction: any) => {
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

  const onDelete = async (transaction: any) => {
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

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-full mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-full mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-full mb-4"></div>
      </div>
    );
  }

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
            {transactions?.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell className="font-mono">
                  {tx.transaction_hash.slice(0, 10)}...
                  {tx.transaction_hash.slice(-8)}
                </TableCell>
                <TableCell className="capitalize">{tx.document_subtype || '-'}</TableCell>
                <TableCell>{tx.title || '-'}</TableCell>
                <TableCell>
                  <span className={getStatusColor(tx.status)}>{tx.status}</span>
                </TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(tx.created_at || ""), {
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
