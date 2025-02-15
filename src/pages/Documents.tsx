import { Button } from "@/components/ui/button";
import { FileCheck, Upload } from "lucide-react";
import { CreateDocumentDialog } from "@/components/transactions/CreateDocumentDialog";
import { DocumentsTable } from "@/components/transactions/DocumentsTable";
import { useToast } from "@/components/ui/use-toast";
import { useWallet } from "@/contexts/WalletContext";
import { useNavigate } from "react-router-dom";

const Documents = () => {
  const { isWalletConnected } = useWallet();
  const { toast } = useToast();
  const navigate = useNavigate();

  console.log("Wallet connection state:", isWalletConnected);

  const handleWalletRequired = () => {
    if (!isWalletConnected) {
      toast({
        title: "Wallet Connection Required",
        description: "Please connect your wallet to perform this action",
        variant: "destructive",
      });
      return;
    }
    navigate("/verify");
  };

  const handleImport = () => {
    if (!isWalletConnected) {
      toast({
        title: "Wallet Connection Required",
        description: "Please connect your wallet to import a document",
        variant: "destructive",
      });
      return;
    }
    navigate("/verify");
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
          <div className="flex gap-4">
            <Button 
              onClick={handleImport}
              disabled={!isWalletConnected}
              className="disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="mr-2" />
              Import Document
            </Button>
            <CreateDocumentDialog />
            <Button 
              variant="outline" 
              disabled={!isWalletConnected}
              onClick={handleWalletRequired}
              className="disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileCheck className="mr-2" />
              Verify Document
            </Button>
          </div>
        </div>
        <p className="text-gray-600 mb-8">
          View and manage your trade documentation.
        </p>

        <DocumentsTable />
      </div>
    </div>
  );
};

export default Documents;