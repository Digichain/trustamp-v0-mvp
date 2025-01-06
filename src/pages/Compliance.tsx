import { Card } from "@/components/ui/card";

export default function Compliance() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Compliance</h1>
      </div>

      <Card className="p-6">
        <div className="grid gap-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Compliance Overview</h2>
            <p className="text-gray-600">
              Monitor and manage your compliance requirements, regulations, and documentation.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}