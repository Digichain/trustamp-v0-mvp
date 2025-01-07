import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTransactions } from "@/hooks/useTransactions";
import { useToast } from "@/components/ui/use-toast";
import { TransactionRow } from "./TransactionRow";
import { useTransactionSubscription } from "@/hooks/useTransactionSubscription";
import { Transaction } from "@/types/transactions";

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

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Transaction Hash</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Time</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions?.map((tx: Transaction) => (
            <TransactionRow
              key={tx.id}
              transaction={tx}
              onDelete={onDelete}
            />
          ))}
          {(!transactions || transactions.length === 0) && (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center py-8 text-gray-500"
              >
                No transactions found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};