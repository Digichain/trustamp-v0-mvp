import { FC } from "react";
import { VerificationFragment } from "./types/verificationTypes";
import { CheckCircle2, XCircle } from "lucide-react";

interface VerificationStatusProps {
  fragments: VerificationFragment[];
  showPreview: boolean;
  setShowPreview: (show: boolean) => void;
}

export const VerificationStatus: FC<VerificationStatusProps> = ({
  fragments,
  showPreview,
  setShowPreview
}) => {
  const isValid = fragments.every((fragment) => fragment.status === "VALID");

  // Update preview visibility based on verification status
  if (!isValid && showPreview) {
    setShowPreview(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <span className="font-semibold">Verification Status:</span>
        {isValid ? (
          <div className="flex items-center text-green-600">
            <CheckCircle2 className="w-5 h-5 mr-1" />
            <span>Valid</span>
          </div>
        ) : (
          <div className="flex items-center text-red-600">
            <XCircle className="w-5 h-5 mr-1" />
            <span>Invalid</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        {fragments.map((fragment, index) => (
          <div
            key={index}
            className={`flex items-center space-x-2 ${
              fragment.status === "VALID" ? "text-green-600" : "text-red-600"
            }`}
          >
            {fragment.status === "VALID" ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <XCircle className="w-4 h-4" />
            )}
            <span>{fragment.name}</span>
            {fragment.status !== "VALID" && fragment.reason && (
              <span className="text-sm">- {fragment.reason}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};