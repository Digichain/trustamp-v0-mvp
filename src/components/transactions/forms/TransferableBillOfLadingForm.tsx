import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { transferableBillOfLadingSchema } from "@/schemas/transferable-bill-of-lading";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface FormData {
  blNumber: string;
  companyName: string;
  field1: string;
  field2: string;
  field3: string;
  field4: string;
  field5: string;
  field6: string;
  field7: string;
  field8: string;
  field9: string;
}

export const TransferableBillOfLadingForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    blNumber: "",
    companyName: "",
    field1: "",
    field2: "",
    field3: "",
    field4: "",
    field5: "",
    field6: "",
    field7: "",
    field8: "",
    field9: "",
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting form data:", formData);

    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("No user found");
      }

      const { data, error } = await supabase
        .from("transactions")
        .insert({
          transaction_hash: `0x${Math.random().toString(16).slice(2)}`, // Generate a random hash for demo
          network: "ethereum",
          amount: 0, // Since this is a Bill of Lading, we don't have an amount
          status: "pending",
          document_subtype: "transferable",
          title: "BILL_OF_LADING",
          transaction_type: "trade",
          user_id: user.id
        })
        .select();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Bill of Lading created successfully",
      });

      navigate("/transactions");
    } catch (error) {
      console.error("Error creating transaction:", error);
      toast({
        title: "Error",
        description: "Failed to create Bill of Lading",
        variant: "destructive",
      });
    }
  };

  const fields = [
    { name: "blNumber" as keyof FormData, label: "BL Number" },
    { name: "companyName" as keyof FormData, label: "Company Name" },
    { name: "field1" as keyof FormData, label: "Field 1" },
    { name: "field2" as keyof FormData, label: "Field 2" },
    { name: "field3" as keyof FormData, label: "Field 3" },
    { name: "field4" as keyof FormData, label: "Field 4" },
    { name: "field5" as keyof FormData, label: "Field 5" },
    { name: "field6" as keyof FormData, label: "Field 6" },
    { name: "field7" as keyof FormData, label: "Field 7" },
    { name: "field8" as keyof FormData, label: "Field 8" },
    { name: "field9" as keyof FormData, label: "Field 9" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Bill of Lading Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {fields.map((field) => (
              <div key={field.name}>
                <Label className="block text-sm font-medium mb-1">
                  {field.label}
                </Label>
                <Input
                  value={formData[field.name]}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  placeholder={`Enter ${field.label}`}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => navigate("/transactions")}>
          Cancel
        </Button>
        <Button type="submit">Create Bill of Lading</Button>
      </div>
    </form>
  );
};