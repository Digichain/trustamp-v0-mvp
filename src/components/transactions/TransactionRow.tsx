import { TableCell, TableRow } from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { TransactionStatus } from "./TransactionStatus";
import { TransactionActions } from "./actions/TransactionActions";
import { Transaction } from "@/types/transactions";

interface TransactionRowProps {
  transaction: Transaction;
  onDelete: (transaction: Transaction) => void;
}

export const TransactionRow = ({ 
  transaction, 
  onDelete 
}: TransactionRowProps) => {
  return (
    <TableRow>
      <TableCell className="font-mono">
        {transaction.transaction_hash ? 
          `${transaction.transaction_hash.slice(0, 10)}...${transaction.transaction_hash.slice(-8)}` :
          '-'
        }
      </TableCell>
      <TableCell className="capitalize">{transaction.transaction_type}</TableCell>
      <TableCell>
        <TransactionStatus status={transaction.status} />
      </TableCell>
      <TableCell>
        {formatDistanceToNow(new Date(transaction.created_at), {
          addSuffix: true,
        })}
      </TableCell>
      <TableCell className="text-right">
        <TransactionActions
          transaction={transaction}
          onDelete={() => onDelete(transaction)}
        />
      </TableCell>
    </TableRow>
  );
};