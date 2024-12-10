import { Input } from "@/components/ui/input";

interface BillToSectionProps {
  billTo: {
    company: {
      name: string;
      streetAddress: string;
    };
    name: string;
    email: string;
  };
  onInputChange: (section: string, field: string, value: string) => void;
}

export const BillToSection = ({ billTo, onInputChange }: BillToSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Bill To</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Company Name</label>
          <Input
            value={billTo.company.name}
            onChange={(e) => onInputChange("company", "name", e.target.value)}
            placeholder="Company Name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Street Address</label>
          <Input
            value={billTo.company.streetAddress}
            onChange={(e) => onInputChange("company", "streetAddress", e.target.value)}
            placeholder="Street Address"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Contact Name</label>
          <Input
            value={billTo.name}
            onChange={(e) => onInputChange("", "name", e.target.value)}
            placeholder="Contact Name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input
            type="email"
            value={billTo.email}
            onChange={(e) => onInputChange("", "email", e.target.value)}
            placeholder="Email"
          />
        </div>
      </div>
    </div>
  );
};