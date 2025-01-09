import { useTransactions } from "@/hooks/useTransactions";
import { useToast } from "@/components/ui/use-toast";
import { TransactionCard } from "./TransactionCard";
import { Transaction } from "@/types/transactions";
import { useTransactionSubscription } from "@/hooks/useTransactionSubscription";
import { supabase } from "@/integrations/supabase/client";

export const TransactionsTable = () => {
  const { toast } = useToast();
  const { transactions, isLoading, invalidateTransactions } = useTransactions();

  // Set up real-time subscription
  useTransactionSubscription(invalidateTransactions);

  const onDelete = async (transaction: Transaction) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', transaction.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Transaction deleted successfully",
      });
      await invalidateTransactions();
    } catch (error: any) {
      console.error("Error deleting transaction:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete transaction",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading transactions...</div>;
  }

  return (
    <div className="space-y-4">
      {transactions?.map((transaction: Transaction) => (
        <TransactionCard
          key={transaction.id}
          transaction={transaction}
          onDelete={onDelete}
        />
      ))}
      {(!transactions || transactions.length === 0) && (
        <div className="text-center py-8 text-gray-500">
          No transactions found
        </div>
      )}
    </div>
  );
};