export const DOCUMENT_STORE_ACCESS_CONTROL_ADDRESS = "0x24ac75Ac29EAE7E203f73E4773eB3ea10d52dDc1";
export const BASE_DOCUMENT_STORE_ADDRESS = "0x4A5Cd89C739C6d4CC9192F66eE79055C1227cfF6";

// Import ABI and bytecode from artifacts
import DocumentStoreArtifact from "@/contract/artifacts/DocumentStore.json";
import BaseDocumentStoreArtifact from "@/contract/artifacts/BaseDocumentStore.json";
import DocumentStoreAccessControlArtifact from "@/contract/artifacts/DocumentStoreAccessControl.json";

// Export contract ABIs
export const DOCUMENT_STORE_ABI = DocumentStoreArtifact.abi;
export const BASE_DOCUMENT_STORE_ABI = BaseDocumentStoreArtifact.abi;
export const DOCUMENT_STORE_ACCESS_CONTROL_ABI = DocumentStoreAccessControlArtifact.abi;

// Export contract bytecode
export const DOCUMENT_STORE_BYTECODE = DocumentStoreArtifact.bytecode;
export const BASE_DOCUMENT_STORE_BYTECODE = BaseDocumentStoreArtifact.bytecode;
export const DOCUMENT_STORE_ACCESS_CONTROL_BYTECODE = DocumentStoreAccessControlArtifact.bytecode;

// Export role constants
export const ISSUER_ROLE = "ISSUER_ROLE";
export const REVOKER_ROLE = "REVOKER_ROLE";