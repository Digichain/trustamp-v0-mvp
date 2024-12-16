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

// OpenAttestation TokenRegistry Bytecode
const TokenRegistryBytecode = "0x60806040523480156200001157600080fd5b506040516200156838038062001568833981016040819052620000349162000146565b8151829082906200004990600090602085019062000075565b5080516200005f90600190602084019062000075565b505050506200023f565b828054620000839062000202565b90600052602060002090601f016020900481019282620000a75760008555620000f2565b82601f10620000c257805160ff1916838001178555620000f2565b82800160010185558215620000f2579182015b82811115620000f2578251825591602001919060010190620000d5565b506200010092915062000104565b5090565b5b8082111562000100576000815560010162000105565b634e487b7160e01b600052604160045260246000fd5b600080604083850312156200015a57600080fd5b82516001600160401b03808211156200017257600080fd5b818501915085601f8301126200018757600080fd5b815181811115620001a057620001a06200011b565b604051601f8201601f19908116603f01168101908382118183101715620001cb57620001cb6200011b565b816040528281528860208487010111156200014557600080fd5b620001e8836020830160208801620001ce565b80955050505050620001fd60208401620001ce565b90509250929050565b600181811c908216806200021757607f821691505b602082108114156200023957634e487b7160e01b600052602260045260246000fd5b50919050565b611319806200024f6000396000f3fe608060405234801561001057600080fd5b50600436106100cf5760003560e01c80636352211e1161008c578063a22cb46511610066578063a22cb465146101b3578063b88d4fde146101c6578063c87b56dd146101d9578063e985e9c5146101ec57600080fd5b80636352211e1461017757806370a082311461018a57806395d89b41146101ab57600080fd5b806301ffc9a7146100d457806306fdde03146100fc578063081812fc14610111578063095ea7b31461013c57806323b872dd1461015157806342842e0e14610164575b600080fd5b6100e76100e2366004610e9d565b610228565b60405190151581526020015b60405180910390f35b61010461027a565b6040516100f39190610f12565b61012461011f366004610f25565b61030c565b6040516001600160a01b0390911681526020016100f3565b61014f61014a366004610f5f565b61038d565b005b61014f61015f366004610f89565b6104a7565b61014f610172366004610f89565b6104d8565b610124610185366004610f25565b6104f3565b61019d610198366004610fc5565b610553565b6040519081526020016100f3565b6101046105d9565b61014f6101c1366004610fe0565b6105e8565b61014f6101d436600461109c565b6105f7565b6101046101e7366004610f25565b61062f565b6100e76101fa366004611178565b6001600160a01b03918216600090815260056020908152604080832093909416825291909152205460ff1690565b60006001600160e01b031982166380ac58cd60e01b148061025957506001600160e01b03198216635b5e139f60e01b145b8061027457506301ffc9a760e01b6001600160e01b03198316145b92915050565b606060008054610289906111ab565b80601f01602080910402602001604051908101604052809291908181526020018280546102b5906111ab565b80156103025780601f106102d757610100808354040283529160200191610302565b820191906000526020600020905b8154815290600101906020018083116102e557829003601f168201915b5050505050905090565b6000818152600260205260408120546001600160a01b031661038757604051637e27328960e01b815260048101849052602401602060405180830381865afa158015610359573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061037d9190611205565b610387906106e6565b919050565b6000818152600260205260409020546001600160a01b03163381146104025760405162461bcd60e51b815260206004820152602160248201527f4552433732313a207472616e73666572206f6620746f6b656e20746861742069604482015260203760f91b60648201526084015b60405180910390fd5b6001600160a01b03821661046457604051630a85bd0160e11b81526001600160a01b0383166004820152602481018390526044810182905260806064820152600060848201526040516104016020820181815290820183905260e0016040516020818303038152906040528051906020012060001c60001b6106e6565b6001600160a01b038216600081815260056020908152604080832033845282528083208054600160ff199091168117909155600284528285208054868652938452828520805473ffffffffffffffffffffffffffffffffffffffff19908116909417905584845291905290829055915490517f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92591610124918590611222565b6104b13382610766565b6104cc5760405162461bcd60e51b815260040161040190611239565b6104d383836107e5565b505050565b6104d383838360405180602001604052806000815250610597565b6000818152600260205260408120546001600160a01b03168061054d57604051637e27328960e01b815260048101849052602401602060405180830381865afa15801561054357d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061037d9190611205565b61027481610964565b60006001600160a01b0382166105be5760405162461bcd60e51b815260206004820152602960248201527f4552433732313a2061646472657373207a65726f206973206e6f7420612076616044820152683634b21037bbb732b960b91b6064820152608401610401565b506001600160a01b031660009081526003602052604090205490565b606060018054610289906111ab565b6105f33383836109c8565b5050565b610602338561076656565b61061e5760405162461bcd60e51b815260040161040190611239565b61062a8585858585610a87565b5050505050565b6000818152600260205260409020546060906001600160a01b031661069757604051630a85bd0160e11b81526001600160a01b0383166004820152602481018390526044810182905260806064820152600060848201526040516104016020820181815290820183905260e0016040516020818303038152906040528051906020012060001c60001b6106e6565b6106a082610aba565b6106e157604051630a85bd0160e11b81526001600160a01b0383166004820152602481018390526044810182905260806064820152600060848201526040516104016020820181815290820183905260e0016040516020818303038152906040528051906020012060001c60001b6106e6565b919050565b6000610751826040518060400160405280600681526020016505355332d3160d41b815250604051602401610718919061128e565b60408051601f198184030181529190526020810180516001600160e01b031663104c13eb60e21b179052610acf565b805190915015610763578051610763906106e6565b50565b6000818152600260205260408120546001600160a01b03166107db5760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a206f70657261746f7220717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b6064820152608401610401565b61027482610b0c565b6001600160a01b03821661083b5760405162461bcd60e51b815260206004820181905260248201527f4552433732313a206d696e7420746f20746865207a65726f20616464726573736044820152606401610401565b6000818152600260205260409020546001600160a01b0316156108a05760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e746564000000006044820152606401610401565b6001600160a01b038216600081815260036020908152604080832080546001019055848352600290915280822080547fffffffffffffffffffffffff0000000000000000000000000000000000000000001684179055518392917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4610763816106e6565b6000818152600260205260409020546001600160a01b03166107635760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a20617070726f76656420717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b6064820152608401610401565b816001600160a01b0316836001600160a01b03161415610a2a5760405162461bcd60e51b815260206004820152601960248201527f4552433732313a20617070726f766520746f2063616c6c6572000000000000006044820152606401610401565b6001600160a01b03838116600081815260056020908152604080832094871680845294825291829020805460ff191686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a3505050565b610a928585856104a7565b610a9e85858585610b6c565b61062a5760405162461bcd60e51b8152600401610401906112a1565b6000610ac582610c6d565b8015610274575050600090815260046020526040902054151590565b6000610b0583604051602401610ae5919061128e565b60408051601f198184030181529190526020810180516001600160e01b031663104c13eb60e21b17905261076656565b9392505050565b60006001600160a01b038216610b665760405162461bcd60e51b815260206004820152602960248201527f4552433732313a2061646472657373207a65726f206973206e6f7420612076616044820152683634b21037bbb732b960b91b6064820152608401610401565b5060008181526004602052604090205473ffffffffffffffffffffffffffffffffffffffff1690565b60006001600160a01b0384163b15610c6257604051630a85bd0160e11b81526001600160a01b0385811660048301526024820185905283811660448301526064820184905260a06084820152600060a4820152604051610bcf9060208201608081016040526000815281602001604051602081830303815290604052805190602001206000191660001b610acf565b805190915015610c5757508073ffffffffffffffffffffffffffffffffffffffff16636745782b60e01b6001600160a01b0386811660048301526024820186905284811660448301528381166064830152608482015260a401600060405180830381600087803b158015610c3e57600080fd5b505af1158015610c52573d6000803e3d6000fd5b505050505b506001949350505050565b506000949350505050565b6000818152600260205260409020546001600160a01b0316610763576040516308c379a000000000000000000000000000000000000000000000000000000000815260206004820152602960248201527f455243373231456e756d657261626c653a206f776e657220696e646578206f7560448201526808195e1c1958d95959609a1b6064820152608401610401565b80356001600160a01b038116811461038757600080fd5b600060208284031215610eb057600080fd5b81356001600160e01b031981168114610b0557600080fd5b60005b83811015610ee5578181015183820152602001610ecd565b50506000910152565b60008151808452610f06816020860160208601610eca565b601f01601f19169290920160200192915050565b60208152600061027460208301846108ee565b600060208284031215610f3757600080fd5b5035919050565b80356001600160a01b038116811461038757600080fd5b60008060408385031215610f7257600080fd5b610f7b83610f3e565b946020939093013593505050565b600080600060608486031215610f9e57600080fd5b610fa784610f3e565b9250610fb560208501610f3e565b9150604084013590509250925092565b600060208284031215610fd757600080fd5b610b0582610f3e565b60008060408385031215610ff357600080fd5b610ffc83610f3e565b91506020830135801515811461101157600080fd5b809150509250929050565b634e487b7160e01b600052604160045260246000fd5b60008083601f84011261104457600080fd5b50813567ffffffffffffffff81111561105c57600080fd5b60208301915083602082850101111561107457600080fd5b9250929050565b60008060008060008060a087890312156110935600a165627a7a72305820d6157f66b198c680ee98d3a03c1079b66ff2d342cd3e9c73cd0c2eb3e2ca77700029";

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

      // Create contract factory
      const factory = new ContractFactory(TokenRegistryABI, TokenRegistryBytecode, signer);

      // Estimate deployment gas
      console.log('Estimating gas for deployment...');
      const deploymentGas = await factory.signer.estimateGas(
        factory.getDeployTransaction(name, symbol)
      );

      // Add 20% buffer to gas estimate
      const gasLimit = deploymentGas.mul(120).div(100);
      console.log('Estimated gas with buffer:', gasLimit.toString());

      // Get current gas price
      const gasPrice = await provider.getGasPrice();
      const adjustedGasPrice = gasPrice.mul(120).div(100);
      console.log('Using adjusted gas price:', adjustedGasPrice.toString());

      // Deploy with estimated gas and price
      console.log('Deploying TokenRegistry...');
      const tokenRegistry = await factory.deploy(name, symbol, {
        gasLimit,
        gasPrice: adjustedGasPrice
      });
      
      console.log('Waiting for TokenRegistry deployment transaction...');
      const deployedContract = await tokenRegistry.deployed();
      console.log('TokenRegistry deployed at:', deployedContract.address);

      // Create DNS record through Edge Function
      const { data, error } = await supabase.functions.invoke('oa-dns-records', {
        body: { 
          contractAddress: deployedContract.address,
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
        contractAddress: deployedContract.address,
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