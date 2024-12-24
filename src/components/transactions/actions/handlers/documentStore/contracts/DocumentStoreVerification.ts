import { ethers } from 'ethers';
import { DOCUMENT_STORE_ABI } from './DocumentStoreConstants';

export const verifyDocumentStore = async (
  contractAddress: string,
  name: string,
  owner: string
): Promise<boolean> => {
  try {
    console.log("Verifying document store contract:", contractAddress);
    
    // Initialize contract
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, DOCUMENT_STORE_ABI, provider);

    // Verify basic contract properties
    const contractName = await contract.name();
    const hasIssuerRole = await contract.hasRole(
      ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ISSUER_ROLE")),
      owner
    );

    // Verify contract matches expected parameters
    const isValid = contractName === name && hasIssuerRole;
    
    console.log("Document store verification result:", {
      contractName,
      hasIssuerRole,
      isValid
    });

    return isValid;
  } catch (error) {
    console.error("Error verifying document store:", error);
    return false;
  }
};