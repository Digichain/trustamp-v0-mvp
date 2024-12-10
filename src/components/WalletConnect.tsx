import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Wallet, LogOut } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { useWallet } from "@/contexts/WalletContext";

const WalletConnect = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isWalletConnected, connectWallet, disconnectWallet, walletAddress } = useWallet();

  console.log("WalletConnect - Connection state:", isWalletConnected); // Debug log
  console.log("WalletConnect - Wallet address:", walletAddress); // Debug log

  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to MetaMask",
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    toast({
      title: "Wallet Disconnected",
      description: "Successfully disconnected from MetaMask",
    });
  };

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  if (!isWalletConnected) {
    return (
      <Button onClick={handleConnect} className="gap-2">
        <Wallet className="h-5 w-5" />
        Connect Wallet
      </Button>
    );
  }

  return (
    <div className="flex gap-4">
      <Button variant="outline" onClick={handleDisconnect} className="gap-2">
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