import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Download, Calendar } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { PreviewDialog } from "@/components/transactions/previews/PreviewDialog";
import { FinanceRequestForm } from "@/components/finance/FinanceRequestForm";
import { FinanceRequestsTable } from "@/components/finance/FinanceRequestsTable";

export default function Finance() {
  console.log("Finance page rendered");
  const { toast } = useToast();
  const [isRequestFinanceOpen, setIsRequestFinanceOpen] = useState(false);

  // Mock data for last update (replace with actual data later)
  const lastUpdate = {
    date: new Date("2024-03-20"),
    fileName: "kyc_form_v1.pdf"
  };

  const handleDownloadKYC = async () => {
    try {
      console.log("Initiating KYC form download");
      const { data, error } = await supabase.storage
        .from('kyc-documents')
        .download('kyc_template.docx');

      if (error) {
        console.error("Error downloading KYC form:", error);
        toast({
          title: "Download Failed",
          description: "Could not download the KYC form. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Create a download link
      const url = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'KYC_Form_Template.docx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "KYC form downloaded successfully",
      });
    } catch (error) {
      console.error("Error in download handler:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Finance</h1>
      
      {/* KYC Card */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Additional KYC</CardTitle>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span className="text-sm text-muted-foreground">Approved</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Download Button Column */}
            <div className="flex items-center justify-center">
              <Button 
                variant="outline"
                className="w-full flex items-center gap-2"
                onClick={handleDownloadKYC}
              >
                <Download className="h-4 w-4" />
                Download KYC Form
              </Button>
            </div>

            {/* Upload Button Column */}
            <div className="flex items-center justify-center">
              <Button 
                className="w-full flex items-center gap-2 bg-black hover:bg-black/90"
                onClick={() => console.log("Upload/Update KYC form")}
              >
                <Upload className="h-4 w-4" />
                Upload/Update KYC Form
              </Button>
            </div>

            {/* Last Updated Column */}
            <div className="flex flex-col items-start justify-center">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Calendar className="h-4 w-4" />
                <span>Last Updated:</span>
              </div>
              <div className="text-sm">
                <p>{format(lastUpdate.date, "MMMM d, yyyy")}</p>
                <p className="text-muted-foreground">{lastUpdate.fileName}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requests Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Requests</CardTitle>
          <Button 
            className="bg-black hover:bg-black/90"
            onClick={() => setIsRequestFinanceOpen(true)}
          >
            Request Finance
          </Button>
        </CardHeader>
        <CardContent>
          <FinanceRequestsTable />
        </CardContent>
      </Card>

      {/* Request Finance Dialog */}
      <PreviewDialog
        title="Request Finance"
        isOpen={isRequestFinanceOpen}
        onOpenChange={setIsRequestFinanceOpen}
      >
        <FinanceRequestForm onClose={() => setIsRequestFinanceOpen(false)} />
      </PreviewDialog>
    </div>
  );
}
