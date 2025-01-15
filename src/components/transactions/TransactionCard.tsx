import { Card } from "@/components/ui/card";
import { Transaction } from "@/types/transactions";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Download, MoreVertical } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { TransactionStatus } from "./TransactionStatus";
import { TransactionActions } from "./actions/TransactionActions";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface TransactionCardProps {
  transaction: Transaction;
  onDelete: (transaction: Transaction) => void;
}

export const TransactionCard = ({ transaction, onDelete }: TransactionCardProps) => {
  const { toast } = useToast();
  
  // Check if user is admin
  const { data: session } = useQuery({
    queryKey: ["user-session"],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    }
  });

  const isAdmin = session?.user?.email === 'digichaininnovations@gmail.com';
  console.log("TransactionCard - Is admin:", isAdmin);

  const handleDownload = async (documentData: any, index: number) => {
    console.log(`TransactionCard - Handling document ${index + 1} download:`, documentData);
    try {
      if (!documentData) {
        console.error("No document data available for download");
        toast({
          title: "Error",
          description: "No document data available for download",
          variant: "destructive",
        });
        return;
      }

      // Get the actual document content
      const documentContent = documentData.document || documentData;
      console.log("Document content for download:", documentContent);

      // Create a formatted JSON string with proper indentation
      const jsonString = JSON.stringify(documentContent, null, 2);
      const blob = new Blob([jsonString], {
        type: "application/json",
      });
      const url = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `${documentData.title || `document_${index + 1}`}.json`;
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

  // Get all documents from the transaction
  const documents = [
    transaction.document1,
    transaction.document2
  ].filter(doc => doc !== null && doc !== undefined);
  
  console.log("TransactionCard - Available documents:", documents);

  return (
    <Card className="p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{transaction.title || "Untitled Transaction"}</h3>
          <p className="text-sm text-gray-500">
            Created {formatDistanceToNow(new Date(transaction.created_at), { addSuffix: true })}
          </p>
          {transaction.payment_bound && transaction.payment_amount && (
            <p className="text-sm font-medium text-green-600 mt-2">
              {transaction.status === 'completed' ? 
                `Paid Out: $${transaction.payment_amount.toFixed(2)}` :
                transaction.status === 'payment_made' ? 
                  `Deposit Made: $${transaction.payment_amount.toFixed(2)}` :
                  `Payment Amount: $${transaction.payment_amount.toFixed(2)}`
              }
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <TransactionStatus status={transaction.status} />
          <TransactionActions 
            transaction={transaction}
            onDelete={() => onDelete(transaction)}
            documents={documents}
          />
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Attached Documents:</h4>
        {documents.length > 0 ? (
          <div className="space-y-2">
            {documents.map((doc, index) => (
              <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{doc.title || `Document ${index + 1}`}</span>
                  <span className="text-xs text-gray-500">
                    {doc.document?.data?.billOfLadingDetails ? 'Bill of Lading' : 
                     doc.document?.data?.invoiceDetails ? 'Commercial Invoice' : 
                     'Document'}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownload(doc, index)}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No documents attached</p>
        )}
      </div>
    </Card>
  );
};