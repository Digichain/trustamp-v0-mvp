import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction } from "@/types/transactions";
import { TransactionStatus } from "./TransactionStatus";
import { TransactionActions } from "./actions/TransactionActions";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface TransactionCardProps {
  transaction: Transaction;
  onDelete: (transaction: Transaction) => void;
}

interface DocumentData {
  id: string;
  title: string;
  status: string;
  document_subtype: string;
  raw_document: {
    invoiceDetails?: {
      total?: number;
    };
    total?: number;
    billOfLadingDetails?: any;
  } | null;
}

export const TransactionCard = ({ transaction, onDelete }: TransactionCardProps) => {
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [invoiceAmount, setInvoiceAmount] = useState<number | null>(null);
  const { toast } = useToast();

  const fetchDocuments = async () => {
    console.log("TransactionCard - Fetching documents for transaction:", transaction.id);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.error("TransactionCard - No authenticated session found");
        throw new Error("Authentication required");
      }

      const isAdmin = session?.user?.email === 'digichaininnovations@gmail.com';
      const isOwner = session?.user?.id === transaction.user_id;
      console.log("TransactionCard - User permissions:", { isAdmin, isOwner, userId: session?.user?.id });

      const { data: transactionDocs, error: tdError } = await supabase
        .from('transaction_documents')
        .select(`
          document_id,
          documents:document_id (
            id,
            title,
            status,
            document_subtype,
            raw_document
          )
        `)
        .eq('transaction_id', transaction.id);

      if (tdError) {
        console.error("TransactionCard - Error fetching transaction documents:", tdError);
        throw tdError;
      }

      if (!transactionDocs || transactionDocs.length === 0) {
        console.log("TransactionCard - No documents found for transaction:", transaction.id);
        setDocuments([]);
        return;
      }

      const formattedDocs: DocumentData[] = transactionDocs
        .map(td => td.documents)
        .filter((doc): doc is NonNullable<typeof doc> => doc !== null)
        .map(doc => ({
          id: doc.id,
          title: doc.title || `Document ${doc.id}`,
          status: doc.status,
          document_subtype: doc.document_subtype,
          raw_document: doc.raw_document as DocumentData['raw_document']
        }));

      console.log("TransactionCard - Formatted documents:", formattedDocs);
      setDocuments(formattedDocs);

      const invoiceDoc = formattedDocs.find(doc => {
        if (!doc.raw_document) return false;
        const rawDoc = doc.raw_document;
        return (
          (rawDoc.invoiceDetails && typeof rawDoc.invoiceDetails.total === 'number') ||
          (typeof rawDoc.total === 'number')
        );
      });
      
      if (invoiceDoc && invoiceDoc.raw_document) {
        const rawDoc = invoiceDoc.raw_document;
        const total = rawDoc.invoiceDetails?.total ?? rawDoc.total ?? 0;
        console.log("TransactionCard - Found invoice amount:", total);
        setInvoiceAmount(total);
      }
    } catch (error) {
      console.error("TransactionCard - Error fetching documents:", error);
      toast({
        title: "Error",
        description: "Failed to load documents",
        variant: "destructive",
      });
    }
  };

  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat('en-AU', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleDownload = async (documentId: string) => {
    try {
      console.log("TransactionCard - Starting document download for ID:", documentId);
      
      const { data: doc, error: docError } = await supabase
        .from("documents")
        .select("*")
        .eq("id", documentId)
        .maybeSingle();

      if (docError) throw docError;
      if (!doc) {
        toast({
          title: "Document Not Found",
          description: "The requested document could not be found.",
          variant: "destructive",
        });
        return;
      }

      const documentData = doc.signed_document || doc.wrapped_document || doc.raw_document;
      if (!documentData) {
        toast({
          title: "Error",
          description: "No document data available for download",
          variant: "destructive",
        });
        return;
      }

      const blob = new Blob([JSON.stringify(documentData, null, 2)], { 
        type: 'application/json' 
      });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${doc.title || 'document'}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Document downloaded successfully",
      });
    } catch (error: any) {
      console.error("TransactionCard - Error downloading document:", error);
      toast({
        title: "Error",
        description: "Failed to download document",
        variant: "destructive",
      });
    }
  };

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
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDownload(doc.id)}
                    className="hover:bg-gray-100"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-gray-500">
          {transaction.payment_bound && invoiceAmount !== null && (
            `AUD ${formatAmount(invoiceAmount)}`
          )}
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