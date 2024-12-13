import CryptoJS from 'crypto-js';

interface WrappedDocument {
  version: string;
  data: {
    id: string;
    $template: {
      name: string;
      type: string;
      url: string;
    };
    issuers: Array<{
      id: string;
      name: string;
      revocation: {
        type: string;
      };
      identityProof: {
        type: string;
        location: string;
        key: string;
      };
    }>;
    network: {
      chain: string;
      chainId: string;
    };
    recipient: {
      name: string;
      company: any;
    };
    invoiceDetails: any;
  };
  signature: {
    type: string;
    targetHash: string;
    proof: any[];
    merkleRoot: string;
  };
}

const generateHash = (data: any): string => {
  const jsonString = JSON.stringify(data, Object.keys(data).sort());
  console.log("Generating hash for data:", jsonString);
  
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
    for (const key of Object.keys(data).sort()) {
      // Skip salting the version field if it exists in the data
      if (key === 'version') {
        continue;
      }
      
      if (data[key] === null || data[key] === undefined) {
        salted[key] = data[key];
      } else if (typeof data[key] === 'object') {
        salted[key] = saltData(data[key]);
      } else {
        const salt = generateSalt();
        const type = typeof data[key];
        salted[key] = `${salt}:${type}:${data[key]}`;
      }
    }
    return salted;
  }
  
  return data;
};

export const wrapDocument = (rawDocument: any): WrappedDocument => {
  console.log("Starting document wrapping process with raw document:", rawDocument);

  // Remove version from raw document if it exists to prevent duplication
  const { version, ...documentWithoutVersion } = rawDocument;

  // Ensure document has required fields
  if (!documentWithoutVersion.id || !documentWithoutVersion.$template) {
    console.error("Document missing required fields:", documentWithoutVersion);
    throw new Error("Document must have id and $template fields");
  }

  // Sort all object keys for consistent ordering
  const sortedDocument = JSON.parse(JSON.stringify(documentWithoutVersion, Object.keys(documentWithoutVersion).sort()));
  console.log("Document with sorted keys:", sortedDocument);

  // Salt all the data
  const saltedData = saltData(sortedDocument);
  console.log("Document salted with UUIDs:", saltedData);
  
  // Generate the target hash from the salted data
  const targetHash = generateHash(saltedData);
  console.log("Generated target hash:", targetHash);
  
  // For single documents, merkle root is the same as target hash
  const merkleRoot = targetHash;
  console.log("Using merkle root:", merkleRoot);

  // Create wrapped document with data nesting
  const wrappedDoc: WrappedDocument = {
    version: "https://schema.openattestation.com/2.0/schema.json",
    data: saltedData,
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