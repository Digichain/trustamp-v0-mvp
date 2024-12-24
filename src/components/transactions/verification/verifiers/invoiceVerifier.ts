import { verify, isValid, VerificationFragment } from "@govtechsg/oa-verify";
import { DocumentVerifier, VerificationResult } from "../types";
import { ExtendedVerificationFragment } from "../types/verificationTypes";
import { SEPOLIA_NETWORK_ID } from "../../../transactions/actions/handlers/documentStore/contracts/NetworkConfig";

export class InvoiceVerifier implements DocumentVerifier {
  async verify(document: any): Promise<VerificationResult> {
    try {
      // Extract the data from wrapped document if it exists
      const documentData = document.data || document;
      console.log("Document data for verification:", documentData);

      // Get document identifier (either document store or DID)
      const identifier = this.getDocumentIdentifier(documentData);
      console.log("Document identifier:", identifier);

      // Log identity proof details
      const identityProof = documentData?.issuers?.[0]?.identityProof;
      if (identityProof) {
        console.log("Identity Proof details:", {
          type: this.removeSalt(identityProof.type),
          location: this.removeSalt(identityProof.location),
          key: this.removeSalt(identityProof.key)
        });
      }
      
      console.log("Starting OpenAttestation verification...");
      const fragments = await verify(document) as VerificationFragment[];
      console.log("Raw verification fragments received:", fragments);
      
      if (!Array.isArray(fragments)) {
        throw new Error("Invalid verification response");
      }

      fragments.forEach((fragment, index) => {
        console.log(`Fragment ${index + 1} (${fragment.name}):`, {
          name: fragment.name,
          type: fragment.type,
          status: fragment.status,
          data: (fragment as ExtendedVerificationFragment).data,
          reason: (fragment as ExtendedVerificationFragment).reason
        });

        // Log specific details for document store verification
        if (fragment.name === "OpenAttestationEthereumDocumentStoreStatus") {
          console.log("Document Store verification details:", {
            status: fragment.status,
            reason: (fragment as ExtendedVerificationFragment).reason,
            contractAddress: identifier.type === 'documentStore' ? identifier.value : undefined,
            network: SEPOLIA_NETWORK_ID
          });
        }

        // Log specific details for DNS or DID verification
        if (fragment.name === "OpenAttestationDnsTxtIdentityProof" || 
            fragment.name === "OpenAttestationDnsDidIdentityProof") {
          console.log("Identity verification details:", {
            status: fragment.status,
            reason: (fragment as ExtendedVerificationFragment).reason,
            identityProof: {
              type: this.removeSalt(identityProof?.type),
              location: this.removeSalt(identityProof?.location)
            }
          });
        }
      });

      const documentIsValid = isValid(fragments);
      console.log("Overall document validity:", documentIsValid);

      const verificationDetails = this.processVerificationFragments(fragments);
      console.log("Processed verification details:", verificationDetails);

      return {
        isValid: documentIsValid,
        details: verificationDetails
      };
    } catch (error) {
      console.error("Verification error:", error);
      return this.createErrorResponse(error instanceof Error ? error.message : "Unknown verification error");
    }
  }

  getTemplate(): string {
    return "ANY";
  }

  private getDocumentIdentifier(document: any): { type: 'documentStore' | 'did', value: string } | null {
    const issuer = document?.issuers?.[0];
    if (!issuer) {
      console.log("No issuer found in document");
      return null;
    }

    // Check for document store
    const documentStore = this.removeSalt(issuer.documentStore);
    if (documentStore && this.isValidEthereumAddress(documentStore)) {
      return { type: 'documentStore', value: documentStore };
    }

    // Check for DID
    const did = this.removeSalt(issuer.id);
    if (did?.startsWith('did:')) {
      return { type: 'did', value: did };
    }

    console.log("No valid identifier found in document");
    return null;
  }

  private isValidEthereumAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  private removeSalt(value: string): string | undefined {
    if (!value) return undefined;
    // Remove the salt pattern (uuid:string:) from the value
    const match = value.match(/^[^:]+:string:(.+)$/);
    return match ? match[1] : value;
  }

  private processVerificationFragments(fragments: VerificationFragment[]): any {
    console.log("Processing verification fragments:", fragments);

    const integrityFragment = fragments.find(f => f.name === "OpenAttestationHash");
    const documentIntegrity = {
      valid: integrityFragment?.status === "VALID",
      message: this.getFragmentMessage(integrityFragment, 
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
      message: this.getFragmentMessage(issuanceFragment,
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
      message: this.getFragmentMessage(identityFragment,
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
  }

  private getFragmentMessage(
    fragment: VerificationFragment | undefined, 
    successMessage: string, 
    defaultFailureMessage: string
  ): string {
    if (!fragment) return "Verification check not performed";
    if (fragment.status === "VALID") return successMessage;
    
    const extendedFragment = fragment as ExtendedVerificationFragment;
    if (extendedFragment.reason) {
      return typeof extendedFragment.reason === 'string' 
        ? extendedFragment.reason 
        : extendedFragment.reason.message;
    }
    
    return defaultFailureMessage;
  }

  private createErrorResponse(message: string): VerificationResult {
    return {
      isValid: false,
      details: {
        issuanceStatus: {
          valid: false,
          message: message
        },
        issuerIdentity: {
          valid: false,
          message: "Verification failed"
        },
        documentIntegrity: {
          valid: false,
          message: "Unable to verify document integrity"
        }
      }
    };
  }
}