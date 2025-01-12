import { TableCell, TableRow } from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { DocumentStatus } from "./DocumentStatus";
import { DocumentActions } from "./actions/DocumentActions";
import { Document } from "@/types/documents";

interface DocumentRowProps {
  document: Document;
  onPreviewClick: (document: Document) => void;
  onDelete: (document: Document) => void;
}

export const DocumentRow = ({ 
  document, 
  onPreviewClick, 
  onDelete 
}: DocumentRowProps) => {
  return (
    <TableRow>
      <TableCell className="font-mono">
        {document.transaction_hash ? 
          `${document.transaction_hash.slice(0, 10)}...${document.transaction_hash.slice(-8)}` :
          '-'
        }
      </TableCell>
      <TableCell className="capitalize">{document.document_subtype || '-'}</TableCell>
      <TableCell>{document.title || '-'}</TableCell>
      <TableCell>
        <DocumentStatus status={document.status} />
      </TableCell>
      <TableCell>
        {formatDistanceToNow(new Date(document.created_at), {
          addSuffix: true,
        })}
      </TableCell>
      <TableCell className="text-right">
        <DocumentActions
          document={document}
          onPreviewClick={() => onPreviewClick(document)}
          onDelete={() => onDelete(document)}
        />
      </TableCell>
    </TableRow>
  );
};