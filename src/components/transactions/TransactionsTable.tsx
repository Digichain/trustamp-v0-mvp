import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "text-green-600";
    case "pending":
      return "text-yellow-600";
    case "failed":
      return "text-red-600";
    default:
      return "text-gray-600";
  }
};

export const TransactionsTable = () => {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching transactions:", error);
        throw error;
      }

      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-full mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-full mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-full mb-4"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Transaction Hash</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Network</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions?.map((tx) => (
            <TableRow key={tx.id}>
              <TableCell className="font-mono">
                {tx.transaction_hash.slice(0, 10)}...
                {tx.transaction_hash.slice(-8)}
              </TableCell>
              <TableCell className="capitalize">{tx.transaction_type}</TableCell>
              <TableCell>{tx.network}</TableCell>
              <TableCell>{tx.amount}</TableCell>
              <TableCell>
                <span className={getStatusColor(tx.status)}>{tx.status}</span>
              </TableCell>
              <TableCell>
                {formatDistanceToNow(new Date(tx.created_at || ""), {
                  addSuffix: true,
                })}
              </TableCell>
            </TableRow>
          ))}
          {(!transactions || transactions.length === 0) && (
            <TableRow>
              <TableCell
                colSpan={6}
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