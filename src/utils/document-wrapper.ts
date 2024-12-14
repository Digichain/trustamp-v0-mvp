import { wrapDocument as oaWrapDocument } from "@govtechsg/open-attestation";
import { validateSchema as validate } from "../shared/validate";
import { getSchema } from "../shared/ajv";
import { SchemaId } from "../shared/@types/document";
import { SchemaValidationError } from "../shared/utils";

// Function to wrap the document using OpenAttestation's official function
export const wrapDocument = (rawDocument: any, schemaId: string = SchemaId.v2) => {
  console.log("Starting document wrapping process with raw document:", rawDocument);

  // Validate the document schema before wrapping
  const errors = validate(rawDocument, getSchema(schemaId));
  if (errors.length > 0) {
    throw new SchemaValidationError("Invalid document", errors, rawDocument);
  }

  // Use OpenAttestation's wrap function directly
  const wrappedDocument = oaWrapDocument(rawDocument);
  console.log("Final wrapped document structure:", wrappedDocument);
  
  return wrappedDocument;
};