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
  const jsonString = JSON.stringify(data);
  const wordArray = CryptoJS.SHA3(jsonString, { outputLength: 256 });
  // Remove the '0x' prefix to ensure correct byte length
  return wordArray.toString(CryptoJS.enc.Hex);
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
    for (const key in data) {
      if (data[key] === null || data[key] === undefined) {
        salted[key] = data[key];
      } else if (typeof data[key] === 'object') {
        salted[key] = saltData(data[key]);
      } else {
        // Generate a UUID as salt
        const salt = generateSalt();
        // Create the salted value in the format: "salt:type:value"
        salted[key] = `${salt}:${typeof data[key]}:${data[key]}`;
      }
    }
    return salted;
  }
  
  return data;
};

export const wrapDocument = (rawDocument: any): WrappedDocument => {
  console.log("Starting document wrapping process with raw document:", rawDocument);

  // Ensure the document has the required OpenAttestation structure
  const documentWithTemplate = {
    ...rawDocument,
    $template: {
      name: "INVOICE",
      type: "EMBEDDED_RENDERER",
      url: "https://generic-templates.openattestation.com"
    }
  };

  // Salt the data according to OpenAttestation format
  const saltedData = saltData(documentWithTemplate);
  console.log("Document salted with UUIDs:", saltedData);
  
  // Generate the target hash using SHA3
  const targetHash = generateHash(saltedData);
  console.log("Generated target hash:", targetHash);
  
  // Create the wrapped document with merkle root
  const wrappedDoc: WrappedDocument = {
    version: "https://schema.openattestation.com/2.0/schema.json",
    data: saltedData,
    signature: {
      type: "SHA3MerkleProof",
      targetHash,
      proof: [],
      merkleRoot: targetHash // For single documents, merkleRoot is the same as targetHash
    }
  };

  console.log("Final wrapped document structure:", wrappedDoc);
  return wrappedDoc;
};