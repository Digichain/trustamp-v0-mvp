export const verifiableInvoiceSchema = {
  "$template": {
    "name": "INVOICE",
  },
  "issuers": [
    {
      "name": "Company A",
    }
  ],
  "id": "",
  "date": "",
  "customerId": "",
  "terms": "Due Upon Receipt",
  "billFrom": {
    "name": "",
    "streetAddress": "",
    "city": "",
    "postalCode": "",
    "phoneNumber": ""
  },
  "billTo": {
    "company": {
      "name": "",
      "streetAddress": "",
      "city": "",
      "postalCode": "",
      "phoneNumber": ""
    },
    "name": "",
    "email": ""
  },
  "billableItems": [
    {
      "description": "",
      "quantity": 0,
      "unitPrice": 0,
      "amount": 0
    }
  ],
  "subtotal": 0,
  "tax": 0,
  "taxTotal": 0,
  "total": 0
};