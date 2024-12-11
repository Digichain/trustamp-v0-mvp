import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { TransactionActions } from "./actions/TransactionActions";

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
  const queryClient = useQueryClient();

  const { data: transactions, isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching transactions:", error);
        throw error;
      }

      return data;
    },
  });

  const fetchDocumentData = async (transaction: any) => {
    console.log("Fetching document data for transaction:", transaction);
    
    if (transaction.document_subtype === "verifiable") {
      const { data, error } = await supabase
        .from("invoice_documents")
        .select("*")
        .eq("transaction_id", transaction.id);

      if (error) {
        console.error("Error fetching invoice document:", error);
        return null;
      }

      return data && data.length > 0 ? data[0] : null;

    } else if (transaction.document_subtype === "transferable") {
      const { data, error } = await supabase
        .from("bill_of_lading_documents")
        .select("*")
        .eq("transaction_id", transaction.id);

      if (error) {
        console.error("Error fetching bill of lading document:", error);
        return null;
      }

      return data && data.length > 0 ? data[0] : null;
    }

    return null;
  };

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

  const handleDelete = async (transaction: any) => {
    try {
      // Delete from the appropriate document table
      const documentTable = transaction.document_subtype === "verifiable" 
        ? "invoice_documents" 
        : "bill_of_lading_documents";
      
      const { error: documentError } = await supabase
        .from(documentTable)
        .delete()
        .eq("transaction_id", transaction.id);

      if (documentError) throw documentError;

      // Delete from transactions table
      const { error: transactionError } = await supabase
        .from("transactions")
        .delete()
        .eq("id", transaction.id);

      if (transactionError) throw transactionError;

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('raw-documents')
        .remove([`${transaction.id}.json`]);

      if (storageError) {
        console.error("Error deleting from storage:", storageError);
        // Don't throw here as the file might not exist
      }

      // Refresh the transactions list
      queryClient.invalidateQueries({ queryKey: ["transactions"] });

      toast({
        title: "Success",
        description: "Document deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting document:", error);
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive",
      });
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
                    onDelete={() => handleDelete(tx)}
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