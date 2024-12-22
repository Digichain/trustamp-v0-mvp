import {
  MoreVertical,
  Package,
  Trash2,
  Eye,
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

interface Transaction {
  id: string;
  document_subtype?: string | null;
  status: string;
  transaction_hash: string | null;
  network: string;
  transaction_type: string;
  raw_document: any | null;
  wrapped_document: any | null;
  signed_document: any | null;
}

interface TransactionActionsProps {
  transaction: Transaction;
  onPreviewClick: () => void;
  onDelete: () => void;
}

export const TransactionActions = ({ 
  transaction, 
  onPreviewClick,
  onDelete,
}: TransactionActionsProps) => {
  const {
    handleWrapDocument,
    handleSignDocument,
    handleDownloadDocument
  } = useDocumentHandlers();

  // Memoize computed values
  const isTransferable = useMemo(() => transaction.document_subtype === 'transferable', [transaction]);
  const canWrap = useMemo(() => transaction.status === 'document_created', [transaction]);
  const canSign = useMemo(() => transaction.status === 'document_wrapped', [transaction]);
  const canDownload = useMemo(() => ['document_created', 'document_wrapped', 'document_signed', 'document_issued'].includes(transaction.status), [transaction]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onPreviewClick}>
          <Eye className="mr-2 h-4 w-4" />
          Preview Document
        </DropdownMenuItem>
        {canWrap && (
          <DropdownMenuItem onClick={() => handleWrapDocument(transaction)}>
            <Package className="mr-2 h-4 w-4" />
            Wrap Document
          </DropdownMenuItem>
        )}
        {canSign && (
          <DropdownMenuItem onClick={() => handleSignDocument(transaction)}>
            <FileSignature className="mr-2 h-4 w-4" />
            {isTransferable ? 'Issue Document' : 'Sign Document'}
          </DropdownMenuItem>
        )}
        {canDownload && (
          <DropdownMenuItem onClick={() => handleDownloadDocument(transaction)}>
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