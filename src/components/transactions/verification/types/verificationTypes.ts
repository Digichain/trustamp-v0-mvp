import { 
  VerificationFragment, 
  ValidVerificationFragment,
  InvalidVerificationFragment,
  ErrorVerificationFragment,
  SkippedVerificationFragment,
  OpenAttestationDnsTxtCode,
  VerificationFragmentType,
  DocumentStoreIssuanceStatus // Fixed import name
} from "@govtechsg/oa-verify";

interface DnsTextRecord {
  value: string;
  location: string;
}

export const processVerificationFragments = (fragments: VerificationFragment[]) => {
  console.log("Processing verification fragments:", fragments);

  // Process Document Integrity
  const integrityFragment = fragments.find(f => f.name === "OpenAttestationHash");
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
  );

  const issuanceStatus = {
    valid: documentStoreFragment?.status === "VALID" && 
           (documentStoreFragment as ValidVerificationFragment<{ issuedOnAll: boolean }>)?.data?.issuedOnAll === true,
    message: getFragmentMessage(documentStoreFragment,
      "Document has been issued",
      "Document issuance verification failed"
    )
  };

  // Process DNS Identity
  const identityFragment = fragments.find(f => 
    f.name === "OpenAttestationDnsTxtIdentityProof"
  );

  const issuerIdentity = {
    valid: identityFragment?.status === "VALID",
    message: getFragmentMessage(identityFragment,
      "Document issuer has been identified",
      "Issuer identity verification failed"
    ),
    details: (identityFragment as ValidVerificationFragment<DnsTextRecord>)?.data ? {
      name: (identityFragment as ValidVerificationFragment<DnsTextRecord>).data.value,
      domain: (identityFragment as ValidVerificationFragment<DnsTextRecord>).data.location
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
    return (fragment as SkippedVerificationFragment).reason?.message || "Verification skipped";
  }
  
  if ('reason' in fragment && fragment.reason && typeof fragment.reason === 'object' && 'message' in fragment.reason) {
    return fragment.reason.message as string;
  }
  
  return defaultFailureMessage;
};