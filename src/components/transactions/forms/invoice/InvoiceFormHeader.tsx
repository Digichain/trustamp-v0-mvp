import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DIDCreator, DIDDocument } from "../../identity/DIDCreator";

interface InvoiceFormHeaderProps {
  onDIDCreated: (doc: DIDDocument) => void;
}

export const InvoiceFormHeader = ({ onDIDCreated }: InvoiceFormHeaderProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Identity</CardTitle>
      </CardHeader>
      <CardContent>
        <DIDCreator onDIDCreated={onDIDCreated} />
      </CardContent>
    </Card>
  );
};