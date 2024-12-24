import { ethers } from "ethers";

export interface DocumentStoreContract extends ethers.Contract {
  // Constructor and initialization (method ID: 0x4cd88b76)
  initialize(name: string, owner: string): Promise<void>;
  
  // Document management functions
  issue(document: string): Promise<ethers.ContractTransaction>;  // method ID: 0x4d55f23b
  bulkIssue(documents: string[]): Promise<ethers.ContractTransaction>;  // method ID: 0xb37b96b9
  revoke(document: string): Promise<ethers.ContractTransaction>;  // method ID: 0x54d83fd4
  isIssued(document: string): Promise<boolean>;  // method ID: 0x59c45d70
  isRevoked(document: string): Promise<boolean>;  // method ID: 0x9a59c8a4
  
  // Role management functions
  hasRole(role: string, account: string): Promise<boolean>;  // method ID: 0x91d14854
  grantRole(role: string, account: string): Promise<ethers.ContractTransaction>;  // method ID: 0x2f2ff15d
  
  // Contract info
  name(): Promise<string>;  // method ID: 0x06fdde03
  version(): Promise<string>;  // method ID: 0x54fd4d50
}

// Constants for role identifiers
export const ISSUER_ROLE = ethers.utils.id("ISSUER_ROLE");
export const REVOKER_ROLE = ethers.utils.id("REVOKER_ROLE");
export const DEFAULT_ADMIN_ROLE = ethers.constants.HashZero;