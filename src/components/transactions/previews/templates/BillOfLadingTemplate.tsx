import { Card } from "@/components/ui/card";

interface BillOfLadingTemplateProps {
  document: any;
}

export const BillOfLadingTemplate = ({ document }: BillOfLadingTemplateProps) => {
  console.log("Rendering Bill of Lading template with document:", document);
  
  const details = document?.billOfLadingDetails || document || {};
  
  const formatLabel = (key: string) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  };

  const renderKeyValue = (obj: any) => {
    return Object.entries(obj)
      .filter(([_, value]) => value)
      .map(([key, value]) => {
        // Handle nested objects that might be in OpenAttestation format
        const cleanValue = typeof value === 'object' && value?.hasOwnProperty("")
          ? value[""]
          : value;
          
        return (
          <p key={key} className="text-sm">
            <span className="font-medium text-gray-600">{formatLabel(key)}:</span>{' '}
            <span>{String(cleanValue)}</span>
          </p>
        );
      });
  };

  const renderParty = (party: any, title: string) => (
    <div className="border-b pb-2">
      <h4 className="font-medium mb-1">{title}</h4>
      {renderKeyValue(party)}
    </div>
  );

  return (
    <Card className="p-6 space-y-6 bg-white print:shadow-none">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold">Bill of Lading</h2>
        <p className="text-gray-600">BL Number: {details.blNumber || 'N/A'}</p>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Basic Information</h3>
          <div className="grid grid-cols-2 gap-4">
            {renderKeyValue({
              scac: details.scac,
              vessel: details.vessel,
              voyageNo: details.voyageNo,
              carrierName: details.carrierName
            })}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Locations</h3>
          <div className="grid grid-cols-2 gap-4">
            {renderKeyValue({
              portOfLoading: details.portOfLoading,
              portOfDischarge: details.portOfDischarge,
              placeOfReceipt: details.placeOfReceipt,
              placeOfDelivery: details.placeOfDelivery
            })}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Parties</h3>
          <div className="space-y-4">
            {renderParty(details.shipper || {}, 'Shipper')}
            {renderParty(details.consignee || {}, 'Consignee')}
            {renderParty(details.notifyParty || {}, 'Notify Party')}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Packages</h3>
          <div className="space-y-2">
            {(details.packages || []).map((pkg: any, index: number) => (
              <div key={index} className="border-b pb-2">
                <div className="grid grid-cols-3 gap-4">
                  {renderKeyValue(pkg)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};