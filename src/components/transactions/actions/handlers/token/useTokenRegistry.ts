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
      console.log("Checking if token exists - Token ID:", tokenId.toString());
      const owner = await contract.ownerOf(tokenId);
      console.log("Token already exists, owned by:", owner);
      return true;
    } catch (error: any) {
      // Check specifically for the ERC721NonexistentToken error
      if (error.errorName === "ERC721NonexistentToken") {
        console.log("Token does not exist yet (confirmed by ERC721NonexistentToken error)");
        return false;
      }
      // For any other error, we should throw it
      console.error("Unexpected error in checkTokenExists:", error);
      throw error;
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
      // Increase gas limit for safety
      const tx = await contract.safeMint(to, tokenId, {
        gasLimit: 1000000 // Increased from 500000
      });
      console.log("Mint transaction submitted:", tx.hash);
      
      const receipt = await tx.wait(2); // Wait for 2 block confirmations
      console.log("Transaction confirmed:", receipt);
      return receipt;
    } catch (error: any) {
      console.error("Error in mint transaction:", error);
      
      // Handle specific error cases
      if (error.message.includes("execution reverted")) {
        throw new Error("Token minting failed - contract execution reverted. Please check your wallet has sufficient funds and try again.");
      }
      
      // If it's a more specific error, include it in the message
      const errorMessage = error.errorName 
        ? `Token minting failed - ${error.errorName}. Please try again.`
        : "Token minting failed - unexpected error. Please try again.";
      
      throw new Error(errorMessage);
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
    let lastError = null;

    while (retries > 0) {
      try {
        const owner = await contract.ownerOf(tokenId);
        console.log("Current owner:", owner);
        
        if (owner.toLowerCase() === expectedOwner.toLowerCase()) {
          console.log("Token ownership verified successfully");
          return;
        }
        throw new Error("Owner mismatch");
      } catch (error: any) {
        lastError = error;
        console.log(`Verification attempt failed (${retries} retries left):`, error.message);
        
        // If the token doesn't exist, no point in retrying
        if (error.errorName === "ERC721NonexistentToken") {
          throw new Error("Token ownership verification failed - token does not exist");
        }
        
        if (retries === 1) {
          console.error("All verification attempts failed");
          throw new Error(
            `Token ownership verification failed - ${error.errorName || error.message}`
          );
        }
        
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