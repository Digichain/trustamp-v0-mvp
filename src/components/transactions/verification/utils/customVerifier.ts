import { Verifier } from "@govtechsg/oa-verify";
import { getData } from "@govtechsg/open-attestation";
import { DOCUMENT_TEMPLATES } from "../types";

export const createInvoiceCustomVerifier = (): Verifier<any> => ({
  skip: () => {
    return Promise.resolve({
      status: "SKIPPED",
      type: "DOCUMENT_INTEGRITY",
      name: "InvoiceVerifier",
      reason: {
        code: 0,
        codeString: "SKIPPED",
        message: "Document format verification skipped",
      },
    });
  },
  
  test: (document: any) => {
    try {
      const data = getData(document);
      const template = data.$template;
      return document.version === "https://schema.openattestation.com/2.0/schema.json" &&
             template?.name === DOCUMENT_TEMPLATES.INVOICE;
    } catch (error) {
      console.error("Error in test function:", error);
      return false;
    }
  },

  verify: async (document: any) => {
    try {
      const documentData = getData(document);
      const template = documentData.$template;
      const templateName = template?.name;
      
      if (templateName !== DOCUMENT_TEMPLATES.INVOICE) {
        return {
          type: "DOCUMENT_INTEGRITY",
          name: "InvoiceVerifier",
          data: templateName,
          reason: {
            code: 1,
            codeString: "INVALID_TEMPLATE",
            message: `Document template is not an invoice: ${templateName}`,
          },
          status: "INVALID",
        };
      }

      return {
        type: "DOCUMENT_INTEGRITY",
        name: "InvoiceVerifier",
        data: templateName,
        status: "VALID",
      };
    } catch (error) {
      console.error("Error in verify function:", error);
      return {
        type: "DOCUMENT_INTEGRITY",
        name: "InvoiceVerifier",
        data: null,
        reason: {
          code: 2,
          codeString: "VERIFICATION_ERROR",
          message: "Error during verification",
        },
        status: "ERROR",
      };
    }
  },
});