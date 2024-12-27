import { Card } from "@/components/ui/card";

interface BillOfLadingTemplateProps {
  document: any;
}

export const BillOfLadingTemplate = ({ document }: BillOfLadingTemplateProps) => {
  console.log("Rendering Bill of Lading template with document:", document);

  // Helper function to get clean value from wrapped data
  const getCleanValue = (value: any) => {
    if (typeof value === 'string' && value.includes(':string:')) {
      return value.split(':string:')[1];
    }
    if (typeof value === 'string' && value.includes(':number:')) {
      return Number(value.split(':number:')[1]);
    }
    return value;
  };

  // Clean up the document data
  const details = {
    scac: getCleanValue(document.billOfLadingDetails?.scac),
    blNumber: getCleanValue(document.billOfLadingDetails?.blNumber),
    vessel: getCleanValue(document.billOfLadingDetails?.vessel),
    voyageNo: getCleanValue(document.billOfLadingDetails?.voyageNo),
    portOfLoading: getCleanValue(document.billOfLadingDetails?.portOfLoading),
    portOfDischarge: getCleanValue(document.billOfLadingDetails?.portOfDischarge),
    carrierName: getCleanValue(document.billOfLadingDetails?.carrierName),
    placeOfReceipt: getCleanValue(document.billOfLadingDetails?.placeOfReceipt),
    placeOfDelivery: getCleanValue(document.billOfLadingDetails?.placeOfDelivery)
  };

  const packages = Array.isArray(document.billOfLadingDetails?.packages) 
    ? document.billOfLadingDetails.packages.map((pkg: any) => ({
        description: getCleanValue(pkg.description),
        weight: getCleanValue(pkg.weight),
        measurement: getCleanValue(pkg.measurement)
      }))
    : [];

  const parties = {
    shipper: {
      name: getCleanValue(document.billOfLadingDetails?.shipper?.name),
      address: getCleanValue(document.billOfLadingDetails?.shipper?.address)
    },
    consignee: {
      name: getCleanValue(document.billOfLadingDetails?.consignee?.name),
      address: getCleanValue(document.billOfLadingDetails?.consignee?.address)
    },
    notifyParty: {
      name: getCleanValue(document.billOfLadingDetails?.notifyParty?.name),
      address: getCleanValue(document.billOfLadingDetails?.notifyParty?.address)
    }
  };

  return (
    <Card className="p-6 space-y-6 bg-white print:shadow-none">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold">Bill of Lading #{details.blNumber || 'N/A'}</h2>
        <p className="text-gray-600">SCAC: {details.scac || 'N/A'}</p>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <h3 className="font-semibold mb-2">Vessel Details</h3>
          <div className="space-y-1">
            <p><span className="font-medium">Vessel:</span> {details.vessel || 'N/A'}</p>
            <p><span className="font-medium">Voyage No:</span> {details.voyageNo || 'N/A'}</p>
            <p><span className="font-medium">Carrier:</span> {details.carrierName || 'N/A'}</p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Port Information</h3>
          <div className="space-y-1">
            <p><span className="font-medium">Port of Loading:</span> {details.portOfLoading || 'N/A'}</p>
            <p><span className="font-medium">Port of Discharge:</span> {details.portOfDischarge || 'N/A'}</p>
            <p><span className="font-medium">Place of Receipt:</span> {details.placeOfReceipt || 'N/A'}</p>
            <p><span className="font-medium">Place of Delivery:</span> {details.placeOfDelivery || 'N/A'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div>
          <h3 className="font-semibold mb-2">Shipper</h3>
          <div className="space-y-1">
            <p className="font-medium">{parties.shipper.name || 'N/A'}</p>
            <p className="whitespace-pre-line">{parties.shipper.address || 'N/A'}</p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Consignee</h3>
          <div className="space-y-1">
            <p className="font-medium">{parties.consignee.name || 'N/A'}</p>
            <p className="whitespace-pre-line">{parties.consignee.address || 'N/A'}</p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Notify Party</h3>
          <div className="space-y-1">
            <p className="font-medium">{parties.notifyParty.name || 'N/A'}</p>
            <p className="whitespace-pre-line">{parties.notifyParty.address || 'N/A'}</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Packages</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Description</th>
              <th className="text-right py-2">Weight</th>
              <th className="text-right py-2">Measurement</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((pkg: any, index: number) => (
              <tr key={index} className="border-b">
                <td className="py-2">{pkg.description || 'N/A'}</td>
                <td className="text-right py-2">{pkg.weight || 'N/A'}</td>
                <td className="text-right py-2">{pkg.measurement || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};