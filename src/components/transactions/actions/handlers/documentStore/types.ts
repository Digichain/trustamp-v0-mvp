import { ethers } from "ethers";

export interface DocumentStoreContract extends ethers.Contract {
  hasRole(role: string, account: string): Promise<boolean>;
  isIssued(document: string): Promise<boolean>;
  issue(document: string): Promise<ethers.ContractTransaction>;
  revoke(document: string): Promise<ethers.ContractTransaction>;
  isRevoked(document: string): Promise<boolean>;
}