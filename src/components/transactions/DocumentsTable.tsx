import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PreviewDialog } from "./previews/PreviewDialog";
import { InvoicePreview } from "./previews/InvoicePreview";
import { BillOfLadingPreview } from "./previews/BillOfLadingPreview";
import { useDocuments } from "@/hooks/useDocuments";
import { useDocumentData } from "@/hooks/useDocumentData";
import { useToast } from "@/components/ui/use-toast";
import { DocumentRow } from "./DocumentRow";
import { useDocumentSubscription } from "@/hooks/useDocumentSubscription";
import { Document } from "@/types/documents";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export const DocumentsTable = () => {
  const [showPreview, setShowPreview] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [documentData, setDocumentData] = useState<any>(null);
  const { toast } = useToast();
  
  const { documents, isLoading, invalidateDocuments } = useDocuments();
  const { fetchDocumentData, handleDelete } = useDocumentData();

  // Set up real-time subscription for document status updates
  useEffect(() => {
    console.log("Setting up real-time subscription for documents");
    const channel = supabase
      .channel('document-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'documents'
        },
        async (payload) => {
          console.log("Received document update:", payload);
          await invalidateDocuments();
        }
      )
      .subscribe();

    return () => {
      console.log("Cleaning up document subscription");
      supabase.removeChannel(channel);
    };
  }, [invalidateDocuments]);

  const handlePreviewClick = async (document: Document) => {
    try {
      console.log("DocumentsTable - Handling preview click for document:", document.id);
      const docData = await fetchDocumentData(document);
      if (!docData) {
        toast({
          title: "Document Not Found",
          description: "The document data could not be retrieved.",
          variant: "destructive",
        });
        return;
      }
      setSelectedDocument(document);
      setDocumentData(docData);
      setShowPreview(true);
    } catch (error) {
      console.error("Error in handlePreviewClick:", error);
      toast({
        title: "Error",
        description: "Failed to load document preview",
        variant: "destructive",
      });
    }
  };

  const handlePreviewClose = (open: boolean) => {
    console.log("DocumentsTable - Handling preview close, new state:", open);
    setShowPreview(open);
    if (!open) {
      setSelectedDocument(null);
      setDocumentData(null);
    }
  };

  const onDelete = async (document: Document) => {
    console.log("Starting delete process for document:", document.id);
    const success = await handleDelete(document);
    if (success) {
      console.log("Delete successful, invalidating documents cache");
      await invalidateDocuments();
      console.log("Cache invalidated, UI should update");
    }
  };

  const renderPreview = () => {
    if (!selectedDocument || !documentData) return null;

    switch (selectedDocument.document_subtype?.toLowerCase()) {
      case "verifiable":
        return <InvoicePreview data={documentData} />;
      case "transferable":
        return <BillOfLadingPreview data={documentData} />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction Hash</TableHead>
              <TableHead>Subtype</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Time</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents?.map((doc: Document) => (
              <DocumentRow
                key={doc.id}
                document={doc}
                onPreviewClick={handlePreviewClick}
                onDelete={onDelete}
              />
            ))}
            {(!documents || documents.length === 0) && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-gray-500"
                >
                  No documents found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <PreviewDialog
        title={`${selectedDocument?.title || 'Document'} Preview`}
        isOpen={showPreview}
        onOpenChange={handlePreviewClose}
      >
        {renderPreview()}
      </PreviewDialog>
    </>
  );
};