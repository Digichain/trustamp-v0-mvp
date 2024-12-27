import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Finance() {
  console.log("Finance page rendered");
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Finance</h1>
      <Card>
        <CardHeader>
          <CardTitle>Financial Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Financial information will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
}