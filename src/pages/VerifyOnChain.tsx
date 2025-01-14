import { Navigation } from "@/components/landing/Navigation";
import { FileUploader } from "@/components/transactions/verification/FileUploader";
import { DocumentVerificationStatus } from "@/components/transactions/verification/DocumentVerificationStatus";
import { useState } from "react";

const VerifyOnChain = () => {
  const [file, setFile] = useState<File | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (uploadedFile: File) => {
    setFile(uploadedFile);
    setError(null);
    setVerificationStatus(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 pt-24">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
            <h1 className="text-2xl font-bold mb-2">Verify Document On-Chain</h1>
            <p className="text-gray-600 mb-6">
              Upload a document to verify its authenticity and integrity on the blockchain.
            </p>

            <div className="space-y-6">
              <FileUploader onFileUpload={handleFileUpload} />

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              {verificationStatus && (
                <DocumentVerificationStatus status={verificationStatus} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOnChain;