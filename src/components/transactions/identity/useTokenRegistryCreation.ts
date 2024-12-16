import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { TokenRegistryDocument } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { ContractFactory, ethers } from "ethers";

const TokenRegistryABI = [{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_symbol","type":"string"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"}];

const TokenRegistryBytecode = "0x60806040523480156200001157600080fd5b5060405162001a3838038062001a388339818101604052810190620000379190620002c4565b8282816000908162000049919062000586565b508060019081620000005b919062000586565b505050620007cc565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b620000d18262000086565b810181811067ffffffffffffffff82111715620000f357620000f262000097565b5b80604052505050565b60006200010862000068565b90506200011682826200000c6565b919050565b600067ffffffffffffffff8211156200013957620001386200009756";

export const useTokenRegistryCreation = (onRegistryCreated: (doc: TokenRegistryDocument) => void) => {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [registryDocument, setRegistryDocument] = useState<TokenRegistryDocument | null>(null);

  const createTokenRegistry = async (walletAddress: string, name: string, symbol: string) => {
    setIsCreating(true);
    try {
      console.log('Creating Token Registry with params:', { walletAddress, name, symbol });
      
      const { ethereum } = window as any;
      if (!ethereum) throw new Error('MetaMask not found');
      
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();

      // Get current gas price and add 20% buffer
      const gasPrice = await provider.getGasPrice();
      const adjustedGasPrice = gasPrice.mul(120).div(100);
      console.log('Using adjusted gas price:', adjustedGasPrice.toString());

      // Deploy TokenRegistry with optimized gas settings
      console.log('Deploying TokenRegistry...');
      const tokenRegistryFactory = new ContractFactory(
        TokenRegistryABI,
        TokenRegistryBytecode,
        signer
      );
      
      const tokenRegistry = await tokenRegistryFactory.deploy(
        name,
        symbol,
        {
          gasLimit: 4000000,
          gasPrice: adjustedGasPrice
        }
      );
      
      console.log('Waiting for TokenRegistry deployment transaction...');
      await tokenRegistry.deployed();
      console.log('TokenRegistry deployed at:', tokenRegistry.address);

      // Create DNS record through Edge Function
      const { data, error } = await supabase.functions.invoke('oa-dns-records', {
        body: { 
          contractAddress: tokenRegistry.address,
          action: 'create',
          type: 'token-registry'
        }
      });

      if (error) {
        console.error('Error from Edge Function:', error);
        throw error;
      }

      if (!data?.data?.dnsLocation) {
        throw new Error('DNS location not returned from API');
      }

      console.log('DNS Record creation response:', data);

      const newRegistryDocument: TokenRegistryDocument = {
        contractAddress: tokenRegistry.address,
        name,
        symbol,
        dnsLocation: data.data.dnsLocation
      };

      console.log('Created Token Registry Document:', newRegistryDocument);
      
      setRegistryDocument(newRegistryDocument);
      onRegistryCreated(newRegistryDocument);
      
      toast({
        title: "Token Registry Created",
        description: "Your token registry has been deployed successfully.",
      });

      return newRegistryDocument;

    } catch (error: any) {
      console.error('Error creating Token Registry:', error);
      
      toast({
        title: "Error Creating Token Registry",
        description: error.message || "Failed to create token registry",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    isCreating,
    registryDocument,
    createTokenRegistry
  };
};