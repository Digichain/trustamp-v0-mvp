import { FC } from "react";
import { type VerificationFragment } from "./types/verificationTypes";
import { CheckCircle2, XCircle } from "lucide-react";

interface VerificationStatusProps {
  title: string;
  isValid: boolean;
  message: string;
  details?: {
    name?: string;
    domain?: string;
  };
}

export const VerificationStatus: FC<VerificationStatusProps> = ({
  title,
  isValid,
  message,
  details
}) => {
  return (
    <div className="p-4 rounded-lg border">
      <div className="flex items-center space-x-2 mb-2">
        {isValid ? (
          <CheckCircle2 className="w-5 h-5 text-green-500" />
        ) : (
          <XCircle className="w-5 h-5 text-red-500" />
        )}
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className={`text-sm ${isValid ? 'text-green-600' : 'text-red-600'}`}>
        {message}
      </p>
      {details && (
        <div className="mt-2 text-sm text-gray-600">
          {details.name && <p>Name: {details.name}</p>}
          {details.domain && <p>Domain: {details.domain}</p>}
        </div>
      )}
    </div>
  );
};