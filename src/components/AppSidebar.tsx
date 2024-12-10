import { useLocation, Link } from "react-router-dom";
import { User, ListCheck, CreditCard, CheckCircle, XCircle } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from 'react';

const menuItems = [
  {
    title: "Account",
    url: "/account",
    icon: User,
  },
  {
    title: "Transactions",
    url: "/transactions",
    icon: ListCheck,
  },
  {
    title: "Payments",
    url: "/payments",
    icon: CreditCard,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [network, setNetwork] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    checkWalletConnection();
    if ((window as any).ethereum) {
      (window as any).ethereum.on('accountsChanged', handleAccountsChanged);
      (window as any).ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if ((window as any).ethereum) {
        (window as any).ethereum.removeListener('accountsChanged', handleAccountsChanged);
        (window as any).ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const checkWalletConnection = async () => {
    try {
      const { ethereum } = window as any;
      if (ethereum) {
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setIsConnected(true);
          const chainId = await ethereum.request({ method: 'eth_chainId' });
          handleChainChanged(chainId);
        }
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length > 0) {
      setWalletAddress(accounts[0]);
      setIsConnected(true);
    } else {
      setWalletAddress(null);
      setIsConnected(false);
    }
  };

  const handleChainChanged = (chainId: string) => {
    const networks: { [key: string]: string } = {
      '0x1': 'Ethereum Mainnet',
      '0x5': 'Goerli Testnet',
      '0xaa36a7': 'Sepolia Testnet',
      '0x89': 'Polygon Mainnet',
      '0x13881': 'Mumbai Testnet',
      '0xa': 'Optimism Mainnet',
      '0x1a4': 'Optimism Goerli',
      '0xa4b1': 'Arbitrum One',
      '0x66eed': 'Arbitrum Goerli'
    };
    setNetwork(networks[chainId] || `Unknown Network (${chainId})`);
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window as any;
      if (ethereum) {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        handleAccountsChanged(accounts);
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setIsConnected(false);
    setNetwork('');
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-border">
        <div className="p-4">
          {isConnected && walletAddress ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-green-500 font-medium">Connected</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={disconnectWallet}
                  className="h-6 w-6 transition-colors hover:bg-transparent group"
                >
                  <XCircle className="h-4 w-4 text-muted-foreground group-hover:text-destructive" />
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                {truncateAddress(walletAddress)}
              </div>
              <div className="text-xs text-muted-foreground">
                {network}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <XCircle className="h-4 w-4 text-destructive" />
                <span className="text-destructive font-medium">Disconnected</span>
              </div>
              <Button 
                onClick={connectWallet} 
                variant="outline" 
                size="sm" 
                className="w-full"
              >
                Connect Wallet
              </Button>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link 
                      to={item.url}
                      className={location.pathname === item.url ? "text-primary" : ""}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}