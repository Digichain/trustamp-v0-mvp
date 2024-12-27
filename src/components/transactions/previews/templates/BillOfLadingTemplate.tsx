import { Card } from "@/components/ui/card";
import { WrappedBillOfLading } from "./types";

interface BillOfLadingTemplateProps {
  document: WrappedBillOfLading;
}

export const BillOfLadingTemplate = ({ document }: BillOfLadingTemplateProps) => {
  console.log("Rendering Bill of Lading template with document:", document);
  
  // Get the unwrapped data
  const { billOfLadingDetails } = document.data || {};
  
  const formatLabel = (key: string) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  };

  const unwrapValue = (value: any): any => {
    // If value is not an object or is null/undefined, return as is
    if (!value || typeof value !== 'object') return value;
    
    // If it's an array, unwrap each item
    if (Array.isArray(value)) {
      return value.map(item => unwrapValue(item));
    }
    
    // For objects, check each property for UUID pattern
    const unwrappedObj: any = {};
    Object.entries(value).forEach(([key, val]) => {
      if (typeof val === 'string') {
        // Check for UUID pattern followed by :string or :number
        const match = val.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}:(string|number):(.+)$/);
        if (match) {
          console.log(`Found wrapped value: ${val}, extracting: ${match[2]}`);
          unwrappedObj[key] = match[1] === 'number' ? Number(match[2]) : match[2];
        } else {
          unwrappedObj[key] = val;
        }
      } else if (typeof val === 'object') {
        unwrappedObj[key] = unwrapValue(val);
      } else {
        unwrappedObj[key] = val;
      }
    });
    return unwrappedObj;
  };

  const renderKeyValue = (obj: any) => {
    const unwrappedData = unwrapValue(obj);
    console.log("Unwrapped data for rendering:", unwrappedData);
    
    return Object.entries(unwrappedData)
      .filter(([_, value]) => value)
      .map(([key, value]) => {
        console.log("Rendering key-value:", { key, value });
        return (
          <p key={key} className="text-sm">
            <span className="font-medium text-gray-600">{formatLabel(key)}:</span>{' '}
            <span>{String(value)}</span>
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

  // Unwrap all document data
  const unwrappedDoc = unwrapValue(billOfLadingDetails);
  console.log("Unwrapped document:", unwrappedDoc);

  return (
    <Card className="p-6 space-y-6 bg-white print:shadow-none">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold">Bill of Lading</h2>
        <p className="text-gray-600">BL Number: {unwrappedDoc?.blNumber || 'N/A'}</p>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Basic Information</h3>
          <div className="grid grid-cols-2 gap-4">
            {renderKeyValue({
              scac: unwrappedDoc?.scac,
              vessel: unwrappedDoc?.vessel,
              voyageNo: unwrappedDoc?.voyageNo,
              carrierName: unwrappedDoc?.carrierName
            })}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Locations</h3>
          <div className="grid grid-cols-2 gap-4">
            {renderKeyValue({
              portOfLoading: unwrappedDoc?.portOfLoading,
              portOfDischarge: unwrappedDoc?.portOfDischarge,
              placeOfReceipt: unwrappedDoc?.placeOfReceipt,
              placeOfDelivery: unwrappedDoc?.placeOfDelivery
            })}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Parties</h3>
          <div className="space-y-4">
            {renderParty(unwrappedDoc?.shipper || {}, 'Shipper')}
            {renderParty(unwrappedDoc?.consignee || {}, 'Consignee')}
            {renderParty(unwrappedDoc?.notifyParty || {}, 'Notify Party')}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Packages</h3>
          <div className="space-y-2">
            {(unwrappedDoc?.packages || []).map((pkg: any, index: number) => (
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