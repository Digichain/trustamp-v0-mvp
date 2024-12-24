import { ethers } from "ethers";
import { DOCUMENT_STORE_ABI } from "./contracts/DocumentStoreConstants";
import { DocumentStoreContract, ISSUER_ROLE } from "./types";

export const useDocumentStoreInteraction = () => {
  const getContract = async (contractAddress: string): Promise<DocumentStoreContract> => {
    if (!window.ethereum) {
      throw new Error("MetaMask not installed");
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    
    console.log("Creating contract instance at address:", contractAddress);
    return new ethers.Contract(
      contractAddress, 
      DOCUMENT_STORE_ABI, 
      signer
    ) as DocumentStoreContract;
  };

  const issueDocument = async (contractAddress: string, merkleRoot: string) => {
    console.log("Issuing document with merkle root:", merkleRoot);
    const contract = await getContract(contractAddress);
    
    // Verify the caller has ISSUER_ROLE (method ID: 0x91d14854)
    const signer = await contract.signer.getAddress();
    const hasRole = await contract.hasRole(ISSUER_ROLE, signer);
    
    if (!hasRole) {
      console.error("Signer does not have ISSUER_ROLE");
      throw new Error("Caller does not have permission to issue documents");
    }
    
    // Call the issue function with the merkle root (method ID: 0x4d55f23b)
    console.log("Calling issue function with merkle root:", merkleRoot);
    const tx = await contract.issue(merkleRoot);
    console.log("Issue transaction hash:", tx.hash);
    
    const receipt = await tx.wait();
    console.log("Issue transaction receipt:", receipt);
    return receipt;
  };

  const verifyIssuance = async (contractAddress: string, merkleRoot: string): Promise<boolean> => {
    const contract = await getContract(contractAddress);
    // Call isIssued function (method ID: 0x59c45d70)
    return await contract.isIssued(merkleRoot);
  };

  return {
    getContract,
    issueDocument,
    verifyIssuance
  };
};