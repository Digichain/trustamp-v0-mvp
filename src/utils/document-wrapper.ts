import CryptoJS from 'crypto-js';
import { ethers } from 'ethers';
import { validateSchema as validate } from "../shared/validate";
import { getSchema } from "../shared/ajv";
import { SchemaId } from "../shared/@types/document";
import { SchemaValidationError } from "../shared/utils";

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

  // Validate the document schema
  const errors = validate(document, getSchema(schemaId));
  if (errors.length > 0) {
    throw new SchemaValidationError("Invalid document", errors, document);
  }

  // Generate the document hash (targetHash)
  const documentHash = generateHash(document.data);
  console.log("Generated document hash:", documentHash);

  // Generate the merkleRoot (this should be the root of a Merkle tree based on the document hash)
  const merkleRoot = documentHash; // In this example, we're directly using the hash as the root, but this could be different if you're using a Merkle tree

  console.log("Generated Merkle root:", merkleRoot);

  // Create the signature object
  const signature = {
    type: "SHA3MerkleProof",
    targetHash: documentHash,
    proof: [],
    merkleRoot: merkleRoot,
  };

  // Wrap the document and return the wrapped document structure
  const wrappedDocument = {
    ...document,
    signature,
  };

  console.log("Final wrapped document structure:", wrappedDocument);
  return wrappedDocument;
};
