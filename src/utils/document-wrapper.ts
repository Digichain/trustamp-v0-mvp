import CryptoJS from 'crypto-js';

interface WrappedDocument {
  version: string;
  data: any;
  signature: {
    type: string;
    targetHash: string;
    proof: any[];
    merkleRoot: string;
  };
}

const generateHash = (data: any): string => {
  // Convert the data to a canonical form
  const jsonString = JSON.stringify(data, Object.keys(data).sort());
  console.log("Generating hash for data:", jsonString);
  
  // Use SHA3-256 for hashing
  const wordArray = CryptoJS.SHA3(jsonString, { outputLength: 256 });
  const hash = wordArray.toString(CryptoJS.enc.Hex);
  console.log("Generated hash:", hash);
  
  return hash;
};

const generateSalt = (): string => {
  return crypto.randomUUID();
};

const saltData = (data: any): any => {
  if (Array.isArray(data)) {
    return data.map(item => saltData(item));
  }
  
  if (typeof data === 'object' && data !== null) {
    const salted: any = {};
    for (const key of Object.keys(data).sort()) { // Sort keys for consistent ordering
      if (data[key] === null || data[key] === undefined) {
        salted[key] = data[key];
      } else if (typeof data[key] === 'object') {
        salted[key] = saltData(data[key]);
      } else {
        const salt = generateSalt();
        salted[key] = `${salt}:${typeof data[key]}:${data[key]}`;
      }
    }
    return salted;
  }
  
  return data;
};

export const wrapDocument = (rawDocument: any): WrappedDocument => {
  console.log("Starting document wrapping process with raw document:", rawDocument);

  // Ensure document ID exists in the raw document
  if (!rawDocument.data?.id) {
    console.error("Document data or ID is missing:", rawDocument);
    throw new Error("Document ID is required for wrapping");
  }

  // Preserve the original document ID before salting
  const documentId = rawDocument.data.id;
  console.log("Preserving document ID:", documentId);

  // Sort all object keys for consistent ordering
  const sortedDocument = JSON.parse(JSON.stringify(rawDocument, Object.keys(rawDocument).sort()));
  console.log("Document with sorted keys:", sortedDocument);

  // Salt the data
  const saltedData = saltData(sortedDocument);
  console.log("Document salted with UUIDs:", saltedData);
  
  // Generate the target hash
  const targetHash = generateHash(saltedData);
  console.log("Generated target hash:", targetHash);
  
  // For single documents, merkle root is the same as target hash
  const merkleRoot = targetHash;
  console.log("Using merkle root:", merkleRoot);

  // Create wrapped document with preserved ID
  const wrappedDoc: WrappedDocument = {
    version: "https://schema.openattestation.com/2.0/schema.json",
    data: {
      ...saltedData,
      id: documentId // Ensure ID is preserved unsalted
    },
    signature: {
      type: "SHA3MerkleProof",
      targetHash,
      proof: [],
      merkleRoot
    }
  };

  console.log("Final wrapped document structure:", wrappedDoc);
  return wrappedDoc;
};