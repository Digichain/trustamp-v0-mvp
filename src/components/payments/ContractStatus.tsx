interface ContractStatusProps {
  status: string;
}

export const ContractStatus = ({ status }: ContractStatusProps) => {
  return (
    <span className={`px-2 py-1 rounded-full text-xs ${
      status === 'paid' ? 'bg-green-100 text-green-800' :
      status === 'held in escrow' ? 'bg-blue-100 text-blue-800' :
      'bg-yellow-100 text-yellow-800'
    }`}>
      {status}
    </span>
  );
};