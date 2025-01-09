import { MoreVertical, Trash2, Plus, DollarSign } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Transaction } from "@/types/transactions";
import { useToast } from "@/components/ui/use-toast";

interface TransactionActionsProps {
  transaction: Transaction;
  onDelete: () => void;
  documents: Array<{
    id: string;
    title: string;
    status: string;
  }>;
}

export const TransactionActions = ({ 
  transaction, 
  onDelete
}: TransactionActionsProps) => {
  const { toast } = useToast();

  const handlePayNow = async () => {
    // TODO: Implement payment logic
    toast({
      title: "Payment",
      description: "Payment functionality coming soon",
    });
  };

  return (
    <div className="flex items-center gap-2">
      {transaction.payment_bound && (
        <Button 
          onClick={handlePayNow}
          variant="default"
          size="sm"
          className="flex items-center gap-2"
        >
          <DollarSign className="h-4 w-4" />
          Pay Now
        </Button>
      )}
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Plus className="mr-2 h-4 w-4" />
            Attach Document
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={onDelete}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Transaction
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};