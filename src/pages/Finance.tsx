import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUpload, Download, Calendar } from "lucide-react";
import { format } from "date-fns";

export default function Finance() {
  console.log("Finance page rendered");

  // Mock data for last update (replace with actual data later)
  const lastUpdate = {
    date: new Date("2024-03-20"),
    fileName: "kyc_form_v1.pdf"
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Finance</h1>
      
      {/* KYC Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Additional KYC</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Download Button Column */}
            <div className="flex items-center justify-center">
              <Button 
                variant="outline"
                className="w-full flex items-center gap-2"
                onClick={() => console.log("Download KYC form")}
              >
                <Download className="h-4 w-4" />
                Download KYC Form
              </Button>
            </div>

            {/* Upload Button Column */}
            <div className="flex items-center justify-center">
              <Button 
                variant="outline"
                className="w-full flex items-center gap-2"
                onClick={() => console.log("Upload/Update KYC form")}
              >
                <FileUpload className="h-4 w-4" />
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

      {/* Original Financial Overview Card */}
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