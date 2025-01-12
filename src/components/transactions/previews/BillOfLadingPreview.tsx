interface BillOfLadingPreviewProps {
  data: any;
}

export const BillOfLadingPreview = ({ data }: BillOfLadingPreviewProps) => {
  if (!data) {
    return <div>No bill of lading data available</div>;
  }

  const details = data.billOfLadingDetails || {};
  const shipper = details.shipper || {};
  const consignee = details.consignee || {};
  const notifyParty = details.notifyParty || {};
  const packages = details.packages || [];

  return (
    <div className="space-y-6 p-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold mb-2">Carrier Details</h3>
          <div className="text-sm">
            <p>SCAC: {details.scac || 'N/A'}</p>
            <p>Carrier Name: {details.carrierName || 'N/A'}</p>
            <p>Vessel: {details.vessel || 'N/A'}</p>
            <p>Voyage No: {details.voyageNo || 'N/A'}</p>
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-2">B/L Details</h3>
          <div className="text-sm">
            <p>B/L Number: {details.blNumber || 'N/A'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <h3 className="font-semibold mb-2">Shipper</h3>
          <div className="text-sm">
            <p>{shipper.name || 'N/A'}</p>
            <p>{shipper.address || 'N/A'}</p>
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Consignee</h3>
          <div className="text-sm">
            <p>{consignee.name || 'N/A'}</p>
            <p>{consignee.address || 'N/A'}</p>
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Notify Party</h3>
          <div className="text-sm">
            <p>{notifyParty.name || 'N/A'}</p>
            <p>{notifyParty.address || 'N/A'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold mb-2">Port Information</h3>
          <div className="text-sm">
            <p>Port of Loading: {details.portOfLoading || 'N/A'}</p>
            <p>Port of Discharge: {details.portOfDischarge || 'N/A'}</p>
            <p>Place of Receipt: {details.placeOfReceipt || 'N/A'}</p>
            <p>Place of Delivery: {details.placeOfDelivery || 'N/A'}</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Packages</h3>
        <div className="space-y-2">
          {packages.map((pkg: any, index: number) => (
            <div key={index} className="border p-2 rounded">
              <div className="text-sm">
                <p>Description: {pkg.description || 'N/A'}</p>
                <p>Weight: {pkg.weight || 'N/A'}</p>
                <p>Measurement: {pkg.measurement || 'N/A'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};