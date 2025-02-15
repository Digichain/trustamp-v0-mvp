import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PreviewDialog, PreviewButton } from "../previews/PreviewDialog";
import { BillOfLadingPreview } from "../previews/BillOfLadingPreview";
import { DocumentStoreCreator, DocumentStoreInfo } from "../identity/DocumentStoreCreator";
import { useWallet } from "@/contexts/WalletContext";
import { formatBillOfLadingToOpenAttestation } from "@/utils/document-formatters";
import { BillOfLadingBasicInfo } from "./bill-of-lading/BillOfLadingBasicInfo";
import { BillOfLadingLocations } from "./bill-of-lading/BillOfLadingLocations";
import { BillOfLadingParties } from "./bill-of-lading/BillOfLadingParties";
import { BillOfLadingPackages } from "./bill-of-lading/BillOfLadingPackages";

interface FormData {
  scac: string;
  blNumber: string;
  vessel: string;
  voyageNo: string;
  carrierName: string;
  portOfLoading: string;
  portOfDischarge: string;
  placeOfReceipt: string;
  placeOfDelivery: string;
  shipper: { name: string; address: string };
  consignee: { name: string; address: string };
  notifyParty: { name: string; address: string };
  packages: Array<{ description: string; weight: string; measurement: string }>;
}

export const TransferableBillOfLadingForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isWalletConnected, network } = useWallet();
  const [documentStore, setDocumentStore] = useState<DocumentStoreInfo | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    scac: "",
    blNumber: "",
    vessel: "",
    voyageNo: "",
    carrierName: "",
    portOfLoading: "",
    portOfDischarge: "",
    placeOfReceipt: "",
    placeOfDelivery: "",
    shipper: { name: "", address: "" },
    consignee: { name: "", address: "" },
    notifyParty: { name: "", address: "" },
    packages: [{ description: "", weight: "", measurement: "" }]
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePartyChange = (party: 'shipper' | 'consignee' | 'notifyParty', field: 'name' | 'address', value: string) => {
    setFormData(prev => ({
      ...prev,
      [party]: {
        ...prev[party],
        [field]: value
      }
    }));
  };

  const handlePackageChange = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      packages: prev.packages.map((pkg, i) => 
        i === index ? { ...pkg, [field]: value } : pkg
      )
    }));
  };

  const handleAddPackage = () => {
    setFormData(prev => ({
      ...prev,
      packages: [...prev.packages, { description: "", weight: "", measurement: "" }]
    }));
  };

  const handleRemovePackage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      packages: prev.packages.filter((_, i) => i !== index)
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

    if (!documentStore?.contractAddress) {
      toast({
        title: "Document Store Required",
        description: "Please deploy a document store first",
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

      const formattedDoc = formatBillOfLadingToOpenAttestation({
        ...formData,
        documentStore: documentStore.contractAddress
      }, documentStore);

      console.log("Formatted document:", formattedDoc);

      const { data: documentData, error: documentError } = await supabase
        .from("documents")
        .insert({
          transaction_hash: `0x${Math.random().toString(16).slice(2)}`,
          network: "ethereum",
          status: "document_created",
          document_subtype: "transferable",
          title: "BILL_OF_LADING",
          transaction_type: "trade",
          user_id: user.id,
          raw_document: formattedDoc
        })
        .select()
        .single();

      if (documentError) throw documentError;

      const { error: bolError } = await supabase
        .from("bill_of_lading_documents")
        .insert({
          document_id: documentData.id,
          ...formData,
          raw_document: formattedDoc
        });

      if (bolError) throw bolError;

      toast({
        title: "Success",
        description: "Bill of Lading created successfully",
      });

      navigate("/documents");
    } catch (error) {
      console.error("Error creating document:", error);
      toast({
        title: "Error",
        description: "Failed to create Bill of Lading",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreview = () => {
    console.log("Opening preview dialog");
    setShowPreview(true);
  };

  const handleClosePreview = () => {
    console.log("Closing preview dialog");
    setShowPreview(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <DocumentStoreCreator onStoreCreated={setDocumentStore} />
      
      {documentStore && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <BillOfLadingBasicInfo
                formData={formData}
                onInputChange={handleInputChange}
                isSubmitting={isSubmitting}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Locations</CardTitle>
            </CardHeader>
            <CardContent>
              <BillOfLadingLocations
                formData={formData}
                onInputChange={handleInputChange}
                isSubmitting={isSubmitting}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Parties</CardTitle>
            </CardHeader>
            <CardContent>
              <BillOfLadingParties
                formData={formData}
                onPartyChange={handlePartyChange}
                isSubmitting={isSubmitting}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Packages</CardTitle>
            </CardHeader>
            <CardContent>
              <BillOfLadingPackages
                packages={formData.packages}
                onPackageChange={handlePackageChange}
                onAddPackage={handleAddPackage}
                onRemovePackage={handleRemovePackage}
                isSubmitting={isSubmitting}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate("/documents")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <PreviewButton 
              onClick={handlePreview}
              disabled={isSubmitting} 
            />
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Bill of Lading"}
            </Button>
          </div>

          <PreviewDialog
            title="Bill of Lading Preview"
            isOpen={showPreview}
            onOpenChange={handleClosePreview}
          >
            <BillOfLadingPreview data={formData} />
          </PreviewDialog>
        </>
      )}
    </form>
  );
};
