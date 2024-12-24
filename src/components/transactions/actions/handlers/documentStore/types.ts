import { ethers } from "ethers";

export interface DocumentStoreContract extends ethers.Contract {
  // Base document store functions
  documentIssued(document: string): Promise<number>;
  documentRevoked(document: string): Promise<number>;
  getIssuedBlock(document: string): Promise<number>;
  isIssued(document: string): Promise<boolean>;
  isIssuedBefore(document: string, blockNumber: number): Promise<boolean>;
  isRevoked(document: string): Promise<boolean>;
  isRevokedBefore(document: string, blockNumber: number): Promise<boolean>;
  name(): Promise<string>;
  version(): Promise<string>;

  // Access control functions
  hasRole(role: string, account: string): Promise<boolean>;
  getRoleAdmin(role: string): Promise<string>;
  grantRole(role: string, account: string): Promise<ethers.ContractTransaction>;
  revokeRole(role: string, account: string): Promise<ethers.ContractTransaction>;
  renounceRole(role: string, account: string): Promise<ethers.ContractTransaction>;

  // Document management functions
  issue(document: string): Promise<ethers.ContractTransaction>;
  bulkIssue(documents: string[]): Promise<ethers.ContractTransaction>;
  revoke(document: string): Promise<ethers.ContractTransaction>;
  bulkRevoke(documents: string[]): Promise<ethers.ContractTransaction>;
}