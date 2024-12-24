import { 
  verify,
  isValid,
  type VerificationFragment,
  type OpenAttestationDnsTxtIdentityProofValidFragmentV2,
  type OpenAttestationEthereumDocumentStoreStatusValidFragmentV2,
  type OpenAttestationHashValidFragmentV2
} from "@govtechsg/oa-verify";

// Re-export functions
export { verify, isValid };

// Re-export types
export type {
  VerificationFragment,
  OpenAttestationDnsTxtIdentityProofValidFragmentV2,
  OpenAttestationEthereumDocumentStoreStatusValidFragmentV2,
  OpenAttestationHashValidFragmentV2
};

// Helper type guards
export const isValidFragment = (fragment: VerificationFragment): boolean => {
  return fragment.status === "VALID";
};

export const isDnsFragment = (fragment: VerificationFragment): fragment is OpenAttestationDnsTxtIdentityProofValidFragmentV2 => {
  return fragment.name === "OpenAttestationDnsTxtIdentityProof" && fragment.status === "VALID";
};

export const isDocumentStoreFragment = (fragment: VerificationFragment): fragment is OpenAttestationEthereumDocumentStoreStatusValidFragmentV2 => {
  return fragment.name === "OpenAttestationEthereumDocumentStoreStatus" && fragment.status === "VALID";
};

export const isHashFragment = (fragment: VerificationFragment): fragment is OpenAttestationHashValidFragmentV2 => {
  return fragment.name === "OpenAttestationHash" && fragment.status === "VALID";
};

// Helper to safely get DNS fragment data
export const getDnsData = (fragment: OpenAttestationDnsTxtIdentityProofValidFragmentV2) => {
  if (fragment.data) {
    return {
      name: fragment.data.value,
      domain: fragment.data.value
    };
  }
  return undefined;
};