import { ethers } from "ethers";
import { DOCUMENT_STORE_ABI } from "./contracts/DocumentStoreConstants";
import { DocumentStoreContract, ISSUER_ROLE } from "./types";

export const useDocumentStoreInteraction = () => {
  const getContract = async (contractAddress: string): Promise<DocumentStoreContract> => {
    if (!window.ethereum) {
      throw new Error("MetaMask not installed");
    }

    try {
      console.log("Creating Web3Provider...");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      
      console.log("Getting network details...");
      const network = await provider.getNetwork();
      console.log("Connected to network:", network);
      
      console.log("Getting signer...");
      const signer = provider.getSigner();
      const signerAddress = await signer.getAddress();
      console.log("Signer address:", signerAddress);
      
      console.log("Creating contract instance at address:", contractAddress);
      const contract = new ethers.Contract(
        contractAddress, 
        DOCUMENT_STORE_ABI, 
        signer
      ) as DocumentStoreContract;
      
      console.log("Contract instance created successfully");
      return contract;
    } catch (error) {
      console.error("Error creating contract instance:", error);
      throw error;
    }
  };

  const issueDocument = async (contractAddress: string, merkleRoot: string) => {
    console.log("Issuing document with merkle root:", merkleRoot);
    console.log("Contract address:", contractAddress);
    
    try {
      const contract = await getContract(contractAddress);
      
      // Verify the caller has ISSUER_ROLE
      const signer = await contract.signer.getAddress();
      console.log("Checking ISSUER_ROLE for address:", signer);
      const hasRole = await contract.hasRole(ISSUER_ROLE, signer);
      console.log("Has ISSUER_ROLE:", hasRole);
      
      if (!hasRole) {
        console.error("Signer does not have ISSUER_ROLE");
        throw new Error("Caller does not have permission to issue documents");
      }
      
      // Call the issue function with the merkle root
      console.log("Calling issue function...");
      const tx = await contract.issue(merkleRoot);
      console.log("Issue transaction hash:", tx.hash);
      
      const receipt = await tx.wait();
      console.log("Issue transaction receipt:", receipt);
      return receipt;
    } catch (error) {
      console.error("Error in issueDocument:", error);
      throw error;
    }
  };

  const verifyIssuance = async (contractAddress: string, merkleRoot: string): Promise<boolean> => {
    try {
      console.log("Verifying issuance for merkle root:", merkleRoot);
      console.log("Contract address:", contractAddress);
      
      const contract = await getContract(contractAddress);
      const isIssued = await contract.isIssued(merkleRoot);
      console.log("Document issuance status:", isIssued);
      
      return isIssued;
    } catch (error) {
      console.error("Error in verifyIssuance:", error);
      throw error;
    }
  };

  return {
    getContract,
    issueDocument,
    verifyIssuance
  };
};