import { Badge } from "@/components/ui/badge";

interface DocumentStatusProps {
  status: string;
}

export const DocumentStatus = ({ status }: DocumentStatusProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'document_created':
        return 'bg-blue-500';
      case 'document_wrapped':
        return 'bg-purple-500';
      case 'document_signed':
        return 'bg-green-500';
      case 'document_issued':
        return 'bg-emerald-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Badge className={`${getStatusColor(status)} text-white`}>
      {status.replace(/_/g, ' ')}
    </Badge>
  );
};