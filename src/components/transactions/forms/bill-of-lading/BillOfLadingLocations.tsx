import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BillOfLadingLocationsProps {
  formData: {
    portOfLoading: string;
    portOfDischarge: string;
    placeOfReceipt: string;
    placeOfDelivery: string;
  };
  onInputChange: (field: string, value: string) => void;
  isSubmitting: boolean;
}

export const BillOfLadingLocations = ({
  formData,
  onInputChange,
  isSubmitting
}: BillOfLadingLocationsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label>Port of Loading</Label>
        <Input
          value={formData.portOfLoading}
          onChange={(e) => onInputChange("portOfLoading", e.target.value)}
          placeholder="Port of Loading"
          disabled={isSubmitting}
        />
      </div>
      <div>
        <Label>Port of Discharge</Label>
        <Input
          value={formData.portOfDischarge}
          onChange={(e) => onInputChange("portOfDischarge", e.target.value)}
          placeholder="Port of Discharge"
          disabled={isSubmitting}
        />
      </div>
      <div>
        <Label>Place of Receipt</Label>
        <Input
          value={formData.placeOfReceipt}
          onChange={(e) => onInputChange("placeOfReceipt", e.target.value)}
          placeholder="Place of Receipt"
          disabled={isSubmitting}
        />
      </div>
      <div>
        <Label>Place of Delivery</Label>
        <Input
          value={formData.placeOfDelivery}
          onChange={(e) => onInputChange("placeOfDelivery", e.target.value)}
          placeholder="Place of Delivery"
          disabled={isSubmitting}
        />
      </div>
    </div>
  );
};