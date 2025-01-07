import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useWallet } from "@/contexts/WalletContext";
import { Card } from "@/components/ui/card";
import { TransactionsTable } from "@/components/transactions/TransactionsTable";
import { CreateTransactionDialog } from "@/components/transactions/CreateTransactionDialog";

export default function TransactionHistory() {
  const { toast } = useToast();
  const { isWalletConnected } = useWallet();

  useEffect(() => {
    if (!isWalletConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to view transactions",
        variant: "destructive",
      });
    }
  }, [isWalletConnected, toast]);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
        {isWalletConnected && <CreateTransactionDialog />}
      </div>

      {!isWalletConnected ? (
        <Card className="p-6">
          <div className="text-center text-gray-500">
            <p>Please connect your wallet to view transactions</p>
          </div>
        </Card>
      ) : (
        <TransactionsTable />
      )}
    </div>
  );
}