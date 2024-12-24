import { 
  VerificationFragment, 
  ValidVerificationFragment,
  InvalidVerificationFragment,
  ErrorVerificationFragment,
  SkippedVerificationFragment,
  openAttestationDnsDidIdentityProof,
  openAttestationDnsTxtIdentityProof,
  OpenAttestationEthereumDocumentStoreStatusFragment,
  OpenAttestationHashValidFragment
} from "@govtechsg/oa-verify";

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
  const integrityFragment = fragments.find(f => f.name === "OpenAttestationHash") as 
    ValidVerificationFragment<OpenAttestationHashValidFragment> | undefined;
    
  const documentIntegrity = {
    valid: integrityFragment?.status === "VALID",
    message: getFragmentMessage(integrityFragment, 
      "Document has not been tampered with",
      "Document integrity check failed"
    )
  };

  // Process Document Store Status
  const documentStoreFragment = fragments.find(f => 
    f.name === "OpenAttestationEthereumDocumentStoreStatus"
  ) as ValidVerificationFragment<OpenAttestationEthereumDocumentStoreStatusFragment> | undefined;

  const issuanceStatus = {
    valid: documentStoreFragment?.status === "VALID" && 
           documentStoreFragment?.data?.issuedOnAll === true,
    message: getFragmentMessage(documentStoreFragment,
      "Document has been issued",
      "Document issuance verification failed"
    )
  };

  // Process DNS Identity
  const identityFragment = fragments.find(f => 
    f.name === "OpenAttestationDnsTxtIdentityProof"
  ) as ValidVerificationFragment<typeof openAttestationDnsTxtIdentityProof> | undefined;

  const issuerIdentity = {
    valid: identityFragment?.status === "VALID",
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
  
  if (fragment.status === "VALID") {
    return successMessage;
  }
  
  if (fragment.status === "SKIPPED") {
    const skippedFragment = fragment as SkippedVerificationFragment;
    return skippedFragment.reason?.message || "Verification skipped";
  }
  
  if ('reason' in fragment) {
    const errorFragment = fragment as ErrorVerificationFragment<any>;
    return errorFragment.reason?.message || defaultFailureMessage;
  }
  
  return defaultFailureMessage;
};