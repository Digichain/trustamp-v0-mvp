import { ethers } from 'ethers';
import TokenRegistryArtifact from '@/contracts/TokenRegistry';

export const useTokenRegistry = () => {
  const initializeContract = async (
    address: string,
    signer: ethers.Signer
  ): Promise<ethers.Contract> => {
    console.log("Initializing token registry contract at address:", address);
    return new ethers.Contract(address, TokenRegistryArtifact.abi, signer);
  };

  const checkTokenExists = async (
    contract: ethers.Contract,
    tokenId: ethers.BigNumber
  ): Promise<boolean> => {
    try {
      const owner = await contract.ownerOf(tokenId);
      console.log("Token already exists, owned by:", owner);
      return true;
    } catch (error: any) {
      if (!error.message.includes("owner query for nonexistent token")) {
        throw error;
      }
      console.log("Token does not exist yet");
      return false;
    }
  };

  const mintToken = async (
    contract: ethers.Contract,
    to: string,
    tokenId: ethers.BigNumber
  ): Promise<ethers.ContractReceipt> => {
    console.log("Attempting to mint token...");
    console.log("To address:", to);
    console.log("Token ID:", tokenId.toString());
    
    try {
      const tx = await contract.safeMint(to, tokenId, {
        gasLimit: 500000
      });
      console.log("Mint transaction submitted:", tx.hash);
      
      const receipt = await tx.wait(2); // Wait for 2 block confirmations
      console.log("Transaction confirmed:", receipt);
      return receipt;
    } catch (error: any) {
      console.error("Error in mint transaction:", error);
      if (error.message.includes("execution reverted")) {
        throw new Error("Token minting failed - contract execution reverted. Please check your wallet has sufficient funds and try again.");
      }
      throw error;
    }
  };

  const verifyTokenOwnership = async (
    contract: ethers.Contract,
    tokenId: ethers.BigNumber,
    expectedOwner: string,
    maxRetries = 3
  ): Promise<void> => {
    console.log("Verifying token ownership...");
    console.log("Expected owner:", expectedOwner);
    console.log("Token ID:", tokenId.toString());

    let retries = maxRetries;
    while (retries > 0) {
      try {
        const owner = await contract.ownerOf(tokenId);
        console.log("Current owner:", owner);
        
        if (owner.toLowerCase() === expectedOwner.toLowerCase()) {
          console.log("Token ownership verified successfully");
          return;
        }
        throw new Error("Owner mismatch");
      } catch (error) {
        if (retries === 1) throw error;
        retries--;
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  };

  return {
    initializeContract,
    checkTokenExists,
    mintToken,
    verifyTokenOwnership
  };
};