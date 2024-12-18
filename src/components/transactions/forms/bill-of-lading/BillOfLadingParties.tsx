import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Party {
  name: string;
  address: string;
}

interface BillOfLadingPartiesProps {
  formData: {
    shipper: Party;
    consignee: Party;
    notifyParty: Party;
  };
  onPartyChange: (party: string, field: string, value: string) => void;
  isSubmitting: boolean;
}

export const BillOfLadingParties = ({
  formData,
  onPartyChange,
  isSubmitting
}: BillOfLadingPartiesProps) => {
  return (
    <div className="space-y-6">
      {["shipper", "consignee", "notifyParty"].map((party) => (
        <div key={party} className="space-y-4">
          <h3 className="text-lg font-semibold capitalize">{party.replace(/([A-Z])/g, ' $1').trim()}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Name</Label>
              <Input
                value={formData[party as keyof typeof formData].name}
                onChange={(e) => onPartyChange(party, "name", e.target.value)}
                placeholder="Name"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <Label>Address</Label>
              <Textarea
                value={formData[party as keyof typeof formData].address}
                onChange={(e) => onPartyChange(party, "address", e.target.value)}
                placeholder="Address"
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};