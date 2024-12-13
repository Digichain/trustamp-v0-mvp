import CryptoJS from 'crypto-js';
import { ethers } from 'ethers';
import { SchematisedDocument, WrappedDocument } from "./types"; // Assuming types are defined here
import { validateSchema as validate } from "../shared/validate"; // Schema validation
import { getSchema } from "../shared/ajv"; // Get schema function
import { SchemaId } from "../shared/@types/document"; // Schema identifiers
import { SchemaValidationError } from "../shared/utils"; // Validation error handling
import { OpenAttestationDocument } from "../__generated__/schema.2.0"; // Open Attestation Schema

// Hashing function: Generate hash without stringifying the data
const generateHash = (data: any): string => {
  console.log("Generating hash for data:", data);

  // Convert the data to a canonical form (without stringifying)
  const wordArray = CryptoJS.SHA3(CryptoJS.enc.Utf8.parse(JSON.stringify(data)), { outputLength: 256 });
  const hash = wordArray.toString(CryptoJS.enc.Hex);
  console.log("Generated hash:", hash);

  return hash;
};

// Salt generation function (using random UUID)
const generateSalt = (): string => {
  return crypto.randomUUID();
};

// Salt the document data (applies salting to each field)
const saltDocumentData = (data: any): any => {
  console.log("Starting data salting process with:", data);

  if (Array.isArray(data)) {
    return data.map(item => saltDocumentData(item));
  }

  if (typeof data === 'object' && data !== null) {
    const salted: any = {};
    const orderedKeys = [
      'id',
      '$template',
      'issuers',
      'recipient',
      'network',
      'invoiceDetails',
      ...Object.keys(data).filter(key =>
        !['id', '$template', 'issuers', 'recipient', 'network', 'invoiceDetails'].includes(key)
      )
    ].filter(key => key in data);

    for (const key of orderedKeys) {
      if (data[key] === null || data[key] === undefined) {
        salted[key] = data[key];
      } else if (typeof data[key] === 'object') {
        salted[key] = saltDocumentData(data[key]);
      } else {
        const salt = generateSalt();
        const value = data[key].toString();
        const type = typeof data[key];
        salted[key] = `${salt}:${type}:${value}`;
      }
    }
    console.log("Salted data result:", salted);
    return salted;
  }

  return data;
};

// Function to create the schematized document
const createDocument = <T extends OpenAttestationDocument = OpenAttestationDocument>(
  data: any,
  schemaId: string = SchemaId.v2
): SchematisedDocument<T> => {
  const documentSchema: SchematisedDocument<T> = {
    version: schemaId,
    data: saltDocumentData(data),
  };
  return documentSchema;
};

// Function to wrap the document and generate signature
export const wrapDocument = <T extends OpenAttestationDocument = OpenAttestationDocument>(
  rawDocument: T,
  schemaId: string = SchemaId.v2
): WrappedDocument<T> => {
  console.log("Starting document wrapping process with raw document:", rawDocument);

  // Create the schematized document (adds the schema and salts the data)
  const document: SchematisedDocument<T> = createDocument(rawDocument, schemaId);

  // Validate the document schema
  const errors = validate(document, getSchema(schemaId));
  if (errors.length > 0) {
    throw new SchemaValidationError("Invalid document", errors, document);
  }

  // Generate the document hash
  const documentHash = generateHash(document.data);
  console.log("Generated document hash:", documentHash);

  // Create the signature object
  const signature = {
    type: "SHA3MerkleProof",
    targetHash: documentHash,
    proof: [],
    merkleRoot: documentHash,
  };

  // Wrap the document and return the wrapped document structure
  const wrappedDocument: WrappedDocument<T> = {
    ...document,
    signature,
  };

  console.log("Final wrapped document structure:", wrappedDocument);
  return wrappedDocument;
};
