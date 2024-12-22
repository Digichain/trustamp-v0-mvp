import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TokenRegistryDocument } from "./types";

interface RegistryDetailsProps {
  registry: TokenRegistryDocument;
}

export const RegistryDetails = ({ registry }: RegistryDetailsProps) => {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Registry Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p><span className="font-medium">Address:</span> {registry.contractAddress}</p>
          <p><span className="font-medium">Name:</span> {registry.name}</p>
          <p><span className="font-medium">Symbol:</span> {registry.symbol}</p>
        </div>
      </CardContent>
    </Card>
  );
};