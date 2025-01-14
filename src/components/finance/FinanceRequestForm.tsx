import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const FinanceRequestForm = () => {
  console.log("FinanceRequestForm - Rendering");

  const financeTypes = [
    "Accounts Receivable (Invoice)",
    "Trade Document (Bill of Lading)",
    "Fixed Term Agreement (30 days)",
    "Fixed Term Agreement (60 days)",
    "Fixed Term Agreement (90 days)",
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="financeType" className="text-sm font-medium">
          Finance Type
        </label>
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select finance type" />
          </SelectTrigger>
          <SelectContent>
            {financeTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};