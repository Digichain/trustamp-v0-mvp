import { createHash } from 'crypto';

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
  const hash = createHash('sha256');
  hash.update(JSON.stringify(data));
  return '0x' + hash.digest('hex');
};

const saltData = (data: any): any => {
  const salt = () => crypto.randomUUID();
  
  if (Array.isArray(data)) {
    return data.map(item => saltData(item));
  }
  
  if (typeof data === 'object' && data !== null) {
    const salted: any = {};
    for (const key in data) {
      if (typeof data[key] === 'string') {
        salted[key] = `${salt()}:string:${data[key]}`;
      } else {
        salted[key] = saltData(data[key]);
      }
    }
    return salted;
  }
  
  return data;
};

export const wrapDocument = (rawDocument: any): WrappedDocument => {
  const saltedData = saltData(rawDocument);
  const targetHash = generateHash(saltedData);
  
  return {
    version: "https://schema.openattestation.com/2.0/schema.json",
    data: saltedData,
    signature: {
      type: "SHA3MerkleProof",
      targetHash,
      proof: [],
      merkleRoot: targetHash
    }
  };
};