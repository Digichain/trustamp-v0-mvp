import { 
  type VerificationFragment
} from "@govtechsg/oa-verify";

import {
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

const isValidIssuanceStatus = (fragments: VerificationFragment[]): boolean => {
  return fragments.some(fragment => {
    const type = fragment.name;
    const isValid = fragment.status === "VALID";
    
    return isValid && (
      type === "OpenAttestationDidSignedDocumentStatus" ||
      type === "OpenAttestationEthereumDocumentStoreStatus" ||
      type === "OpenAttestationEthereumTokenRegistryStatus"
    );
  });
};

const getIssuanceStatusMessage = (fragments: VerificationFragment[]): string => {
  const validIssuance = isValidIssuanceStatus(fragments);
  
  if (validIssuance) {
    return "Document has been issued";
  }

  // Check for specific error messages
  const relevantFragment = fragments.find(f => 
    f.name === "OpenAttestationDidSignedDocumentStatus" ||
    f.name === "OpenAttestationEthereumDocumentStoreStatus" ||
    f.name === "OpenAttestationEthereumTokenRegistryStatus"
  );

  if (relevantFragment && 'reason' in relevantFragment) {
    return (relevantFragment.reason as { message: string })?.message || "Document issuance verification failed";
  }

  return "Document issuance verification failed";
};

const isValidIssuerIdentity = (fragments: VerificationFragment[]): boolean => {
  return fragments.some(fragment => {
    const type = fragment.name;
    const isValid = fragment.status === "VALID";
    
    return isValid && (
      type === "OpenAttestationDnsDidIdentityProof" ||
      type === "OpenAttestationDnsTxtIdentityProof"
    );
  });
};

const getIssuerIdentityMessage = (fragments: VerificationFragment[]): string => {
  const validIdentity = isValidIssuerIdentity(fragments);
  
  if (validIdentity) {
    return "Document issuer has been identified";
  }

  // Check for specific error messages from either identity proof type
  const relevantFragment = fragments.find(f => 
    f.name === "OpenAttestationDnsDidIdentityProof" ||
    f.name === "OpenAttestationDnsTxtIdentityProof"
  );

  if (relevantFragment && 'reason' in relevantFragment) {
    return (relevantFragment.reason as { message: string })?.message || "Issuer identity verification failed";
  }

  return "Issuer identity verification failed";
};

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

  // Process Issuance Status using the new logic
  const issuanceStatus = {
    valid: isValidIssuanceStatus(fragments),
    message: getIssuanceStatusMessage(fragments)
  };

  // Process Issuer Identity using the new logic
  const identityFragment = fragments.find(f => isDnsFragment(f));
  const issuerIdentity = {
    valid: isValidIssuerIdentity(fragments),
    message: getIssuerIdentityMessage(fragments),
    details: identityFragment && isValidFragment(identityFragment) ? 
      getDnsData(identityFragment) : undefined
  };

  const result = {
    issuanceStatus,
    issuerIdentity,
    documentIntegrity,
    fragments
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
    return "Verification skipped";
  }
  
  if (fragment.status === "ERROR" && 'reason' in fragment) {
    return (fragment.reason as { message: string })?.message || defaultFailureMessage;
  }
  
  return defaultFailureMessage;
};