import { VerificationFragment } from "@govtechsg/oa-verify";
import { ExtendedVerificationFragment } from "../types/verificationTypes";
import { SEPOLIA_NETWORK_ID } from "../../actions/handlers/documentStore/contracts/NetworkConfig";

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

  const issuanceFragment = fragments.find(f => 
    f.name === "OpenAttestationEthereumDocumentStoreStatus" ||
    f.name === "OpenAttestationEthereumTokenRegistryStatus"
  );
  
  const issuanceStatus = {
    valid: issuanceFragment?.status === "VALID",
    message: getFragmentMessage(issuanceFragment,
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

  return {
    issuanceStatus,
    issuerIdentity,
    documentIntegrity
  };
};

export const getFragmentMessage = (
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

export const logVerificationDetails = (
  fragment: VerificationFragment, 
  identifier: { type: 'documentStore' | 'did', value: string } | null
) => {
  if (fragment.name === "OpenAttestationEthereumDocumentStoreStatus") {
    console.log("Document Store verification details:", {
      status: fragment.status,
      reason: (fragment as ExtendedVerificationFragment).reason,
      contractAddress: identifier?.type === 'documentStore' ? identifier.value : undefined,
      network: SEPOLIA_NETWORK_ID
    });
  }

  if (fragment.name === "OpenAttestationDnsTxtIdentityProof" || 
      fragment.name === "OpenAttestationDnsDidIdentityProof") {
    console.log("Identity verification details:", {
      status: fragment.status,
      reason: (fragment as ExtendedVerificationFragment).reason,
    });
  }
};