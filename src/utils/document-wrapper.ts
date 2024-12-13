import CryptoJS from 'crypto-js';
import { ethers } from 'ethers';

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
  console.log("Starting data salting process with:", data);

  if (Array.isArray(data)) {
    return data.map(item => saltData(item));
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
        salted[key] = saltData(data[key]);
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

// Convert hex to bytes format
const toBytes = (hex: string): Uint8Array => {
  return ethers.utils.arrayify(hex);
};

export const wrapDocument = (rawDocument: any): WrappedDocument => {
  console.log("Starting document wrapping process with raw document:", rawDocument);

  // Salt the document data
  const saltedData = saltData(rawDocument);
  console.log("Document data after salting:", saltedData);

  // Generate document hash
  const documentHash = generateHash(saltedData);
  console.log("Generated document hash:", documentHash);

  // Create wrapped document structure
  const wrappedDoc: WrappedDocument = {
    version: "2.0",
    data: saltedData,
    signature: {
      type: "SHA3MerkleProof",
      targetHash: documentHash,
      proof: [],
      merkleRoot: documentHash
    }
  };

  console.log("Final wrapped document structure:", wrappedDoc);
  return wrappedDoc;
};