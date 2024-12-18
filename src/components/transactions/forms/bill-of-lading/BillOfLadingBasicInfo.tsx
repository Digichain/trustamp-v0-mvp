import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BillOfLadingBasicInfoProps {
  formData: {
    scac: string;
    blNumber: string;
    vessel: string;
    voyageNo: string;
    carrierName: string;
  };
  onInputChange: (field: string, value: string) => void;
  isSubmitting: boolean;
}

export const BillOfLadingBasicInfo = ({
  formData,
  onInputChange,
  isSubmitting
}: BillOfLadingBasicInfoProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label>SCAC</Label>
        <Input
          value={formData.scac}
          onChange={(e) => onInputChange("scac", e.target.value)}
          placeholder="Standard Carrier Alpha Code"
          disabled={isSubmitting}
        />
      </div>
      <div>
        <Label>BL Number</Label>
        <Input
          value={formData.blNumber}
          onChange={(e) => onInputChange("blNumber", e.target.value)}
          placeholder="Bill of Lading Number"
          disabled={isSubmitting}
        />
      </div>
      <div>
        <Label>Vessel</Label>
        <Input
          value={formData.vessel}
          onChange={(e) => onInputChange("vessel", e.target.value)}
          placeholder="Vessel Name"
          disabled={isSubmitting}
        />
      </div>
      <div>
        <Label>Voyage No</Label>
        <Input
          value={formData.voyageNo}
          onChange={(e) => onInputChange("voyageNo", e.target.value)}
          placeholder="Voyage Number"
          disabled={isSubmitting}
        />
      </div>
      <div>
        <Label>Carrier Name</Label>
        <Input
          value={formData.carrierName}
          onChange={(e) => onInputChange("carrierName", e.target.value)}
          placeholder="Carrier Name"
          disabled={isSubmitting}
        />
      </div>
    </div>
  );
};