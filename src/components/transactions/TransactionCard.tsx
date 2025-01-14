import { Card } from "@/components/ui/card";
import { Transaction } from "@/types/transactions";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface TransactionCardProps {
  transaction: Transaction;
  onDelete: (transaction: Transaction) => void;
}

export const TransactionCard = ({ transaction, onDelete }: TransactionCardProps) => {
  const { toast } = useToast();

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

      const blob = new Blob([JSON.stringify(documentData, null, 2)], {
        type: "application/json",
      });
      const url = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `document_${index + 1}.json`;
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
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Attached Documents:</h4>
        {(transaction.document1 || transaction.document2) ? (
          <div className="space-y-2">
            {transaction.document1 && (
              <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                <span className="text-sm">Document 1</span>
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
                <span className="text-sm">Document 2</span>
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