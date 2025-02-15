import { useState } from "react";
import { Plus, X, Users, FileText, DollarSign } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserSelector } from "./dialog/UserSelector";
import { DocumentSelector } from "./dialog/DocumentSelector";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";

interface DocumentWithTitle {
  id: string;
  title: string;
}

export const CreateTransactionDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<DocumentWithTitle[]>([]);
  const [isPaymentBound, setIsPaymentBound] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [transactionTitle, setTransactionTitle] = useState("");
  const { toast } = useToast();

  const handleCreateTransaction = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");

      // Get document data for the first document
      const firstDoc = selectedDocuments[0];
      if (firstDoc) {
        const { data: documentData, error: docError } = await supabase
          .from("documents")
          .select("signed_document")
          .eq("id", firstDoc.id)
          .single();

        if (docError) throw docError;

        if (!documentData.signed_document) {
          console.error("No signed document available");
          throw new Error("Document must be signed before it can be attached to a transaction");
        }

        const document1Data = {
          id: firstDoc.id,
          title: firstDoc.title,
          document: documentData.signed_document
        };

        // Create the transaction with the first document
        const { data: transaction, error: transactionError } = await supabase
          .from("transactions")
          .insert({
            user_id: user.id,
            status: "pending",
            transaction_type: "trade",
            transaction_hash: `0x${Math.random().toString(16).slice(2)}`,
            network: "ethereum",
            payment_bound: isPaymentBound,
            payment_amount: isPaymentBound ? paymentAmount : null,
            document1: document1Data,
            recipient1_id: selectedUserIds[0] || null,
            recipient2_id: selectedUserIds[1] || null,
            title: transactionTitle || "Untitled Transaction"
          })
          .select()
          .single();

        if (transactionError) throw transactionError;

        // If there's a second document, update the transaction
        if (selectedDocuments[1]) {
          const { data: secondDocData, error: secondDocError } = await supabase
            .from("documents")
            .select("signed_document")
            .eq("id", selectedDocuments[1].id)
            .single();

          if (secondDocError) throw secondDocError;

          if (!secondDocData.signed_document) {
            console.error("No signed document available for second document");
            throw new Error("Second document must be signed before it can be attached");
          }

          const document2Data = {
            id: selectedDocuments[1].id,
            title: selectedDocuments[1].title,
            document: secondDocData.signed_document
          };

          const { error: updateError } = await supabase
            .from("transactions")
            .update({ document2: document2Data })
            .eq("id", transaction.id);

          if (updateError) throw updateError;
        }

        // Create notification recipients
        for (const recipientId of selectedUserIds) {
          const { error: notificationError } = await supabase
            .from("notification_recipients")
            .insert({
              transaction_id: transaction.id,
              recipient_user_id: recipientId
            });

          if (notificationError) throw notificationError;

          // Create notification
          const { error: notifError } = await supabase
            .from("notifications")
            .insert({
              recipient_user_id: recipientId,
              transaction_id: transaction.id,
              type: "transaction_created",
              message: "You have been added to a new transaction"
            });

          if (notifError) throw notifError;
        }

        console.log("Transaction created successfully:", transaction);
        toast({
          title: "Success",
          description: "Transaction created successfully",
        });
        setIsOpen(false);
      }
    } catch (error: any) {
      console.error("Error creating transaction:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create transaction",
        variant: "destructive",
      });
    }
  };

  const handleAddRecipient = (userId: string) => {
    if (!selectedUserIds.includes(userId)) {
      setSelectedUserIds([...selectedUserIds, userId]);
    }
  };

  const handleRemoveRecipient = (userId: string) => {
    setSelectedUserIds(selectedUserIds.filter(id => id !== userId));
  };

  const handleAddDocument = (documentId: string) => {
    if (!selectedDocuments.some(doc => doc.id === documentId)) {
      setSelectedDocuments([...selectedDocuments, { id: documentId, title: "" }]);
    }
  };

  const handleRemoveDocument = (documentId: string) => {
    setSelectedDocuments(selectedDocuments.filter(doc => doc.id !== documentId));
  };

  const handleDocumentTitleChange = (documentId: string, title: string) => {
    setSelectedDocuments(selectedDocuments.map(doc => 
      doc.id === documentId ? { ...doc, title } : doc
    ));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          Create Transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Create New Transaction
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Transaction Title - Full Width */}
          <Card className="p-4 space-y-4 bg-muted/30">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Transaction Name
              </label>
              <Input
                placeholder="Enter transaction name"
                value={transactionTitle}
                onChange={(e) => setTransactionTitle(e.target.value)}
                className="bg-background"
              />
            </div>
          </Card>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Recipients Section */}
              <Card className="p-4 space-y-4 bg-muted/30">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Recipients
                  </label>
                  <div className="space-y-2">
                    {selectedUserIds.map((userId) => (
                      <div key={userId} className="flex items-center justify-between p-2 bg-background rounded-lg border border-border">
                        <span className="text-sm">{userId}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveRecipient(userId)}
                          className="hover:bg-destructive/10 hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <UserSelector
                      selectedUserId={undefined}
                      onSelect={handleAddRecipient}
                    />
                  </div>
                </div>
              </Card>

              {/* Payment Section */}
              <Card className="p-4 space-y-4 bg-muted/30">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="payment-bound"
                      checked={isPaymentBound}
                      onCheckedChange={(checked) => setIsPaymentBound(checked as boolean)}
                    />
                    <label
                      htmlFor="payment-bound"
                      className="text-sm font-medium leading-none flex items-center gap-2"
                    >
                      <DollarSign className="h-4 w-4" />
                      Payment Bound
                    </label>
                  </div>

                  {isPaymentBound && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Payment Amount ($)</label>
                      <Input
                        type="number"
                        placeholder="Enter amount"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(Number(e.target.value))}
                        min={0}
                        step="0.01"
                        className="bg-background"
                      />
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Documents Section */}
              <Card className="p-4 space-y-4 bg-muted/30">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Documents
                  </label>
                  <div className="space-y-2">
                    {selectedDocuments.map((doc) => (
                      <div key={doc.id} className="space-y-2 p-3 bg-background rounded-lg border border-border">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{doc.id}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveDocument(doc.id)}
                            className="hover:bg-destructive/10 hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <Input
                          placeholder="Document Title"
                          value={doc.title}
                          onChange={(e) => handleDocumentTitleChange(doc.id, e.target.value)}
                          className="mt-2"
                        />
                      </div>
                    ))}
                    <DocumentSelector
                      selectedDocument=""
                      onDocumentSelect={handleAddDocument}
                    />
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Action Buttons - Full Width */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="w-24"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateTransaction}
              disabled={selectedUserIds.length === 0 || selectedDocuments.some(doc => !doc.title)}
              className="w-24"
            >
              Create
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
