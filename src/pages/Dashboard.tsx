import { SidebarTrigger } from "@/components/ui/sidebar";

const Dashboard = () => {
  console.log('Dashboard page rendered');

  return (
    <div className="p-8">
      <SidebarTrigger className="mb-4" />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Trustamp Dashboard</h1>
        <p className="text-gray-600">Welcome to your digital trade documentation dashboard.</p>
      </div>
    </div>
  );
};

export default Dashboard;