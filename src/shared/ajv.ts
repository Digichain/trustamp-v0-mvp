// Schema definitions
const v2Schema = {
  type: "object",
  properties: {
    version: { type: "string" },
    data: { type: "object" }
  },
  required: ["version", "data"]
};

export const getSchema = (schemaId: string) => {
  // For now, just return v2 schema
  return v2Schema;
};