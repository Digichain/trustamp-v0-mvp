import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Transaction {
  id: string;
  type: string;
  date: string;
  status: string;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Transactions</CardTitle>
        <button className="text-sm text-primary hover:underline">
          View All
        </button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div 
              key={transaction.id}
              className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0 hover:bg-muted/50 p-2 rounded-lg transition-colors"
            >
              <div>
                <p className="font-medium">{transaction.type}</p>
                <p className="text-sm text-muted-foreground">{transaction.date}</p>
              </div>
              <span 
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  transaction.status === 'Completed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {transaction.status}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}