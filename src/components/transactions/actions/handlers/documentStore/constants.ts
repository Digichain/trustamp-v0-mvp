import { ethers } from "ethers";

// Simple ABI with just the functions we need for issuing
export const DOCUMENT_STORE_ABI = [
  "function issue(bytes32 document) external",
  "function isIssued(bytes32 document) public view returns (bool)"
];