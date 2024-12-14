import CryptoJS from 'crypto-js';
import { keccak256 } from 'js-sha3';
import { validateSchema as validate } from "../shared/validate";
import { getSchema } from "../shared/ajv";
import { SchemaId } from "../shared/@types/document";
import { SchemaValidationError } from "../shared/utils";

// Convert data to buffer for hashing, following OpenAttestation approach
const toBuffer = (data: any): Buffer => {
  const stringified = JSON.stringify(data);
  console.log("Converting to buffer, stringified data:", stringified);
  return Buffer.from(keccak256(stringified), 'hex');
};

// Generate hash following OpenAttestation approach
const generateHash = (data: any): string => {
  console.log("Starting hash generation for data:", data);
  const buffer = toBuffer(data);
  const hash = buffer.toString('hex');
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
    // Maintain strict key ordering as per OpenAttestation
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
const createDocument = (data: any, schemaId: string = SchemaId.v2) => {
  const documentSchema = {
    version: schemaId,
    data: saltDocumentData(data),
  };
  return documentSchema;
};

// Function to wrap the document and generate signature
export const wrapDocument = (rawDocument: any, schemaId: string = SchemaId.v2) => {
  console.log("Starting document wrapping process with raw document:", rawDocument);

  // Create the schematized document (adds the schema and salts the data)
  const document = createDocument(rawDocument, schemaId);
  console.log("Created schematized document:", document);

  // Validate the document schema
  const errors = validate(document, getSchema(schemaId));
  if (errors.length > 0) {
    throw new SchemaValidationError("Invalid document", errors, document);
  }

  // Generate the document hash using the data object
  const documentHash = generateHash(document.data);
  console.log("Generated document hash:", documentHash);

  // Create the signature object
  const signature = {
    type: "SHA3MerkleProof",
    targetHash: documentHash,
    proof: [],
    merkleRoot: documentHash
  };

  // Wrap the document and return the wrapped document structure
  const wrappedDocument = {
    ...document,
    signature
  };

  console.log("Final wrapped document structure:", wrappedDocument);
  return wrappedDocument;
};