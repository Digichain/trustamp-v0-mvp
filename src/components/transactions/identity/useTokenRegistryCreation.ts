import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { TokenRegistryDocument } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { ContractFactory, ethers } from "ethers";

// Contract ABIs and bytecode
const TitleEscrowCreatorABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"registry","type":"address"},{"internalType":"address","name":"beneficiary","type":"address"},{"internalType":"address","name":"holder","type":"address"},{"internalType":"string","name":"_tokenId","type":"string"}],"name":"deployNewTitleEscrow","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"nonpayable","type":"function"}];
const TitleEscrowCreatorBytecode = "0x608060405234801561001057600080fd5b50610a30806100206000396000f3fe608060405234801561001057600080fd5b506004361061002b5760003560e01c806382c9f71314610030575b600080fd5b61004a600480360381019061004591906102d9565b610060565b60405161005791906103a5565b60405180910390f35b600080868686866040516100749061023e565b610084959493929190610359565b604051809103906000f0801580156100a0573d6000803e3d6000fd5b509050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614156100e057600080fd5b9695505050505050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061011a826100ef565b9050919050565b61012a8161010f565b811461013557600080fd5b50565b60008135905061014781610121565b92915050565b600080fd5b600080fd5b600080fd5b60008083601f84011261017057600080fd5b8235905067ffffffffffffffff81111561018957600080fd5b6020830191508360018202830111156101a157600080fd5b9250929050565b6000806000806000606086880312156101c057600080fd5b60006101ce88828901610138565b95505060206101df88828901610138565b94505060406101f088828901610138565b935050606086013567ffffffffffffffff81111561020d57600080fd5b6102198882890161015a565b92509250509295509295909350565b61023181610110565b82525050565b6102408161010f565b82525050565b6107a2806103c383390190565b600060a0820190506102656000830188610228565b6102726020830187610228565b61027f6040830186610228565b818103606083015261029281858701610237565b905081810360808301526102a681848601610237565b90509695505050505050565b6000602082840312156102c557600080fd5b60006102d384828501610138565b91505092915050565b600080600080600060a086880312156102f157600080fd5b60006102ff88828901610138565b955050602061031088828901610138565b945050604061032188828901610138565b935050606086013567ffffffffffffffff81111561033e57600080fd5b61034a8882890161015a565b92509250509295509295909350565b600060a0820190506103706000830188610228565b61037d6020830187610228565b61038a6040830186610228565b818103606083015261039c81856102a0565b90509695505050505050565b60006020820190506103be6000830184610237565b9291505056fe608060405234801561001057600080fd5b50604051610a23380380610a238339818101604052810190610032919061016c565b836000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555082600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555081600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508060039081610100610121929190610133565b5050505050610293565b82805461013f90610201565b90600052602060002090601f01602090048101928261016157600085556101a8565b82601f1061017a57803560ff19168380011785556101a8565b828001600101855582156101a8579182015b828111156101a757823582559160200191906001019061018c565b5b5090506101b591906101b9565b5090565b5b808211156101d25760008160009055506001016101ba565b5090565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000610206826101db565b9050919050565b600061021882610206565b9050919050565b61022881610206565b811461023357600080fd5b50565b6000815190506102458161021f565b92915050565b600080fd5b600080fd5b600080fd5b60008083601f84011261026d57600080fd5b8235905067ffffffffffffffff81111561028657600080fd5b60208301915083600182028301111561029e57600080fd5b9250929050565b6000806000806000608085870312156102bd57600080fd5b60006102cb87828801610236565b94505060206102dc87828801610236565b93505060406102ed87828801610236565b925050606085013567ffffffffffffffff81111561030a57600080fd5b61031687828801610257565b95989497509550505050565b61078180610293565b82525050565b600060a0820190506103426000830188610228565b61034f6020830187610228565b61035c6040830186610228565b818103606083015261036e81856102a0565b905081810360808301526103828184610237565b90509695505050505050565b6000819050919050565b61039f8161038c565b82525050565b60006020820190506103ba6000830184610396565b92915050565b600082825260208201905092915050565b7f546974";

const TitleEscrowFactoryABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"registry","type":"address"},{"internalType":"address","name":"beneficiary","type":"address"},{"internalType":"address","name":"holder","type":"address"},{"internalType":"string","name":"_tokenId","type":"string"}],"name":"deployNewTitleEscrow","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"nonpayable","type":"function"}];
const TitleEscrowFactoryBytecode = "0x608060405234801561001057600080fd5b50610a30806100206000396000f3fe608060405234801561001057600080fd5b506004361061002b5760003560e01c806382c9f71314610030575b600080fd5b61004a600480360381019061004591906102d9565b610060565b60405161005791906103a5565b60405180910390f35b600080868686866040516100749061023e565b610084959493929190610359565b604051809103906000f0801580156100a0573d6000803e3d6000fd5b509050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614156100e057600080fd5b9695505050505050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061011a826100ef565b9050919050565b61012a8161010f565b811461013557600080fd5b50565b60008135905061014781610121565b92915050565b600080fd5b600080fd5b600080fd5b60008083601f84011261017057600080fd5b8235905067ffffffffffffffff81111561018957600080fd5b6020830191508360018202830111156101a157600080fd5b9250929050565b6000806000806000606086880312156101c057600080fd5b60006101ce88828901610138565b95505060206101df88828901610138565b94505060406101f088828901610138565b935050606086013567ffffffffffffffff81111561020d57600080fd5b6102198882890161015a565b92509250509295509295909350565b61023181610110565b82525050565b6102408161010f565b82525050565b6107a2806103c383390190565b600060a0820190506102656000830188610228565b6102726020830187610228565b61027f6040830186610228565b818103606083015261029281858701610237565b905081810360808301526102a681848601610237565b90509695505050505050565b6000602082840312156102c557600080fd5b60006102d384828501610138565b91505092915050565b600080600080600060a086880312156102f157600080fd5b60006102ff88828901610138565b955050602061031088828901610138565b945050604061032188828901610138565b935050606086013567ffffffffffffffff81111561033e57600080fd5b61034a8882890161015a565b92509250509295509295909350565b600060a0820190506103706000830188610228565b61037d6020830187610228565b61038a6040830186610228565b818103606083015261039c81856102a0565b90509695505050505050565b60006020820190506103be6000830184610237565b9291505056fe608060405234801561001057600080fd5b50604051610a23380380610a238339818101604052810190610032919061016c565b836000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555082600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555081600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508060039081610100610121929190610133565b5050505050610293565b82805461013f90610201565b90600052602060002090601f01602090048101928261016157600085556101a8565b82601f1061017a57803560ff19168380011785556101a8565b828001600101855582156101a8579182015b828111156101a757823582559160200191906001019061018c565b5b5090506101b591906101b9565b5090565b5b808211156101d25760008160009055506001016101ba565b5090565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000610206826101db565b9050919050565b600061021882610206565b9050919050565b61022881610206565b811461023357600080fd5b50565b6000815190506102458161021f565b92915050565b600080fd5b600080fd5b600080fd5b60008083601f84011261026d57600080fd5b8235905067ffffffffffffffff81111561028657600080fd5b60208301915083600182028301111561029e57600080fd5b9250929050565b6000806000806000608085870312156102bd57600080fd5b60006102cb87828801610236565b94505060206102dc87828801610236565b93505060406102ed87828801610236565b925050606085013567ffffffffffffffff81111561030a57600080fd5b61031687828801610257565b95989497509550505050565b61078180610293565b82525050565b600060a0820190506103426000830188610228565b61034f6020830187610228565b61035c6040830186610228565b818103606083015261036e81856102a0565b905081810360808301526103828184610237565b90509695505050505050565b6000819050919050565b61039f8161038c565b82525050565b60006020820190506103ba6000830184610396565b92915050565b600082825260208201905092915050565b7f546974";

const TokenRegistryABI = [{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_symbol","type":"string"},{"internalType":"address","name":"_titleEscrowCreator","type":"address"},{"internalType":"address","name":"_titleEscrowFactory","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"previousAdminRole","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"newAdminRole","type":"bytes32"}],"name":"RoleAdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleGranted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleRevoked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"DEFAULT_ADMIN_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MINTER_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleAdmin","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"grantRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"hasRole","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"beneficiary","type":"address"},{"internalType":"address","name":"holder","type":"address"},{"internalType":"string","name":"tokenId","type":"string"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"renounceRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"revokeRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"titleEscrowCreator","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"titleEscrowFactory","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"}];
const TokenRegistryBytecode = "0x60806040523480156200001157600080fd5b5060405162001c9838038062001c988339818101604052810190620000379190620002c4565b838381600090816200004a9190620005e6565b5080600190816200005c9190620005e6565b5050506200007f6200007360201b60201c565b6200008a816200009260201b60201c565b50505050620007cc565b6000801b81565b6200009e8162000122565b620000e0576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620000d79062000702565b60405180910390fd5b80600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b60008073ffffffffffffffffffffffffffffffffffffffff16600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415905090565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b620001d18262000186565b810181811067ffffffffffffffff82111715620001f357620001f262000197565b5b80604052505050565b60006200020862000168565b9050620002168282620001c6565b919050565b600067ffffffffffffffff8211156200023957620002386200019756";

export const useTokenRegistryCreation = () => {
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
      const adjustedGasPrice = gasPrice.mul(120).div(100); // 20% increase
      console.log('Using adjusted gas price:', adjustedGasPrice.toString());

      // Lower gas limit for initial deployments
      const initialGasLimit = 3000000;

      // Deploy TitleEscrowCreator
      console.log('Deploying TitleEscrowCreator...');
      const titleEscrowCreatorFactory = new ContractFactory(
        TitleEscrowCreatorABI,
        TitleEscrowCreatorBytecode,
        signer
      );
      const titleEscrowCreator = await titleEscrowCreatorFactory.deploy({
        gasLimit: initialGasLimit,
        gasPrice: adjustedGasPrice
      });
      await titleEscrowCreator.deployed();
      console.log('TitleEscrowCreator deployed at:', titleEscrowCreator.address);

      // Deploy TitleEscrowFactory
      console.log('Deploying TitleEscrowFactory...');
      const titleEscrowFactoryFactory = new ContractFactory(
        TitleEscrowFactoryABI,
        TitleEscrowFactoryBytecode,
        signer
      );
      const titleEscrowFactory = await titleEscrowFactoryFactory.deploy({
        gasLimit: initialGasLimit,
        gasPrice: adjustedGasPrice
      });
      await titleEscrowFactory.deployed();
      console.log('TitleEscrowFactory deployed at:', titleEscrowFactory.address);

      // Deploy TokenRegistry with increased gas limit
      console.log('Deploying TokenRegistry...');
      const tokenRegistryFactory = new ContractFactory(
        TokenRegistryABI,
        TokenRegistryBytecode,
        signer
      );

      // Increase gas limit for TokenRegistry deployment
      const tokenRegistryGasLimit = 4000000;
      
      const tokenRegistry = await tokenRegistryFactory.deploy(
        name,
        symbol,
        titleEscrowCreator.address,
        titleEscrowFactory.address,
        {
          gasLimit: tokenRegistryGasLimit,
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