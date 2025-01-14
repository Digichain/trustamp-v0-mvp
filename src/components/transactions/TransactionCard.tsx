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

      const blob = new Blob([JSON.stringify(documentData.document, null, 2)], {
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
              Payment Amount: ${transaction.payment_amount.toFixed(2)}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <TransactionStatus status={transaction.status} />
          <TransactionActions 
            transaction={transaction}
            onDelete={() => onDelete(transaction)}
            documents={[
              transaction.document1,
              transaction.document2
            ].filter(Boolean)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Attached Documents:</h4>
        {(transaction.document1 || transaction.document2) ? (
          <div className="space-y-2">
            {transaction.document1 && (
              <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                <span className="text-sm">{transaction.document1.title}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownload(transaction.document1, 0)}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            )}
            {transaction.document2 && (
              <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                <span className="text-sm">{transaction.document2.title}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownload(transaction.document2, 1)}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No documents attached</p>
        )}
      </div>
    </Card>
  );
};