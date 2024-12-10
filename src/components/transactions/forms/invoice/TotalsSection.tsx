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
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <div className="w-1/3 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Tax (%):</span>
            <Input
              type="number"
              value={tax}
              onChange={(e) => onTaxChange(Number(e.target.value))}
              className="w-20"
            />
          </div>
          <div className="flex justify-between">
            <span>Tax Amount:</span>
            <span>${taxTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};