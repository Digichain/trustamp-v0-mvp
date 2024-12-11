import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from "@/components/ui/sidebar";
import { WalletProvider } from "@/contexts/WalletContext";
import { AppSidebar } from "@/components/AppSidebar";
import Dashboard from '@/pages/Dashboard';
import Transactions from '@/pages/Transactions';
import CreateTransaction from '@/pages/CreateTransaction';
import CreateTransferableTransaction from '@/pages/CreateTransferableTransaction';
import Account from '@/pages/Account';
import Auth from '@/pages/Auth';
import Payments from '@/pages/Payments';
import { useEffect, useState } from 'react';
import { supabase } from './integrations/supabase/client';

console.log("App component initializing...");

// Protected Route wrapper component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    console.log("ProtectedRoute - Checking authentication...");
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log("ProtectedRoute - Auth check result:", !!session);
      setIsAuthenticated(!!session);
    };
    
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("ProtectedRoute - Auth state changed:", event, !!session);
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    console.log("ProtectedRoute - Loading state");
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    console.log("ProtectedRoute - Not authenticated, redirecting to auth");
    return <Navigate to="/auth" />;
  }

  console.log("ProtectedRoute - Authenticated, rendering protected content");
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};

function App() {
  console.log("App component rendering...");
  return (
    <Router>
      <WalletProvider>
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <Routes>
              <Route path="/" element={<Navigate to="/auth" replace />} />
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transactions"
                element={
                  <ProtectedRoute>
                    <Transactions />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transactions/create"
                element={
                  <ProtectedRoute>
                    <CreateTransaction />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transactions/create-transferable"
                element={
                  <ProtectedRoute>
                    <CreateTransferableTransaction />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/account"
                element={
                  <ProtectedRoute>
                    <Account />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payments"
                element={
                  <ProtectedRoute>
                    <Payments />
                  </ProtectedRoute>
                }
              />
            </Routes>
            <Toaster />
          </div>
        </SidebarProvider>
      </WalletProvider>
    </Router>
  );
}

export default App;