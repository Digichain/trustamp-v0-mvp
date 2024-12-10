import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BillToSectionProps {
  billTo: {
    company: {
      name: string;
      streetAddress: string;
      city: string;
      postalCode: string;
      phoneNumber: string;
    };
    name: string;
    email: string;
  };
  onInputChange: (section: string, field: string, value: string) => void;
}

export const BillToSection = ({ billTo, onInputChange }: BillToSectionProps) => {
  const handleCompanyInput = (field: string, value: string) => {
    onInputChange("billTo", `company.${field}`, value);
  };

  const handlePersonalInput = (field: string, value: string) => {
    onInputChange("billTo", field, value);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Bill To</h3>
      
      <div className="space-y-4">
        <div>
          <Label>Company Name</Label>
          <Input
            value={billTo.company.name}
            onChange={(e) => handleCompanyInput("name", e.target.value)}
            placeholder="Enter company name"
          />
        </div>
        
        <div>
          <Label>Street Address</Label>
          <Input
            value={billTo.company.streetAddress}
            onChange={(e) => handleCompanyInput("streetAddress", e.target.value)}
            placeholder="Enter street address"
          />
        </div>

        <div>
          <Label>Contact Person Name</Label>
          <Input
            value={billTo.name}
            onChange={(e) => handlePersonalInput("name", e.target.value)}
            placeholder="Enter contact person name"
          />
        </div>

        <div>
          <Label>Contact Email</Label>
          <Input
            value={billTo.email}
            onChange={(e) => handlePersonalInput("email", e.target.value)}
            placeholder="Enter contact email"
          />
        </div>
      </div>
    </div>
  );
};