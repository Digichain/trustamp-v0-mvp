import { Button } from "@/components/ui/button";
import { FileCheck } from "lucide-react";
import { CreateTransactionDialog } from "@/components/transactions/CreateTransactionDialog";
import { TransactionsTable } from "@/components/transactions/TransactionsTable";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";

const Transactions = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    try {
      const { ethereum } = window as any;
      if (!ethereum) {
        console.log('MetaMask not detected');
        return;
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });
      setIsWalletConnected(accounts.length > 0);
      console.log('Wallet connection status:', accounts.length > 0);
    } catch (error) {
      console.error('Error checking wallet connection:', error);
    }
  };

  const handleWalletRequired = () => {
    toast({
      title: "Wallet Connection Required",
      description: "Please connect your wallet to perform this action",
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
          <div className="flex gap-4">
            {isWalletConnected ? (
              <>
                <CreateTransactionDialog />
                <Button variant="outline">
                  <FileCheck className="mr-2" />
                  Verify Document
                </Button>
              </>
            ) : (
              <>
                <Button onClick={handleWalletRequired}>
                  Create new Transaction
                </Button>
                <Button variant="outline" onClick={handleWalletRequired}>
                  <FileCheck className="mr-2" />
                  Verify Document
                </Button>
              </>
            )}
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