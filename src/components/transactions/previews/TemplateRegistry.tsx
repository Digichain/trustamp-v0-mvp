import { TemplateRegistry } from "@govtechsg/decentralized-renderer-react-components";
import { InvoiceTemplate } from "./templates/InvoiceTemplate";
import { BillOfLadingTemplate } from "./templates/BillOfLadingTemplate";

export const registry: TemplateRegistry<any> = {
  INVOICE: [
    {
      id: "default",
      label: "Invoice",
      template: InvoiceTemplate
    }
  ],
  BILL_OF_LADING: [
    {
      id: "default",
      label: "Bill of Lading",
      template: BillOfLadingTemplate
    }
  ]
};