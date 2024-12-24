import { ethers } from "ethers";
import { DOCUMENT_STORE_ABI } from "./contracts/DocumentStoreConstants";
import { verifyDocumentStore } from "./contracts/DocumentStoreVerification";

export const useDocumentStoreInteraction = () => {
  const getContract = async (contractAddress: string) => {
    if (!window.ethereum) {
      throw new Error("MetaMask not installed");
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(contractAddress, DOCUMENT_STORE_ABI, signer);
  };

  const issueDocument = async (contractAddress: string, merkleRoot: string) => {
    console.log("Issuing document with merkle root:", merkleRoot);
    const contract = await getContract(contractAddress);
    const tx = await contract.issue(merkleRoot, { gasLimit: 500000 });
    return await tx.wait();
  };

  const revokeDocument = async (contractAddress: string, merkleRoot: string) => {
    console.log("Revoking document with merkle root:", merkleRoot);
    const contract = await getContract(contractAddress);
    const tx = await contract.revoke(merkleRoot, { gasLimit: 500000 });
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