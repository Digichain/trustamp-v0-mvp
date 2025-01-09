import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction } from "@/types/transactions";
import { TransactionStatus } from "./TransactionStatus";
import { TransactionActions } from "./actions/TransactionActions";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Eye, Download } from "lucide-react";
import { PreviewDialog } from "./previews/PreviewDialog";
import { InvoicePreview } from "./previews/InvoicePreview";
import { BillOfLadingPreview } from "./previews/BillOfLadingPreview";

interface TransactionCardProps {
  transaction: Transaction;
  onDelete: (transaction: Transaction) => void;
}

export const TransactionCard = ({ transaction, onDelete }: TransactionCardProps) => {
  const [documents, setDocuments] = useState<Array<{ 
    id: string; 
    title: string; 
    status: string;
    document_subtype: string;
    raw_document: any;
  }>>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const { toast } = useToast();

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
            status,
            document_subtype,
            raw_document
          )
        `)
        .eq('transaction_id', transaction.id);

      if (error) throw error;

      const formattedDocs = data.map(item => ({
        id: item.documents.id,
        title: item.documents.title || `Document ${item.documents.id}`,
        status: item.documents.status,
        document_subtype: item.documents.document_subtype,
        raw_document: item.documents.raw_document
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

  const handlePreview = async (documentId: string) => {
    console.log("TransactionCard - Opening preview for document:", documentId);
    const document = documents.find(doc => doc.id === documentId);
    if (document) {
      setSelectedDocument(document);
      setIsPreviewOpen(true);
    }
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
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handlePreview(doc.id)}
                      className="hover:bg-gray-100"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDownload(doc.id)}
                      className="hover:bg-gray-100"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
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

      {selectedDocument && (
        <PreviewDialog
          title={selectedDocument.title}
          isOpen={isPreviewOpen}
          onOpenChange={setIsPreviewOpen}
        >
          {selectedDocument.document_subtype === 'verifiable' ? (
            <InvoicePreview data={selectedDocument.raw_document} />
          ) : (
            <BillOfLadingPreview data={selectedDocument.raw_document} />
          )}
        </PreviewDialog>
      )}
    </Card>
  );
};