import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useTransactions } from "@/hooks/useTransactions";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const FinanceRequestForm = () => {
  console.log("FinanceRequestForm - Rendering");
  const { toast } = useToast();
  const { transactions, isLoading } = useTransactions();
  const [agreed, setAgreed] = useState(false);
  const [selectedFinanceType, setSelectedFinanceType] = useState<string>("");
  const [selectedTransaction, setSelectedTransaction] = useState<string>("");

  const financeTypes = [
    "Accounts Receivable (Invoice)",
    "Trade Document (Bill of Lading)",
    "Fixed Term Agreement (30 days)",
    "Fixed Term Agreement (60 days)",
    "Fixed Term Agreement (90 days)",
  ];

  const handleSubmit = async () => {
    console.log("Form submitted");
    if (!selectedFinanceType || !selectedTransaction) {
      toast({
        title: "Error",
        description: "Please select both finance type and transaction",
        variant: "destructive",
      });
      return;
    }

    const transaction = transactions?.find(t => t.id === selectedTransaction);
    if (!transaction) {
      toast({
        title: "Error",
        description: "Selected transaction not found",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('finance_requests')
        .insert({
          finance_type: selectedFinanceType,
          transaction_id: selectedTransaction,
          amount: transaction.payment_amount || 0,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Finance request submitted successfully",
      });
    } catch (error) {
      console.error("Error submitting finance request:", error);
      toast({
        title: "Error",
        description: "Failed to submit finance request",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="financeType" className="text-sm font-medium">
          Finance Type
        </label>
        <Select onValueChange={setSelectedFinanceType} value={selectedFinanceType}>
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
        <Select 
          disabled={isLoading} 
          onValueChange={setSelectedTransaction}
          value={selectedTransaction}
        >
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

      <div className="space-y-4">
        <a 
          href="#" 
          className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
          onClick={(e) => {
            e.preventDefault();
            console.log("PDS link clicked");
            // Add link to actual PDS document
          }}
        >
          Finance Product Disclosure Statement
        </a>

        <div className="flex items-start space-x-2">
          <Checkbox
            id="terms"
            checked={agreed}
            onCheckedChange={(checked) => setAgreed(checked as boolean)}
          />
          <label
            htmlFor="terms"
            className="text-sm text-gray-600 leading-tight"
          >
            I have read and understood this agreement. I agree to all the Terms and conditions as highlighted in Annexure A of the agreement.
          </label>
        </div>
      </div>

      <Button 
        className="w-full bg-black hover:bg-black/90"
        disabled={!agreed}
        onClick={handleSubmit}
      >
        Submit Request
      </Button>
    </div>
  );
};