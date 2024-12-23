import { ethers } from "ethers";

export interface DocumentStoreContract extends ethers.Contract {
  // Basic contract functions
  name(): Promise<string>;
  version(): Promise<string>;
  
  // Document management functions
  issue(document: string): Promise<ethers.ContractTransaction>;
  bulkIssue(documents: string[]): Promise<ethers.ContractTransaction>;
  getIssuedBlock(document: string): Promise<number>;
  isIssued(document: string): Promise<boolean>;
  revoke(document: string): Promise<ethers.ContractTransaction>;
  bulkRevoke(documents: string[]): Promise<ethers.ContractTransaction>;
  isRevoked(document: string): Promise<boolean>;
  
  // Access control functions
  hasRole(role: string, account: string): Promise<boolean>;
  getRoleAdmin(role: string): Promise<string>;
  grantRole(role: string, account: string): Promise<ethers.ContractTransaction>;
  revokeRole(role: string, account: string): Promise<ethers.ContractTransaction>;
  renounceRole(role: string, account: string): Promise<ethers.ContractTransaction>;
}

export interface DocumentStoreInfo {
  name: string;
  version: string;
  address: string;
  network: string;
}