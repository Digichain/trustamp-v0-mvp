import { ethers } from "ethers";

// Role constants from the contract
export const ISSUER_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ISSUER_ROLE"));
export const REVOKER_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("REVOKER_ROLE"));

// Updated ABI to match TradeTrust's DocumentStore implementation
export const DOCUMENT_STORE_ABI = [
  // Document Store Interface
  "function name() external view returns (string)",
  "function version() external view returns (string)",
  "function isIssued(bytes32 document) external view returns (bool)",
  "function isRevoked(bytes32 document) external view returns (bool)",
  "function getIssuedBlock(bytes32 document) external view returns (uint256)",
  "function issue(bytes32 document) external",
  "function bulkIssue(bytes32[] documents) external",
  "function revoke(bytes32 document) external",
  "function bulkRevoke(bytes32[] documents) external",
  
  // Access Control Interface
  "function hasRole(bytes32 role, address account) external view returns (bool)",
  "function getRoleAdmin(bytes32 role) external view returns (bytes32)",
  "function grantRole(bytes32 role, address account) external",
  "function revokeRole(bytes32 role, address account) external",
  "function renounceRole(bytes32 role, address account) external",
  
  // Events
  "event DocumentIssued(bytes32 indexed document)",
  "event DocumentRevoked(bytes32 indexed document)",
  "event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender)",
  "event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender)"
];

// Updated bytecode to match TradeTrust's implementation
// Note: Using a minimal bytecode for testing. In production, use the full verified bytecode from TradeTrust
export const DOCUMENT_STORE_BYTECODE = "0x60806040523480156100105760008060405260043610610020565b600080fd5b50604051610100380380610100839139505050";