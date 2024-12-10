import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from "@/components/ui/use-toast";

interface WalletContextType {
  isWalletConnected: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  walletAddress: string | null;
  network: string;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [network, setNetwork] = useState<string>('');
  const { toast } = useToast();

  console.log("WalletProvider - Initial render with state:", { isWalletConnected, walletAddress, network });

  useEffect(() => {
    console.log("WalletProvider - Running initial wallet check");
    checkWalletConnection();
    
    const { ethereum } = window as any;
    if (ethereum) {
      ethereum.on('accountsChanged', handleAccountsChanged);
      ethereum.on('chainChanged', handleChainChanged);
      ethereum.on('disconnect', handleDisconnect);
    }

    return () => {
      if (ethereum) {
        ethereum.removeListener('accountsChanged', handleAccountsChanged);
        ethereum.removeListener('chainChanged', handleChainChanged);
        ethereum.removeListener('disconnect', handleDisconnect);
      }
    };
  }, []);

  const checkWalletConnection = async () => {
    try {
      const { ethereum } = window as any;
      if (!ethereum) {
        console.log('WalletProvider - MetaMask not detected');
        setIsWalletConnected(false);
        return;
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });
      const isConnected = accounts.length > 0;
      console.log('WalletProvider - Wallet connection check:', { isConnected, accounts });
      
      setIsWalletConnected(isConnected);
      
      if (isConnected) {
        setWalletAddress(accounts[0]);
        const chainId = await ethereum.request({ method: 'eth_chainId' });
        handleChainChanged(chainId);
      }
    } catch (error) {
      console.error('WalletProvider - Error checking wallet connection:', error);
      setIsWalletConnected(false);
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    console.log('WalletProvider - Accounts changed:', accounts);
    const isConnected = accounts.length > 0;
    setIsWalletConnected(isConnected);
    setWalletAddress(isConnected ? accounts[0] : null);
    
    if (!isConnected) {
      setNetwork('');
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected",
        variant: "destructive",
      });
    }
  };

  const handleChainChanged = (chainId: string) => {
    console.log('WalletProvider - Chain changed to:', chainId);
    const networks: { [key: string]: string } = {
      '0x1': 'Ethereum Mainnet',
      '0x5': 'Goerli Testnet',
      '0xaa36a7': 'Sepolia Testnet',
      '0x89': 'Polygon Mainnet',
      '0x13881': 'Mumbai Testnet',
    };
    const newNetwork = networks[chainId] || `Unknown Network (${chainId})`;
    setNetwork(newNetwork);
    
    toast({
      title: "Network Changed",
      description: `Connected to ${newNetwork}`,
    });
  };

  const handleDisconnect = () => {
    console.log('WalletProvider - Wallet disconnected');
    setIsWalletConnected(false);
    setWalletAddress(null);
    setNetwork('');
  };

  const connectWallet = async () => {
    try {
      console.log('WalletProvider - Attempting to connect wallet');
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
      console.log('WalletProvider - Connected account:', accounts[0]);
      setWalletAddress(accounts[0]);
      setIsWalletConnected(true);
      
      const chainId = await ethereum.request({ method: 'eth_chainId' });
      handleChainChanged(chainId);

      toast({
        title: "Wallet Connected",
        description: "Successfully connected to MetaMask",
      });
    } catch (error) {
      console.error('WalletProvider - Error connecting wallet:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to MetaMask",
        variant: "destructive",
      });
    }
  };

  const disconnectWallet = () => {
    console.log('WalletProvider - Manually disconnecting wallet');
    handleDisconnect();
    toast({
      title: "Wallet Disconnected",
      description: "Successfully disconnected from MetaMask",
    });
  };

  const value = {
    isWalletConnected,
    connectWallet,
    disconnectWallet,
    walletAddress,
    network
  };

  console.log("WalletProvider - Rendering with context value:", value);

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}