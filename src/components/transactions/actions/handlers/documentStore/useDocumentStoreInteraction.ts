import { ethers } from "ethers";
import { DOCUMENT_STORE_ABI } from "./contracts/DocumentStoreConstants";
import { DocumentStoreContract, ISSUER_ROLE } from "./types";
import { verifyDocumentStore } from "./contracts/DocumentStoreVerification";

export const useDocumentStoreInteraction = () => {
  const getContract = async (contractAddress: string): Promise<DocumentStoreContract> => {
    if (!window.ethereum) {
      throw new Error("MetaMask not installed");
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(contractAddress, DOCUMENT_STORE_ABI, signer) as DocumentStoreContract;
  };

  const issueDocument = async (contractAddress: string, merkleRoot: string) => {
    console.log("Issuing document with merkle root:", merkleRoot);
    const contract = await getContract(contractAddress);
    
    // Verify the caller has ISSUER_ROLE
    const signer = await contract.signer.getAddress();
    const hasRole = await contract.hasRole(ISSUER_ROLE, signer);
    
    if (!hasRole) {
      console.error("Signer does not have ISSUER_ROLE");
      throw new Error("Caller does not have permission to issue documents");
    }
    
    // Call the issue function with the merkle root
    console.log("Calling issue function with merkle root:", merkleRoot);
    const tx = await contract.issue(merkleRoot);
    console.log("Transaction sent:", tx.hash);
    
    const receipt = await tx.wait();
    console.log("Transaction receipt:", receipt);
    return receipt;
  };

  const revokeDocument = async (contractAddress: string, merkleRoot: string) => {
    console.log("Revoking document with merkle root:", merkleRoot);
    const contract = await getContract(contractAddress);
    const tx = await contract.revoke(merkleRoot);
    return await tx.wait();
  };

  const verifyContract = async (contractAddress: string, name: string, owner: string) => {
    return await verifyDocumentStore(contractAddress, name, owner);
  };

  return {
    getContract,
    issueDocument,
    revokeDocument,
    verifyContract
  };
};