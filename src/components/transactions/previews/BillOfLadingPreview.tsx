import { Card } from "@/components/ui/card";

interface Party {
  name: string;
  address: string;
}

interface Package {
  description: string;
  weight: string;
  measurement: string;
}

interface BillOfLadingData {
  scac: string;
  blNumber: string;
  vessel: string;
  voyageNo: string;
  carrierName: string;
  portOfLoading: string;
  portOfDischarge: string;
  placeOfReceipt: string;
  placeOfDelivery: string;
  shipper: Party;
  consignee: Party;
  notifyParty: Party;
  packages: Package[];
}

interface BillOfLadingPreviewProps {
  data: BillOfLadingData;
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
          <h3 className="font-semibold mb-2">Basic Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">SCAC</p>
              <p>{data.scac}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Vessel</p>
              <p>{data.vessel}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Voyage No</p>
              <p>{data.voyageNo}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Carrier Name</p>
              <p>{data.carrierName}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Locations</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Port of Loading</p>
              <p>{data.portOfLoading}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Port of Discharge</p>
              <p>{data.portOfDischarge}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Place of Receipt</p>
              <p>{data.placeOfReceipt}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Place of Delivery</p>
              <p>{data.placeOfDelivery}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Parties</h3>
          <div className="space-y-4">
            {['shipper', 'consignee', 'notifyParty'].map((party) => (
              <div key={party} className="border-b pb-2">
                <h4 className="font-medium capitalize mb-1">
                  {party.replace(/([A-Z])/g, ' $1').trim()}
                </h4>
                <p>{data[party as keyof typeof data].name}</p>
                <p className="text-sm text-gray-500">
                  {data[party as keyof typeof data].address}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Packages</h3>
          <div className="space-y-2">
            {data.packages.map((pkg, index) => (
              <div key={index} className="border-b pb-2">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Description</p>
                    <p>{pkg.description}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Weight</p>
                    <p>{pkg.weight}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Measurement</p>
                    <p>{pkg.measurement}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};