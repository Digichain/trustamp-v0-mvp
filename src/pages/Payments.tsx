import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { ContractsTable } from "@/components/payments/ContractsTable";
import { TransactionHistory } from "@/components/payments/TransactionHistory";

const Payments = () => {
  console.log('Payments page rendered');

  // Generate random numbers for stats
  const activeCount = Math.floor(Math.random() * 10) + 1; // Random number between 1-10
  const completedCount = Math.floor(Math.random() * 6) + 3; // Random number between 3-8

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
        {/* Top Section with Title and Wallet Balance */}
        <div className="flex justify-between items-start">
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Payments</h1>
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Active
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activeCount}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Completed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{completedCount}</div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <Card className="w-[400px]">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Fiat Account Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="p-4 bg-primary/10 rounded-full">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Current Balance</p>
                    <h2 className="text-3xl font-bold">$100.00</h2>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Button className="flex-1" variant="outline">
                    <ArrowUpCircle className="mr-2 h-4 w-4" />
                    Deposit
                  </Button>
                  <Button className="flex-1" variant="outline">
                    <ArrowDownCircle className="mr-2 h-4 w-4" />
                    Withdraw
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contracts Table */}
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
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
