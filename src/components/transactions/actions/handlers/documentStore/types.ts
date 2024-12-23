import { ethers } from "ethers";

export interface DocumentStoreContract extends ethers.Contract {
  name(): Promise<string>;
  version(): Promise<string>;
  hasRole(role: string, account: string): Promise<boolean>;
  isIssued(document: string): Promise<boolean>;
  getIssuedBlock(document: string): Promise<number>;
  issue(document: string): Promise<ethers.ContractTransaction>;
}

export interface DocumentStoreInfo {
  name: string;
  version: string;
  address: string;
  network: string;
}