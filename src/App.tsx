import { BrowserRouter } from "react-router-dom";
import { WalletProvider } from "./contexts/WalletContext";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Transactions from "./pages/Transactions";
import Account from "./pages/Account";

function App() {
  return (
    <WalletProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/account" element={<Account />} />
        </Routes>
      </BrowserRouter>
    </WalletProvider>
  );
}

export default App;
