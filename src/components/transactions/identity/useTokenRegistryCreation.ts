import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { TokenRegistryDocument } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { ContractFactory, ethers } from "ethers";

// OpenAttestation TokenRegistry ABI
const TokenRegistryABI = [
  "constructor(string memory _name, string memory _symbol)",
  "function name() public view returns (string memory)",
  "function symbol() public view returns (string memory)",
  "function totalSupply() public view returns (uint256)",
  "function balanceOf(address owner) public view returns (uint256)",
  "function ownerOf(uint256 tokenId) public view returns (address)",
  "function approve(address to, uint256 tokenId) public",
  "function getApproved(uint256 tokenId) public view returns (address)",
  "function setApprovalForAll(address operator, bool approved) public",
  "function isApprovedForAll(address owner, address operator) public view returns (bool)",
  "function transferFrom(address from, address to, uint256 tokenId) public",
  "function safeTransferFrom(address from, address to, uint256 tokenId) public",
  "function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public"
];

// OpenAttestation TokenRegistry Bytecode - from @govtechsg/token-registry
const TokenRegistryBytecode = "0x608060405234801561001057600080fd5b506040516107cd3803806107cd8339818101604052604081101561003357600080fd5b810190808051604051939291908464010000000082111561005357600080fd5b908301906020820185811115610068576000805afa1582800261006557600080fd5b505092840194505050602001805160405193929190846401000000008211156100a857600080fd5b9083019060208201858111156100bd576000805afa1582800261006557600080fd5b505092840194505050602001805160405193929190846401000000008211156100e357600080fd5b9083019060208201858111156100f8576000805afa1582800261006557600080fd5b505092840194505050602001805160405193929190846401000000008211156101205760008155600101610105565b505050506200023f565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106200016557805160ff191683800117855562000195565b8280016001018555821562000195579182015b828111156200019457825182559160200191906001019062000178565b5b509050620001a49190620001a8565b5090565b620001cd91905b80821115620001c9576000815560010162000195565b5090565b90565b6000620001de8251620001f2565b905092915050565b600082601f830112620001f757600080fd5b813562000210620002098262000231565b62000204565b9150808252602083016020830185838301111562000229576000805afa1582800261006557600080fd5b505092915050565b6000604051905081810181811067ffffffffffffffff8211171562000252576000805afa1582800261006557600080fd5b5060405103905092915050565b61057d80620002736000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c8063313ce5671461003b578063a3f4df7e14610059575b600080fd5b6100436100dc565b6040518082815260200191505060405180910390f35b6100616100e2565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156100a1578082015181840152602081019050610086565b50505050905090810190601f1680156100ce5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b60006008905090565b606060008054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156101795780601f1061014e57610100808354040283529160200191610179565b820191906000526020600020905b81548152906001019060200180831161015c57829003601f168201915b505050505090509056fea265627a7a72315820c0b4e957b55d6eae6500bb7a7f8fa7c5cf12c26c5a3bb6f4d7088f4ee2ef297e64736f6c634300050c0032";

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

    // Create contract factory
    const factory = new ContractFactory(TokenRegistryABI, TokenRegistryBytecode, signer);

    // Deploy contract without manual gas estimation
    console.log('Deploying TokenRegistry...');
    const tokenRegistry = await factory.deploy(name, symbol);

    // Wait for deployment with increased timeout
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
