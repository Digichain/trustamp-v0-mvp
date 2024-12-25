interface TransactionStatusProps {
  status: string;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "document_created":
      return "text-blue-600";
    case "document_wrapped":
      return "text-purple-600";
    case "document_signed":
      return "text-orange-600";
    case "document_issued":
      return "text-green-600";
    case "failed":
      return "text-red-600";
    default:
      return "text-gray-600";
  }
};

const getStatusDisplay = (status: string) => {
  switch (status.toLowerCase()) {
    case "document_created":
      return "Created";
    case "document_wrapped":
      return "Wrapped";
    case "document_signed":
      return "Signed";
    case "document_issued":
      return "Issued";
    case "failed":
      return "Failed";
    default:
      return status;
  }
};

export const TransactionStatus = ({ status }: TransactionStatusProps) => {
  return (
    <span className={getStatusColor(status)}>
      {getStatusDisplay(status)}
    </span>
  );
};