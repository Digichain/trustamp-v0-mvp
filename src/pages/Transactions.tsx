import { Button } from "@/components/ui/button";
import { FileCheck } from "lucide-react";
import { CreateTransactionDialog } from "@/components/transactions/CreateTransactionDialog";
import { TransactionsTable } from "@/components/transactions/TransactionsTable";
import { useToast } from "@/components/ui/use-toast";
import { useWallet } from "@/contexts/WalletContext";

const Transactions = () => {
  const { isWalletConnected } = useWallet();
  const { toast } = useToast();

  console.log("Wallet connection state:", isWalletConnected); // Debug log

  const handleWalletRequired = () => {
    if (!isWalletConnected) {
      toast({
        title: "Wallet Connection Required",
        description: "Please connect your wallet to perform this action",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
          <div className="flex gap-4">
            <CreateTransactionDialog />
            <Button 
              variant="outline" 
              disabled={!isWalletConnected}
              onClick={handleWalletRequired}
              className="disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileCheck className="mr-2" />
              Verify Document
            </Button>
          </div>
        </div>
        <p className="text-gray-600 mb-8">
          View and manage your trade documentation transactions.
        </p>

        <TransactionsTable />
      </div>
    </div>
  );
};

export default Transactions;