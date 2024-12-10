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
    // Add event listener for account changes
    const { ethereum } = window as any;
    if (ethereum) {
      ethereum.on('accountsChanged', checkWalletConnection);
    }
    return () => {
      if (ethereum) {
        ethereum.removeListener('accountsChanged', checkWalletConnection);
      }
    };
  }, []);

  const checkWalletConnection = async () => {
    try {
      const { ethereum } = window as any;
      if (!ethereum) {
        console.log('MetaMask not detected');
        setIsWalletConnected(false);
        return;
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });
      const isConnected = accounts.length > 0;
      setIsWalletConnected(isConnected);
      console.log('Wallet connection status:', isConnected);
    } catch (error) {
      console.error('Error checking wallet connection:', error);
      setIsWalletConnected(false);
    }
  };

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