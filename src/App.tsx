import { BrowserRouter as Router, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WalletProvider } from "@/contexts/WalletContext";
import { Toaster } from "@/components/ui/toaster";
import { AppSidebar } from "@/components/AppSidebar";
import { Routes, Route } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import Transactions from "@/pages/Transactions";
import CreateTransaction from "@/pages/CreateTransaction";
import CreateTransferableTransaction from "@/pages/CreateTransferableTransaction";
import Payments from "@/pages/Payments";
import Account from "@/pages/Account";
import Index from "@/pages/Index";
import { SidebarProvider } from "@/components/ui/sidebar";

const queryClient = new QueryClient();

// Wrapper component to handle conditional sidebar rendering
const AppContent = () => {
  const location = useLocation();
  const isIndexPage = location.pathname === "/";

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {!isIndexPage && <AppSidebar />}
        <main className={`flex-1 overflow-y-auto ${isIndexPage ? 'w-full' : ''}`}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/transactions/create" element={<CreateTransaction />} />
            <Route
              path="/transactions/create-transferable"
              element={<CreateTransferableTransaction />}
            />
            <Route path="/payments" element={<Payments />} />
            <Route path="/account" element={<Account />} />
          </Routes>
        </main>
      </div>
    </SidebarProvider>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <Router>
          <AppContent />
          <Toaster />
        </Router>
      </WalletProvider>
    </QueryClientProvider>
  );
}

export default App;