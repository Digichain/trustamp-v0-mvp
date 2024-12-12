import { Card } from "@/components/ui/card";
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

export const VerificationStatus = ({
  title,
  isValid,
  message,
  details
}: VerificationStatusProps) => {
  // Ensure message is a string
  const displayMessage = typeof message === 'string' ? message : 'Verification status unavailable';

  return (
    <Card className="p-6">
      <div className="flex items-start space-x-4">
        <div className="mt-1">
          {isValid ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-1">{title}</h3>
          <p className="text-gray-600">{displayMessage}</p>
          {details && (
            <div className="mt-2 text-sm text-gray-500">
              {details.name && <p>Name: {details.name}</p>}
              {details.domain && <p>Domain: {details.domain}</p>}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};