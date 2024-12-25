import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ArrowUp, ArrowDown, MoreVertical, FileText, CreditCard, Settings } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Payments = () => {
  console.log('Payments page rendered');

  // Dummy contract data with creation dates
  const contracts = [
    {
      id: "0x1234567890abcdef",
      created: new Date('2024-03-15'),
      owner: "DigiChain",
      currentHolder: "DigiChain",
      totalValue: 1500.00,
      status: "held in escrow"
    },
    {
      id: "0xabcdef1234567890",
      created: new Date('2024-03-16'),
      owner: "DigiChain",
      currentHolder: "DigiChain",
      totalValue: 2500.00,
      status: "paid"
    },
    {
      id: "0x9876543210fedcba",
      created: new Date('2024-03-17'),
      owner: "DigiChain",
      currentHolder: "DigiChain",
      totalValue: 3000.00,
      status: "outstanding"
    }
  ];

  // Dummy transaction history
  const transactions = [
    {
      id: 1,
      date: "2024-03-20",
      type: "incoming",
      amount: 500.00,
      description: "Contract payment received"
    },
    {
      id: 2,
      date: "2024-03-19",
      type: "outgoing",
      amount: 300.00,
      description: "Service fee payment"
    },
    {
      id: 3,
      date: "2024-03-18",
      type: "incoming",
      amount: 1000.00,
      description: "Contract settlement"
    }
  ];

  const handleAction = (action: string, contract: any) => {
    console.log(`Action ${action} triggered for contract ${contract.id}`);
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Section with Wallet Balance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Fiat Account Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="p-4 bg-primary/10 rounded-full">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Balance</p>
                  <h2 className="text-3xl font-bold">$100.00</h2>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contracts Table */}
        <Card>
          <CardHeader>
            <CardTitle>Active Contracts</CardTitle>
          </CardHeader>
          <CardContent>
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
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        contract.status === 'paid' ? 'bg-green-100 text-green-800' :
                        contract.status === 'held in escrow' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {contract.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleAction('options', contract)}>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Options</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAction('documents', contract)}>
                            <FileText className="mr-2 h-4 w-4" />
                            <span>Contract Documents</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleAction('pay', contract)}
                            disabled={contract.status !== 'outstanding'}
                            className={contract.status !== 'outstanding' ? 'opacity-50' : ''}
                          >
                            <CreditCard className="mr-2 h-4 w-4" />
                            <span>Pay Now</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAction('override', contract)}>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Override Conditions</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${
                      transaction.type === 'incoming' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {transaction.type === 'incoming' ? (
                        <ArrowDown className="h-4 w-4 text-green-600" />
                      ) : (
                        <ArrowUp className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">{transaction.date}</p>
                    </div>
                  </div>
                  <span className={`font-semibold ${
                    transaction.type === 'incoming' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'incoming' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Payments;