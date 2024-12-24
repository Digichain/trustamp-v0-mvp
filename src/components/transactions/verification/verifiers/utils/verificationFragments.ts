import { VerificationFragment, VerificationFragmentType } from "@govtechsg/oa-verify";
import { VerificationResult } from "../../types";

export interface ExtendedVerificationFragment extends VerificationFragment {
  name: string;
  status: "VALID" | "INVALID" | "ERROR" | "SKIPPED";
  type: VerificationFragmentType;
  data?: {
    identifier?: string;
    location?: string;
    status?: string;
    value?: any;
    issuedOnAll?: boolean;
    details?: any;
  };
  reason?: {
    code: number;
    codeString: string;
    message: string;
  } | string;
}

export const processVerificationFragments = (fragments: VerificationFragment[]) => {
  console.log("Processing verification fragments:", fragments);

  const integrityFragment = fragments.find(f => f.name === "OpenAttestationHash");
  const documentIntegrity = {
    valid: integrityFragment?.status === "VALID",
    message: getFragmentMessage(integrityFragment, 
      "Document has not been tampered with",
      "Document integrity check failed"
    )
  };

  // Check both token registry and document store status
  const documentStoreFragment = fragments.find(f => 
    f.name === "OpenAttestationEthereumDocumentStoreStatus"
  );
  const tokenRegistryFragment = fragments.find(f => 
    f.name === "OpenAttestationEthereumTokenRegistryStatus"
  );

  // Document is valid if either document store or token registry verification passes
  const issuanceStatus = {
    valid: documentStoreFragment?.status === "VALID" || 
           (documentStoreFragment?.status === "INVALID" && tokenRegistryFragment?.status === "VALID"),
    message: getFragmentMessage(
      documentStoreFragment?.status === "VALID" ? documentStoreFragment : tokenRegistryFragment,
      "Document has been issued",
      "Document issuance verification failed"
    )
  };

  const identityFragment = fragments.find(f => 
    f.name === "OpenAttestationDnsTxtIdentityProof" ||
    f.name === "OpenAttestationDnsDidIdentityProof"
  ) as ExtendedVerificationFragment;

  const issuerIdentity = {
    valid: identityFragment?.status === "VALID",
    message: getFragmentMessage(identityFragment,
      "Document issuer has been identified",
      "Issuer identity verification failed"
    ),
    details: identityFragment?.data ? {
      name: identityFragment.data.identifier,
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
  if (fragment.status === "VALID") return successMessage;
  
  const extendedFragment = fragment as ExtendedVerificationFragment;
  if (extendedFragment.reason) {
    return typeof extendedFragment.reason === 'string' 
      ? extendedFragment.reason 
      : extendedFragment.reason.message;
  }
  
  return defaultFailureMessage;
};