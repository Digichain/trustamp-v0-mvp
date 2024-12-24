import { 
  verify,
  isValid,
  VerificationFragment,
  ValidVerificationFragment,
  InvalidVerificationFragment,
  ErrorVerificationFragment,
  SkippedVerificationFragment,
  OpenAttestationDnsTxtIdentityProofVerificationFragment,
  OpenAttestationEthereumDocumentStoreStatusFragment,
  OpenAttestationHashValidFragment
} from "@govtechsg/oa-verify";

// Re-export everything
export {
  verify,
  isValid,
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
export const isValidFragment = (fragment: VerificationFragment): fragment is ValidVerificationFragment => {
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
      name: fragment.data.value,
      domain: fragment.data.location
    };
  }
  return undefined;
};