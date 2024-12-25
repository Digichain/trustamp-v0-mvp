import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ContractStatus } from "./ContractStatus";
import { format } from "date-fns";

interface Contract {
  id: string;
  created: Date;
  updated?: Date; // Make updated optional since we're adding it now
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
          <TableHead>Contract ID</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Updated</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead>Current Holder</TableHead>
          <TableHead>Total Value</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contracts.map((contract) => (
          <TableRow key={contract.id}>
            <TableCell className="font-mono text-xs">{contract.id}</TableCell>
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
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};