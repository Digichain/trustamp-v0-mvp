import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Copy, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDNSTxtRecord } from "@/utils/dns-record-types";

interface DNSRecordDisplayProps {
  dnsLocation: string;
  contractAddress: string;
}

export const DNSRecordDisplay = ({ dnsLocation, contractAddress }: DNSRecordDisplayProps) => {
  const { toast } = useToast();

  const handleCopyDnsRecord = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const dnsRecord = formatDNSTxtRecord(contractAddress);
    navigator.clipboard.writeText(dnsRecord);
    toast({
      title: "Copied",
      description: "DNS TXT record copied to clipboard",
    });
  };

  const handleCopyAddress = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(contractAddress);
    toast({
      title: "Copied",
      description: "Document Store address copied to clipboard",
    });
  };

  return (
    <div className="space-y-4">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Document Store Deployed</AlertTitle>
        <AlertDescription>
          <div className="mt-2 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Contract Address:</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyAddress}
                className="h-8"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <code className="block bg-gray-100 p-2 rounded text-sm break-all">
              {contractAddress}
            </code>
          </div>
        </AlertDescription>
      </Alert>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>DNS Configuration Required</AlertTitle>
        <AlertDescription>
          <p className="mt-2 mb-2">
            Add the following TXT record to your DNS configuration at{" "}
            <code className="bg-gray-100 px-1 rounded">{dnsLocation}</code>:
          </p>
          <div className="bg-gray-100 p-3 rounded-md relative group">
            <code className="text-sm break-all">
              {formatDNSTxtRecord(contractAddress)}
            </code>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleCopyDnsRecord}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};