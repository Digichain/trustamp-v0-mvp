import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { DocumentTypeSelector } from "./DocumentTypeSelector";
import { useToast } from "@/components/ui/use-toast";

export const CreateTransactionDialog = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedSubType, setSelectedSubType] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkWalletConnection();
    
    const { ethereum } = window as any;
    if (ethereum) {
      ethereum.on('accountsChanged', handleAccountsChanged);
      ethereum.on('disconnect', handleDisconnect);
      ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (ethereum) {
        ethereum.removeListener('accountsChanged', handleAccountsChanged);
        ethereum.removeListener('disconnect', handleDisconnect);
        ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const handleChainChanged = () => {
    console.log('Chain changed, checking wallet connection');
    checkWalletConnection();
  };

  const handleDisconnect = () => {
    console.log('Wallet disconnected in CreateTransactionDialog');
    setIsWalletConnected(false);
    setOpen(false);
  };

  const handleAccountsChanged = async (accounts: string[]) => {
    console.log('Accounts changed in CreateTransactionDialog:', accounts);
    const isConnected = accounts.length > 0;
    console.log('Wallet connected status:', isConnected);
    setIsWalletConnected(isConnected);
    if (!isConnected) {
      setOpen(false);
    }
  };

  const checkWalletConnection = async () => {
    try {
      const { ethereum } = window as any;
      if (!ethereum) {
        console.log('MetaMask not detected in CreateTransactionDialog');
        setIsWalletConnected(false);
        setOpen(false);
        return;
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });
      const isConnected = accounts.length > 0;
      console.log('CreateTransactionDialog - Wallet connection check:', isConnected);
      setIsWalletConnected(isConnected);
      
      if (!isConnected) {
        setOpen(false);
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
      setIsWalletConnected(false);
      setOpen(false);
    }
  };

  const handleButtonClick = () => {
    if (!isWalletConnected) {
      toast({
        title: "Wallet Connection Required",
        description: "Please connect your wallet to perform this action",
        variant: "destructive",
      });
      return;
    }
    setOpen(true);
  };

  const handleCreate = () => {
    if (!isWalletConnected) {
      setOpen(false);
      return;
    }
    
    console.log("Creating transaction:", { selectedType, selectedSubType });
    setOpen(false);
    
    if (selectedSubType === "verifiable") {
      navigate("/transactions/create");
    } else if (selectedSubType === "transferable") {
      navigate("/transactions/create-transferable");
    }
    
    setSelectedType("");
    setSelectedSubType("");
  };

  const handleCancel = () => {
    setOpen(false);
    setSelectedType("");
    setSelectedSubType("");
  };

  return (
    <>
      <Button 
        onClick={handleButtonClick}
        disabled={!isWalletConnected}
        className={!isWalletConnected ? "opacity-50" : ""}
      >
        <PlusCircle className="mr-2" />
        Create new Transaction
      </Button>
      
      {isWalletConnected && (
        <Dialog 
          open={open} 
          onOpenChange={(newOpen) => {
            if (!isWalletConnected) {
              setOpen(false);
              return;
            }
            setOpen(newOpen);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Select type of transaction</DialogTitle>
              <DialogDescription>
                Choose the type of transaction you want to create
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <DocumentTypeSelector
                selectedType={selectedType}
                selectedSubType={selectedSubType}
                onTypeChange={setSelectedType}
                onSubTypeChange={setSelectedSubType}
              />

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button
                  onClick={handleCreate}
                  disabled={!selectedType || !selectedSubType}
                >
                  Create
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};