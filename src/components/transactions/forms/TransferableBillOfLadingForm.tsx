import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { transferableBillOfLadingSchema } from "@/schemas/transferable-bill-of-lading";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PreviewDialog, PreviewButton } from "../previews/PreviewDialog";
import { BillOfLadingPreview } from "../previews/BillOfLadingPreview";
import { TokenRegistryCreator, TokenRegistryDocument } from "../identity/TokenRegistryCreator";
import { useWallet } from "@/contexts/WalletContext";

export const TransferableBillOfLadingForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isWalletConnected, network } = useWallet();
  const [registryDocument, setRegistryDocument] = useState<TokenRegistryDocument | null>(null);
  const [formData, setFormData] = useState({
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
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!isWalletConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to proceed",
        variant: "destructive",
      });
      return;
    }

    if (network !== "Sepolia Testnet") {
      toast({
        title: "Wrong Network",
        description: "Please switch to Sepolia Testnet to proceed",
        variant: "destructive",
      });
      return;
    }

    if (!registryDocument?.contractAddress) {
      toast({
        title: "Token Registry Required",
        description: "Please deploy a token registry first",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("No user found");
      }

      const { data, error } = await supabase
        .from("transactions")
        .insert({
          transaction_hash: `0x${Math.random().toString(16).slice(2)}`,
          network: "ethereum",
          amount: 0,
          status: "pending",
          document_subtype: "transferable",
          title: "BILL_OF_LADING",
          transaction_type: "trade",
          user_id: user.id,
          raw_document: {
            ...formData,
            tokenRegistry: registryDocument.contractAddress
          }
        })
        .select()
        .single();

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
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields = [
    { name: "blNumber", label: "BL Number" },
    { name: "companyName", label: "Company Name" },
    { name: "field1", label: "Field 1" },
    { name: "field2", label: "Field 2" },
    { name: "field3", label: "Field 3" },
    { name: "field4", label: "Field 4" },
    { name: "field5", label: "Field 5" },
    { name: "field6", label: "Field 6" },
    { name: "field7", label: "Field 7" },
    { name: "field8", label: "Field 8" },
    { name: "field9", label: "Field 9" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <TokenRegistryCreator onRegistryCreated={setRegistryDocument} />
      
      <Card className={!registryDocument ? "opacity-50 pointer-events-none" : ""}>
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
                  value={formData[field.name as keyof typeof formData]}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  placeholder={`Enter ${field.label}`}
                  disabled={!registryDocument || isSubmitting}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => navigate("/transactions")}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <PreviewButton 
          onClick={() => setShowPreview(true)} 
          disabled={!registryDocument || isSubmitting} 
        />
        <Button 
          type="submit" 
          disabled={!registryDocument || isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create Bill of Lading"}
        </Button>
      </div>

      <PreviewDialog
        title="Bill of Lading Preview"
        isOpen={showPreview}
        onOpenChange={setShowPreview}
        onConfirm={() => handleSubmit()}
      >
        <BillOfLadingPreview data={formData} />
      </PreviewDialog>
    </form>
  );
};