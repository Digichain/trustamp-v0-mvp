import { Card } from "@/components/ui/card";
import { FileUploader } from '@/components/transactions/verification/FileUploader';
import { Check, X, AlertOctagon, Info } from "lucide-react";

interface ComplianceStatus {
  parameter: string;
  status: 'Compliant' | 'Non-Compliant';
  actionRequired: string;
}

const complianceStatuses: ComplianceStatus[] = [
  {
    parameter: "Product Classification (HS)",
    status: "Compliant",
    actionRequired: "None"
  },
  {
    parameter: "Sanctions & Embargoes",
    status: "Compliant",
    actionRequired: "None"
  },
  {
    parameter: "Legal Entity Identifier (LEI)",
    status: "Non-Compliant",
    actionRequired: "Obtain LEI for Party A"
  },
  {
    parameter: "Biosecurity Certification",
    status: "Compliant",
    actionRequired: "None"
  },
  {
    parameter: "ESG Compliance",
    status: "Non-Compliant",
    actionRequired: "Review sustainability policies"
  },
  {
    parameter: "Port Authority Clearance",
    status: "Compliant",
    actionRequired: "None"
  }
];

const StatusIcon = ({ status }: { status: string }) => {
  if (status === 'Compliant') {
    return <Check className="h-5 w-5 text-green-500" />;
  }
  return <X className="h-5 w-5 text-red-500" />;
};

export default function Compliance() {
  const processFile = async (file: File) => {
    console.log("Processing file for compliance verification:", file.name);
    // Mock processing - would be replaced with actual verification logic
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Compliance</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left side - Document Verification */}
        <Card className="p-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Verify Document Compliance</h2>
            <p className="text-gray-600 text-sm">
              Drag and drop your document to verify its compliance status
            </p>
            <div className="max-w-full">
              <FileUploader onFileProcess={processFile} />
            </div>
          </div>
        </Card>

        {/* Right side - Compliance Status */}
        <Card className="p-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Compliance Status</h2>
            <div className="space-y-4">
              {complianceStatuses.map((item, index) => (
                <div 
                  key={index}
                  className="flex items-start justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <StatusIcon status={item.status} />
                      <span className="font-medium">{item.parameter}</span>
                    </div>
                    <div className="flex items-center gap-2 ml-7">
                      <span className="text-sm text-gray-600">
                        Status: <span className={item.status === 'Compliant' ? 'text-green-600' : 'text-red-600'}>
                          {item.status}
                        </span>
                      </span>
                    </div>
                    {item.actionRequired !== 'None' && (
                      <div className="flex items-center gap-2 ml-7">
                        <AlertOctagon className="h-4 w-4 text-amber-500" />
                        <span className="text-sm text-amber-600">
                          Action Required: {item.actionRequired}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}