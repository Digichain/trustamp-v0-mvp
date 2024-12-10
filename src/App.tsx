import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import Transactions from "./pages/Transactions";
import Account from "./pages/Account";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { WalletProvider } from "@/contexts/WalletContext";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <BrowserRouter>
          <SidebarProvider>
            <div className="flex min-h-screen w-full">
              <AppSidebar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Transactions />} />
                  <Route path="/transactions" element={<Transactions />} />
                  <Route path="/account" element={<Account />} />
                </Routes>
              </main>
            </div>
          </SidebarProvider>
        </BrowserRouter>
      </WalletProvider>
    </QueryClientProvider>
  );
}

export default App;