import { Button } from "@/components/ui/button";
import { MoreVertical, FileText, CreditCard, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Contract {
  id: string;
  status: string;
}

interface ContractActionsProps {
  contract: Contract;
  onAction: (action: string, contract: Contract) => void;
}

export const ContractActions = ({ contract, onAction }: ContractActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onAction('options', contract)}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Options</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAction('documents', contract)}>
          <FileText className="mr-2 h-4 w-4" />
          <span>Contract Documents</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onAction('pay', contract)}
          disabled={contract.status !== 'outstanding'}
          className={contract.status !== 'outstanding' ? 'opacity-50' : ''}
        >
          <CreditCard className="mr-2 h-4 w-4" />
          <span>Pay Now</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAction('override', contract)}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Override Conditions</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};