import { 
  VerificationFragment,
  isValidFragment,
  isDnsFragment,
  isDocumentStoreFragment,
  isHashFragment,
  getDnsData
} from "@/utils/openattestation";

export enum VerificationFragmentType {
  DOCUMENT_STATUS = "DOCUMENT_STATUS",
  DOCUMENT_INTEGRITY = "DOCUMENT_INTEGRITY",
  ISSUER_IDENTITY = "ISSUER_IDENTITY",
}

export enum VerificationStatus {
  VALID = "VALID",
  INVALID = "INVALID",
  ERROR = "ERROR",
  SKIPPED = "SKIPPED",
}

export const processVerificationFragments = (fragments: VerificationFragment[]) => {
  console.log("Processing verification fragments:", fragments);

  // Process Document Integrity
  const integrityFragment = fragments.find(f => isHashFragment(f));
  const documentIntegrity = {
    valid: integrityFragment?.status === "VALID",
    message: getFragmentMessage(integrityFragment, 
      "Document has not been tampered with",
      "Document integrity check failed"
    )
  };

  // Process Document Store Status
  const documentStoreFragment = fragments.find(f => isDocumentStoreFragment(f));
  const issuanceStatus = {
    valid: documentStoreFragment?.status === "VALID",
    message: getFragmentMessage(documentStoreFragment,
      "Document has been issued",
      "Document issuance verification failed"
    )
  };

  // Process DNS Identity
  const identityFragment = fragments.find(f => isDnsFragment(f));
  const issuerIdentity = {
    valid: identityFragment?.status === "VALID",
    message: getFragmentMessage(identityFragment,
      "Document issuer has been identified",
      "Issuer identity verification failed"
    ),
    details: identityFragment && isValidFragment(identityFragment) ? 
      getDnsData(identityFragment) : undefined
  };

  const result = {
    issuanceStatus,
    issuerIdentity,
    documentIntegrity
  };

  console.log("Processed verification details:", result);
  return result;
};

const getFragmentMessage = (
  fragment: VerificationFragment | undefined, 
  successMessage: string, 
  defaultFailureMessage: string
): string => {
  if (!fragment) return "Verification check not performed";
  
  if (fragment.status === "VALID") {
    return successMessage;
  }
  
  if (fragment.status === "SKIPPED") {
    return (fragment as SkippedVerificationFragment).reason?.message || "Verification skipped";
  }
  
  if ('reason' in fragment && fragment.reason?.message) {
    return fragment.reason.message;
  }
  
  return defaultFailureMessage;
};