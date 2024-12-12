import { CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface VerificationStatusProps {
  title: string;
  isValid: boolean;
  message: string;
  details?: Record<string, any>;
}

export const VerificationStatus = ({ title, isValid, message, details }: VerificationStatusProps) => {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          {isValid ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500" />
          )}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`text-sm ${isValid ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
        {details && (
          <div className="mt-2 text-sm text-gray-600">
            {Object.entries(details).map(([key, value]) => (
              <p key={key}>{`${key}: ${value}`}</p>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};