import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import { ContractsTable } from "@/components/payments/ContractsTable";
import { TransactionHistory } from "@/components/payments/TransactionHistory";

const Payments = () => {
  console.log('Payments page rendered');

  // Dummy contract data with valid Ethereum addresses
  const contracts = [
    {
      id: "0x1234567890123456789012345678901234567890",
      created: new Date('2024-03-15'),
      owner: "DigiChain",
      currentHolder: "DigiChain",
      totalValue: 1500.00,
      status: "held in escrow"
    },
    {
      id: "0xabcdef0123456789abcdef0123456789abcdef01",
      created: new Date('2024-03-16'),
      owner: "DigiChain",
      currentHolder: "DigiChain",
      totalValue: 2500.00,
      status: "paid"
    },
    {
      id: "0x9876543210fedcba9876543210fedcba98765432",
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
            <ContractsTable 
              contracts={contracts}
              onAction={handleAction}
            />
          </CardContent>
        </Card>

        {/* Transaction History */}
        <TransactionHistory transactions={transactions} />
      </div>
    </div>
  );
};

export default Payments;