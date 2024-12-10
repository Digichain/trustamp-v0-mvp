import { Card } from "@/components/ui/card";

interface BillOfLadingPreviewProps {
  data: any; // We'll type this properly when implementing OpenAttestation
}

export const BillOfLadingPreview = ({ data }: BillOfLadingPreviewProps) => {
  return (
    <Card className="p-6 space-y-6 bg-white">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold">Bill of Lading</h2>
        <p className="text-gray-600">BL Number: {data.blNumber}</p>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Company Information</h3>
          <p>{data.companyName}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <div key={num}>
              <h4 className="font-medium">Field {num}</h4>
              <p>{data[`field${num}`]}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};