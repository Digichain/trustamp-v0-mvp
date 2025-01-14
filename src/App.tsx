import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import CreateDocument from "@/pages/CreateDocument";
import VerifyDocument from "@/pages/VerifyDocument";
import VerifyOnChain from "@/pages/VerifyOnChain";
import Payments from "@/pages/Payments";
import Settings from "@/pages/Settings";
import { PrivateRoute } from "@/components/auth/PrivateRoute";
import { useAuth } from "@/hooks/use-auth";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/verify-onchain" element={<VerifyOnChain />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-document"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <CreateDocument />
            </PrivateRoute>
          }
        />
        <Route
          path="/verify-document"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <VerifyDocument />
            </PrivateRoute>
          }
        />
        <Route
          path="/payments"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <Payments />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <Settings />
            </PrivateRoute>
          }
        />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
