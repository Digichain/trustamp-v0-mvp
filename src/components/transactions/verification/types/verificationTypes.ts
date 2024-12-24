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

interface BaseVerificationFragment {
  name: string;
  type: VerificationFragmentType;
  status: VerificationStatus;
}

interface ValidFragment extends BaseVerificationFragment {
  status: VerificationStatus.VALID;
  data: {
    issuedOnAll?: boolean;
    revokedOnAny?: boolean;
    details?: {
      issuance?: Array<{ issued: boolean; address: string }>;
      revocation?: Array<{ revoked: boolean; address: string }>;
    };
    location?: string;
    value?: string;
  };
}

interface InvalidFragment extends BaseVerificationFragment {
  status: VerificationStatus.INVALID;
  reason: {
    code: number;
    codeString: string;
    message: string;
  };
}

interface ErrorFragment extends BaseVerificationFragment {
  status: VerificationStatus.ERROR;
  reason: {
    code: number;
    codeString: string;
    message: string;
  };
}

interface SkippedFragment extends BaseVerificationFragment {
  status: VerificationStatus.SKIPPED;
  reason: {
    code: number;
    codeString: string;
    message: string;
  };
}

export type ExtendedVerificationFragment = 
  | ValidFragment 
  | InvalidFragment 
  | ErrorFragment 
  | SkippedFragment;

export const processVerificationFragments = (fragments: VerificationFragment[]) => {
  console.log("Processing verification fragments:", fragments);

  // Process Document Integrity
  const integrityFragment = fragments.find(f => f.name === "OpenAttestationHash") as ExtendedVerificationFragment;
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
           (documentStoreFragment as ValidFragment)?.data?.issuedOnAll === true,
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
    details: (identityFragment as ValidFragment)?.data ? {
      name: (identityFragment as ValidFragment).data.value,
      domain: (identityFragment as ValidFragment).data.location
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
  fragment: ExtendedVerificationFragment | undefined, 
  successMessage: string, 
  defaultFailureMessage: string
): string => {
  if (!fragment) return "Verification check not performed";
  
  if (fragment.status === VerificationStatus.VALID) {
    return successMessage;
  }
  
  if (fragment.status === VerificationStatus.SKIPPED) {
    return fragment.reason?.message || "Verification skipped";
  }
  
  if ('reason' in fragment) {
    return fragment.reason.message;
  }
  
  return defaultFailureMessage;
};