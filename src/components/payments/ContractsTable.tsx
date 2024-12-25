import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { ContractActions } from "./ContractActions";
import { ContractStatus } from "./ContractStatus";

interface Contract {
  id: string;
  created: Date;
  owner: string;
  currentHolder: string;
  totalValue: number;
  status: string;
}

interface ContractsTableProps {
  contracts: Contract[];
  onAction: (action: string, contract: Contract) => void;
}

export const ContractsTable = ({ contracts, onAction }: ContractsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Contract</TableHead>
          <TableHead>Created</TableHead>
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
            <TableCell className="font-mono">{contract.id}</TableCell>
            <TableCell>{format(contract.created, 'dd-MM-yyyy')}</TableCell>
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
  );
};