import { Input } from "@/components/ui/input";

interface BillFromSectionProps {
  billFrom: {
    name: string;
    streetAddress: string;
    city: string;
    postalCode: string;
  };
  onInputChange: (field: string, value: string) => void;
}

export const BillFromSection = ({ billFrom, onInputChange }: BillFromSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Bill From</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Company Name</label>
          <Input
            value={billFrom.name}
            onChange={(e) => onInputChange("name", e.target.value)}
            placeholder="Company Name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Street Address</label>
          <Input
            value={billFrom.streetAddress}
            onChange={(e) => onInputChange("streetAddress", e.target.value)}
            placeholder="Street Address"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">City</label>
          <Input
            value={billFrom.city}
            onChange={(e) => onInputChange("city", e.target.value)}
            placeholder="City"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Postal Code</label>
          <Input
            value={billFrom.postalCode}
            onChange={(e) => onInputChange("postalCode", e.target.value)}
            placeholder="Postal Code"
          />
        </div>
      </div>
    </div>
  );
};