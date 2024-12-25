import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ContractStatus } from "./ContractStatus";
import { ContractActions } from "./ContractActions";
import { format } from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Contract {
  id: string;
  created: Date;
  updated?: Date;
  owner: string;
  currentHolder: string;
  totalValue: number;
  status: string;
}

interface ContractsTableProps {
  contracts: Contract[];
  onAction: (action: string, contract: Contract) => void;
}

const truncateAddress = (address: string) => {
  if (address.length <= 10) return address;
  return `${address.slice(0, 10)}......${address.slice(-5)}`;
};

export const ContractsTable = ({ contracts, onAction }: ContractsTableProps) => {
  return (
    <TooltipProvider>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Contract ID</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Current Holder</TableHead>
            <TableHead>Total Value</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contracts.map((contract) => (
            <TableRow key={contract.id}>
              <TableCell className="font-mono text-xs">
                <Tooltip>
                  <TooltipTrigger className="cursor-help">
                    {truncateAddress(contract.id)}
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-mono text-xs">{contract.id}</p>
                  </TooltipContent>
                </Tooltip>
              </TableCell>
              <TableCell>{format(contract.created, 'dd MMM yyyy')}</TableCell>
              <TableCell>
                {contract.updated ? format(contract.updated, 'dd MMM yyyy') : '-'}
              </TableCell>
              <TableCell>{contract.owner}</TableCell>
              <TableCell>{contract.currentHolder}</TableCell>
              <TableCell>${contract.totalValue.toFixed(2)}</TableCell>
              <TableCell>
                <ContractStatus status={contract.status} />
              </TableCell>
              <TableCell className="text-right">
                <ContractActions 
                  contract={contract} 
                  onAction={onAction}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TooltipProvider>
  );
};