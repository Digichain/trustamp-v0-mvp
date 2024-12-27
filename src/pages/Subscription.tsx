import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Subscription() {
  console.log("Subscription page rendered");
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Subscription</h1>
      <Card>
        <CardHeader>
          <CardTitle>Subscription Plans</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Subscription plans and details will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
}