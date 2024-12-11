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
  // Ensure all values are numbers and default to 0 if undefined
  const safeSubtotal = Number(subtotal) || 0;
  const safeTax = Number(tax) || 0;
  const safeTaxTotal = Number(taxTotal) || 0;
  const safeTotal = Number(total) || 0;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <div className="w-1/3 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${safeSubtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Tax (%):</span>
            <Input
              type="number"
              value={safeTax}
              onChange={(e) => onTaxChange(Number(e.target.value))}
              className="w-20"
            />
          </div>
          <div className="flex justify-between">
            <span>Tax Amount:</span>
            <span>${safeTaxTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>${safeTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};