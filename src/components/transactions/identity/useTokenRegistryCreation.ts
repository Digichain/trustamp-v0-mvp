import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { TokenRegistryDocument } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { ContractFactory, ethers } from "ethers";
import TokenRegistryArtifact from '../../../contracts/TokenRegistry.sol';

// OpenAttestation TokenRegistry ABI - simplified to core ERC721 functions
const TokenRegistryABI = [
  "constructor(string memory _name, string memory _symbol)",
  "function name() public view returns (string memory)",
  "function symbol() public view returns (string memory)",
  "function mint(address to, uint256 tokenId) public",
  "function ownerOf(uint256 tokenId) public view returns (address)",
  "function transferFrom(address from, address to, uint256 tokenId) public"
];

export const useTokenRegistryCreation = (onRegistryCreated: (doc: TokenRegistryDocument) => void) => {
  const [isCreating, setIsCreating] = useState(false);
  const [registryDocument, setRegistryDocument] = useState<TokenRegistryDocument | null>(null);
  const { toast } = useToast();

  const createTokenRegistry = async (walletAddress: string, name: string, symbol: string) => {
    setIsCreating(true);
    try {
      console.log('Creating Token Registry with params:', { walletAddress, name, symbol });

      const { ethereum } = window as any;
      if (!ethereum) throw new Error('MetaMask not found');
      
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();

      // Create contract factory with the compiled contract
      const factory = new ContractFactory(
        TokenRegistryABI,
        TokenRegistryArtifact.bytecode,
        signer
      );

      // Deploy contract and let MetaMask handle gas estimation
      console.log('Deploying TokenRegistry...');
      const tokenRegistry = await factory.deploy(name, symbol);
      
      // Wait for deployment
      const deployedContract = await tokenRegistry.deployed();
      console.log('TokenRegistry deployed at:', deployedContract.address);

      // Create DNS record via Supabase
      const { data, error } = await supabase.functions.invoke('oa-dns-records', {
        body: {
          contractAddress: deployedContract.address,
          action: 'create',
          type: 'token-registry'
        }
      });

      if (error) throw error;
      if (!data?.data?.dnsLocation) throw new Error('DNS location not returned from API');

      // Construct new registry document
      const newRegistryDocument: TokenRegistryDocument = {
        contractAddress: deployedContract.address,
        name,
        symbol,
        dnsLocation: data.data.dnsLocation
      };

      setRegistryDocument(newRegistryDocument);
      onRegistryCreated(newRegistryDocument);

      toast({
        title: "Token Registry Created",
        description: "Your token registry has been deployed successfully."
      });
    } catch (error: any) {
      console.error('Error creating token registry:', error);
      toast({
        title: "Error",
        description: `There was an issue creating the token registry: ${error.message}`,
        variant: "destructive"
      });
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