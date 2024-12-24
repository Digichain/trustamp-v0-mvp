import { VerificationFragment } from "@govtechsg/oa-verify";

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

export interface ExtendedVerificationFragment extends VerificationFragment {
  name: string;
  status: VerificationStatus;
  type: VerificationFragmentType;
  data?: {
    issuedOnAll?: boolean;
    revokedOnAny?: boolean;
    details?: {
      issuance?: Array<{ issued: boolean; address: string }>;
      revocation?: Array<{ revoked: boolean; address: string }>;
    };
    location?: string;
    value?: string;
  };
  reason?: {
    code: number;
    codeString: string;
    message: string;
  };
}

export const processVerificationFragments = (fragments: VerificationFragment[]) => {
  console.log("Processing verification fragments:", fragments);

  // Process Document Integrity
  const integrityFragment = fragments.find(f => f.name === "OpenAttestationHash");
  const documentIntegrity = {
    valid: integrityFragment?.status === VerificationStatus.VALID,
    message: getFragmentMessage(integrityFragment, 
      "Document has not been tampered with",
      "Document integrity check failed"
    )
  };

  // Process Document Store Status
  const documentStoreFragment = fragments.find(f => 
    f.name === "OpenAttestationEthereumDocumentStoreStatus"
  ) as ExtendedVerificationFragment;

  const issuanceStatus = {
    valid: documentStoreFragment?.status === VerificationStatus.VALID && 
           documentStoreFragment?.data?.issuedOnAll === true,
    message: getFragmentMessage(documentStoreFragment,
      "Document has been issued",
      "Document issuance verification failed"
    )
  };

  // Process DNS Identity
  const identityFragment = fragments.find(f => 
    f.name === "OpenAttestationDnsTxtIdentityProof"
  ) as ExtendedVerificationFragment;

  const issuerIdentity = {
    valid: identityFragment?.status === VerificationStatus.VALID,
    message: getFragmentMessage(identityFragment,
      "Document issuer has been identified",
      "Issuer identity verification failed"
    ),
    details: identityFragment?.data ? {
      name: identityFragment.data.value,
      domain: identityFragment.data.location
    } : undefined
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
  
  if (fragment.status === VerificationStatus.VALID) {
    return successMessage;
  }
  
  if (fragment.status === VerificationStatus.SKIPPED) {
    return (fragment as ExtendedVerificationFragment).reason?.message || "Verification skipped";
  }
  
  const extendedFragment = fragment as ExtendedVerificationFragment;
  if (extendedFragment.reason) {
    return typeof extendedFragment.reason === 'string' 
      ? extendedFragment.reason 
      : extendedFragment.reason.message;
  }
  
  return defaultFailureMessage;
};