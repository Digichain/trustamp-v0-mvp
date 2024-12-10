import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Wallet, LogOut } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const WalletConnect = () => {
  const [account, setAccount] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window as any;
      if (!ethereum) {
        console.log('MetaMask not detected');
        return;
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });
      if (accounts.length !== 0) {
        console.log('Found authorized account:', accounts[0]);
        setAccount(accounts[0]);
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window as any;
      if (!ethereum) {
        toast({
          title: "MetaMask not found",
          description: "Please install MetaMask browser extension",
          variant: "destructive",
        });
        return;
      }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      console.log('Connected account:', accounts[0]);
      setAccount(accounts[0]);
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to MetaMask",
      });
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to MetaMask",
        variant: "destructive",
      });
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    toast({
      title: "Wallet Disconnected",
      description: "Successfully disconnected from MetaMask",
    });
  };

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  if (!account) {
    return (
      <Button onClick={connectWallet} className="gap-2">
        <Wallet className="h-5 w-5" />
        Connect Wallet
      </Button>
    );
  }

  return (
    <div className="flex gap-4">
      <Button variant="outline" onClick={disconnectWallet} className="gap-2">
        <LogOut className="h-5 w-5" />
        Disconnect
      </Button>
      <Button onClick={handleDashboard} className="gap-2">
        Proceed to Dashboard
      </Button>
    </div>
  );
};

export default WalletConnect;