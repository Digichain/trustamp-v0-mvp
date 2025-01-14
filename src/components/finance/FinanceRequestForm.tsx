import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTransactions } from "@/hooks/useTransactions";

export const FinanceRequestForm = () => {
  console.log("FinanceRequestForm - Rendering");
  const { transactions, isLoading } = useTransactions();

  const financeTypes = [
    "Accounts Receivable (Invoice)",
    "Trade Document (Bill of Lading)",
    "Fixed Term Agreement (30 days)",
    "Fixed Term Agreement (60 days)",
    "Fixed Term Agreement (90 days)",
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="financeType" className="text-sm font-medium">
          Finance Type
        </label>
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select finance type" />
          </SelectTrigger>
          <SelectContent>
            {financeTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label htmlFor="transaction" className="text-sm font-medium">
          Select Transaction
        </label>
        <Select disabled={isLoading}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={isLoading ? "Loading transactions..." : "Select transaction"} />
          </SelectTrigger>
          <SelectContent>
            {transactions?.map((transaction) => (
              <SelectItem key={transaction.id} value={transaction.id}>
                {transaction.title || `Transaction ${transaction.id.slice(0, 8)}`}
              </SelectItem>
            ))}
            {!isLoading && (!transactions || transactions.length === 0) && (
              <SelectItem value="no-transactions" disabled>
                No transactions available
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};