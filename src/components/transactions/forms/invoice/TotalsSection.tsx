import { Input } from "@/components/ui/input";

interface TotalsSectionProps {
  subtotal: number;
  tax: number;
  taxTotal: number;
  total: number;
  onTaxChange: (value: number) => void;
}

export const TotalsSection = ({
  subtotal,
  tax,
  taxTotal,
  total,
  onTaxChange,
}: TotalsSectionProps) => {
  console.log("TotalsSection - Rendering with values:", { subtotal, tax, taxTotal, total });
  
  const handleTaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      onTaxChange(value);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <div className="w-1/3 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${Number(subtotal).toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Tax (%):</span>
            <Input
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={tax || 0}
              onChange={handleTaxChange}
              className="w-20"
            />
          </div>
          <div className="flex justify-between">
            <span>Tax Amount:</span>
            <span>${Number(taxTotal).toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>${Number(total).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};