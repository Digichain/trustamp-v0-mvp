import { useWrappingHandler } from "./useWrappingHandler";
import { useSigningHandler } from "./useSigningHandler";
import { useDownloadHandler } from "./useDownloadHandler";

export const useDocumentHandlers = () => {
  const { handleWrapDocument } = useWrappingHandler();
  const { handleSignDocument } = useSigningHandler();
  const { handleDownloadDocument } = useDownloadHandler();

  return {
    handleWrapDocument,
    handleSignDocument,
    handleDownloadDocument
  };
};