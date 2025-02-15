// Import ABI and bytecode from artifacts
import DocumentStoreArtifact from "@/contract/artifacts/DocumentStore.json";
import BaseDocumentStoreArtifact from "@/contract/artifacts/BaseDocumentStore.json";
import DocumentStoreAccessControlArtifact from "@/contract/artifacts/DocumentStoreAccessControl.json";

// Export contract ABIs
export const DOCUMENT_STORE_ABI = DocumentStoreArtifact.abi;
export const BASE_DOCUMENT_STORE_ABI = BaseDocumentStoreArtifact.abi;
export const DOCUMENT_STORE_ACCESS_CONTROL_ABI = DocumentStoreAccessControlArtifact.abi;

// Export contract bytecode - accessing the nested bytecode object
export const DOCUMENT_STORE_BYTECODE = DocumentStoreArtifact.data?.bytecode?.object || "";
export const BASE_DOCUMENT_STORE_BYTECODE = BaseDocumentStoreArtifact.data?.bytecode?.object || "";
export const DOCUMENT_STORE_ACCESS_CONTROL_BYTECODE = DocumentStoreAccessControlArtifact.data?.bytecode?.object || "";

// Add console logs to help with debugging
console.log("Document Store Bytecode length:", DOCUMENT_STORE_BYTECODE.length);
console.log("First 64 chars of bytecode:", DOCUMENT_STORE_BYTECODE.substring(0, 64));
console.log("Base Document Store Bytecode length:", BASE_DOCUMENT_STORE_BYTECODE.length);
console.log("Access Control Bytecode length:", DOCUMENT_STORE_ACCESS_CONTROL_BYTECODE.length);

// Export role constants
export const ISSUER_ROLE = "ISSUER_ROLE";
export const REVOKER_ROLE = "REVOKER_ROLE";

// Export contract addresses
export const DOCUMENT_STORE_ACCESS_CONTROL_ADDRESS = "0x24ac75Ac29EAE7E203f73E4773eB3ea10d52dDc1";
export const BASE_DOCUMENT_STORE_ADDRESS = "0x4A5Cd89C739C6d4CC9192F66eE79055C1227cfF6";