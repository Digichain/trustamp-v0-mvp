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

  return (
    <Alert>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>DNS Configuration Required</AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-2">
          To enable document verification, add the following TXT record to your DNS configuration at{" "}
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
  );
};