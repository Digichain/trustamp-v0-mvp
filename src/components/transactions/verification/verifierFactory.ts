import { verify, isValid, VerificationFragment } from "@govtechsg/oa-verify";
import { DocumentVerifier, VerificationResult } from './types';
import { processVerificationFragments } from '../verification/types/verificationTypes';

export class VerifierFactory {
  private static verifier: DocumentVerifier;

  static async verifyDocument(document: any): Promise<DocumentVerifier | null> {
    console.log("Starting document verification process with document:", document);
    
    try {
      // Use the official OpenAttestation verify function
      const fragments = await verify(document);
      
      console.log("Verification fragments:", fragments);

      if (!Array.isArray(fragments)) {
        console.error("Verification did not return an array of fragments");
        throw new Error("Invalid verification response");
      }

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