import { verify, isValid } from "@govtechsg/oa-verify";
import { DocumentVerifier, VerificationResult } from "../types";
import { DOCUMENT_TEMPLATES } from "../types";
import { ExtendedVerificationFragment } from "../types/verificationTypes";

export class InvoiceVerifier implements DocumentVerifier {
  async verify(document: any): Promise<VerificationResult> {
    try {
      console.log("Starting verification with document:", document);

      const fragments = await verify(document) as ExtendedVerificationFragment[];
      console.log("Raw verification fragments received:", fragments);
      
      fragments.forEach((fragment, index) => {
        console.log(`Fragment ${index + 1} (${fragment.name}):`, {
          name: fragment.name,
          type: fragment.type,
          status: fragment.status,
          data: fragment.data,
          reason: fragment.reason
        });
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
    return DOCUMENT_TEMPLATES.INVOICE;
  }

  private processVerificationFragments(fragments: ExtendedVerificationFragment[]): any {
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
    );

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
    fragment: ExtendedVerificationFragment | undefined, 
    successMessage: string, 
    defaultFailureMessage: string
  ): string {
    if (!fragment) return "Verification check not performed";
    if (fragment.status === "VALID") return successMessage;
    
    if (fragment.reason) {
      return typeof fragment.reason === 'string' ? fragment.reason : fragment.reason.message;
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