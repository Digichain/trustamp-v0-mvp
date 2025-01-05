import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, FileText, BarChart as BarChartIcon, ArrowUpDown } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { TransactionChart } from "@/components/dashboard/TransactionChart";
import { DocumentDistribution } from "@/components/dashboard/DocumentDistribution";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { UserProfile } from "@/components/dashboard/UserProfile";

const mockBarChartData = [
  { name: 'Jan', transactions: 12 },
  { name: 'Feb', transactions: 19 },
  { name: 'Mar', transactions: 15 },
  { name: 'Apr', transactions: 25 },
  { name: 'May', transactions: 22 },
  { name: 'Jun', transactions: 30 }
];

const mockPieChartData = [
  { name: 'Invoices', value: 45, color: '#8884d8' },
  { name: 'Bills of Lading', value: 30, color: '#82ca9d' },
  { name: 'Other Documents', value: 25, color: '#ffc658' }
];

const mockRecentTransactions = [
  {
    id: "1",
    type: "Invoice",
    date: "2024-03-15",
    status: "Completed"
  },
  {
    id: "2", 
    type: "Bill of Lading",
    date: "2024-03-14",
    status: "Pending"
  },
  {
    id: "3",
    type: "Invoice",
    date: "2024-03-13", 
    status: "Completed"
  }
];

const Dashboard = () => {
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <UserProfile />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Transactions"
            value={45}
            description="+20.1% from last month"
            icon={Activity}
          />
          <StatsCard
            title="Documents Issued"
            value={28}
            description="+12 this month"
            icon={FileText}
          />
          <StatsCard
            title="Active Contracts"
            value={15}
            description="3 pending approval"
            icon={BarChartIcon}
          />
          <StatsCard
            title="Document Transfers"
            value={8}
            description="Last 7 days"
            icon={ArrowUpDown}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DocumentDistribution data={mockPieChartData} />
          <TransactionChart data={mockBarChartData} />
          <div className="lg:col-span-2">
            <RecentTransactions transactions={mockRecentTransactions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;