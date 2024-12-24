import { 
  verify,
  isValid,
  type VerificationFragment,
  type ValidVerificationFragment,
  type InvalidVerificationFragment,
  type ErrorVerificationFragment,
  type SkippedVerificationFragment,
  type OpenAttestationDnsTxtIdentityProofVerificationFragment,
  type OpenAttestationEthereumDocumentStoreStatusFragment,
  type OpenAttestationHashValidFragment
} from "@govtechsg/oa-verify";

// Re-export functions
export { verify, isValid };

// Re-export types with 'export type'
export type {
  VerificationFragment,
  ValidVerificationFragment,
  InvalidVerificationFragment,
  ErrorVerificationFragment,
  SkippedVerificationFragment,
  OpenAttestationDnsTxtIdentityProofVerificationFragment,
  OpenAttestationEthereumDocumentStoreStatusFragment,
  OpenAttestationHashValidFragment
};

// Helper type guards
export const isValidFragment = (fragment: VerificationFragment): fragment is ValidVerificationFragment<any> => {
  return fragment.status === "VALID";
};

export const isDnsFragment = (fragment: VerificationFragment): fragment is ValidVerificationFragment<OpenAttestationDnsTxtIdentityProofVerificationFragment> => {
  return fragment.name === "OpenAttestationDnsTxtIdentityProof";
};

export const isDocumentStoreFragment = (fragment: VerificationFragment): fragment is ValidVerificationFragment<OpenAttestationEthereumDocumentStoreStatusFragment> => {
  return fragment.name === "OpenAttestationEthereumDocumentStoreStatus";
};

export const isHashFragment = (fragment: VerificationFragment): fragment is ValidVerificationFragment<OpenAttestationHashValidFragment> => {
  return fragment.name === "OpenAttestationHash";
};

// Helper to safely get DNS fragment data
export const getDnsData = (fragment: ValidVerificationFragment<OpenAttestationDnsTxtIdentityProofVerificationFragment>) => {
  if (fragment.data) {
    return {
      name: fragment.data.identifier,
      domain: fragment.data.location
    };
  }
  return undefined;
};