interface ContractStatusProps {
  status: string;
}

export const ContractStatus = ({ status }: ContractStatusProps) => {
  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'held in escrow':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'outstanding':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusStyles(status)}`}>
      {status}
    </span>
  );
};