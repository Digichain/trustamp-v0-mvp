import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BillFromSectionProps {
  billFrom: {
    name: string;
    streetAddress: string;
    city: string;
    postalCode: string;
    phoneNumber?: string;
  };
  onInputChange: (field: string, value: string) => void;
}

export const BillFromSection = ({ billFrom, onInputChange }: BillFromSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Bill From</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Company Name</Label>
          <Input
            value={billFrom.name || ""}
            onChange={(e) => onInputChange("name", e.target.value)}
            placeholder="Company Name"
          />
        </div>
        <div>
          <Label>Street Address</Label>
          <Input
            value={billFrom.streetAddress || ""}
            onChange={(e) => onInputChange("streetAddress", e.target.value)}
            placeholder="Street Address"
          />
        </div>
        <div>
          <Label>City</Label>
          <Input
            value={billFrom.city || ""}
            onChange={(e) => onInputChange("city", e.target.value)}
            placeholder="City"
          />
        </div>
        <div>
          <Label>Postal Code</Label>
          <Input
            value={billFrom.postalCode || ""}
            onChange={(e) => onInputChange("postalCode", e.target.value)}
            placeholder="Postal Code"
          />
        </div>
        <div>
          <Label>Phone Number</Label>
          <Input
            value={billFrom.phoneNumber || ""}
            onChange={(e) => onInputChange("phoneNumber", e.target.value)}
            placeholder="Phone Number"
          />
        </div>
      </div>
    </div>
  );
};