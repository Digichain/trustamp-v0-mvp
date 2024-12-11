import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from "@/components/ui/sidebar";
import { WalletProvider } from "@/contexts/WalletContext";
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import Transactions from '@/pages/Transactions';
import CreateTransaction from '@/pages/CreateTransaction';
import CreateTransferableTransaction from '@/pages/CreateTransferableTransaction';
import Account from '@/pages/Account';
import Auth from '@/pages/Auth';
import { useEffect, useState } from 'react';
import { supabase } from './integrations/supabase/client';

// Protected Route wrapper component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <WalletProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
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
            </Routes>
            <Toaster />
          </Router>
        </div>
      </SidebarProvider>
    </WalletProvider>
  );
}

export default App;