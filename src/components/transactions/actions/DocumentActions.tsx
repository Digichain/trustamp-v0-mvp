import {
  MoreVertical,
  Package,
  Trash2,
  FileSignature,
  Download,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useDocumentHandlers } from "./handlers/useDocumentHandlers";
import { useMemo } from "react";
import { Document } from "@/types/documents";

interface DocumentActionsProps {
  document: Document;
  onDelete: () => void;
}

export const DocumentActions = ({ 
  document, 
  onDelete,
}: DocumentActionsProps) => {
  const {
    handleWrapDocument,
    handleSignDocument,
    handleDownloadDocument
  } = useDocumentHandlers();

  const isTransferable = useMemo(() => document.document_subtype === 'transferable', [document]);
  const canWrap = useMemo(() => document.status === 'document_created', [document]);
  const canSign = useMemo(() => document.status === 'document_wrapped', [document]);
  const canDownload = useMemo(() => ['document_created', 'document_wrapped', 'document_signed', 'document_issued'].includes(document.status), [document]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {canWrap && (
          <DropdownMenuItem onClick={() => handleWrapDocument(document)}>
            <Package className="mr-2 h-4 w-4" />
            Wrap Document
          </DropdownMenuItem>
        )}

        <DropdownMenuItem 
          onClick={() => handleSignDocument(document)}
          disabled={!canSign}
          className={!canSign ? "opacity-50 cursor-not-allowed" : ""}
        >
          <FileSignature className="mr-2 h-4 w-4" />
          {isTransferable ? 'Issue Document' : 'Sign Document'}
        </DropdownMenuItem>

        {canDownload && (
          <DropdownMenuItem onClick={() => handleDownloadDocument(document)}>
            <Download className="mr-2 h-4 w-4" />
            Download Document
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem 
          onClick={onDelete}
          className="text-red-600 focus:text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Document
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};