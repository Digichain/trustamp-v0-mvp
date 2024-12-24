import { verify, isValid, type VerificationFragment } from "@/utils/openattestation";
import { DocumentVerifier, VerificationResult } from './types';
import { processVerificationFragments } from './types/verificationTypes';

export class VerifierFactory {
  private static verifier: DocumentVerifier;

  static async verifyDocument(document: any): Promise<DocumentVerifier | null> {
    console.log("Starting document verification process with document:", document);
    
    try {
      // Use the official OpenAttestation verify function
      const verificationResponse = await verify(document);
      const fragments = Array.isArray(verificationResponse) ? verificationResponse : [verificationResponse];
      
      console.log("Verification fragments:", fragments);

      // Process the verification fragments
      const verificationDetails = processVerificationFragments(fragments);
      
      // Create a verifier instance that wraps the OpenAttestation verification
      return {
        verify: async () => {
          return {
            isValid: fragments.every(fragment => isValid(fragment)),
            details: verificationDetails
          };
        },
        getTemplate: () => "ANY"
      };
    } catch (error) {
      console.error("Error in verifier factory:", error);
      return null;
    }
  }
}