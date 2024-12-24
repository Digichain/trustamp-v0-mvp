import { ethers } from "ethers";

export interface DocumentStoreContract extends ethers.Contract {
  // Base document store functions
  issue(document: string): Promise<ethers.ContractTransaction>;
  bulkIssue(documents: string[]): Promise<ethers.ContractTransaction>;
  revoke(document: string): Promise<ethers.ContractTransaction>;
  bulkRevoke(documents: string[]): Promise<ethers.ContractTransaction>;
  isIssued(document: string): Promise<boolean>;
  isRevoked(document: string): Promise<boolean>;
  getIssuedBlock(document: string): Promise<number>;
  isIssuedBefore(document: string, blockNumber: number): Promise<boolean>;
  isRevokedBefore(document: string, blockNumber: number): Promise<boolean>;
  
  // Contract info functions
  name(): Promise<string>;
  version(): Promise<string>;

  // Access control functions
  DEFAULT_ADMIN_ROLE(): Promise<string>;
  ISSUER_ROLE(): Promise<string>;
  REVOKER_ROLE(): Promise<string>;
  hasRole(role: string, account: string): Promise<boolean>;
  getRoleAdmin(role: string): Promise<string>;
  grantRole(role: string, account: string): Promise<ethers.ContractTransaction>;
  revokeRole(role: string, account: string): Promise<ethers.ContractTransaction>;
  renounceRole(role: string, account: string): Promise<ethers.ContractTransaction>;
}

// Constants for role identifiers
export const ISSUER_ROLE = ethers.utils.id("ISSUER_ROLE");
export const REVOKER_ROLE = ethers.utils.id("REVOKER_ROLE");
export const DEFAULT_ADMIN_ROLE = ethers.constants.HashZero;