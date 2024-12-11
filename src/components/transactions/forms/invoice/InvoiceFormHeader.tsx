import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { DIDCreator, DIDDocument } from "../../identity/DIDCreator";

interface InvoiceFormHeaderProps {
  onDIDCreated: (doc: DIDDocument) => void;
}

export const InvoiceFormHeader = ({ onDIDCreated }: InvoiceFormHeaderProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Identity</CardTitle>
        <CardDescription>
          Create a DID before filling out the invoice details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DIDCreator onDIDCreated={onDIDCreated} />
      </CardContent>
    </Card>
  );
};