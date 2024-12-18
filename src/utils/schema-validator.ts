import Ajv from "ajv";
import addFormats from "ajv-formats";
import { toast } from "@/components/ui/use-toast";

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

export const validateDocument = async (document: any, documentType: string) => {
  console.log(`Validating ${documentType} document:`, document);
  
  try {
    // Dynamically import the schema based on document type
    const schemaModule = await import(`@/schemas/trustamp/${documentType}/1.0/schema.json`);
    const schema = schemaModule.default;
    
    console.log(`Loaded schema for ${documentType}:`, schema);
    
    const validate = ajv.compile(schema);
    const isValid = validate(document);
    
    if (!isValid) {
      console.error(`Validation errors for ${documentType}:`, validate.errors);
      toast({
        title: "Document Validation Error",
        description: "The document does not match the required schema",
        variant: "destructive",
      });
      return { isValid: false, errors: validate.errors };
    }
    
    console.log(`Document validation successful for ${documentType}`);
    return { isValid: true, errors: null };
  } catch (error) {
    console.error(`Error loading or validating schema for ${documentType}:`, error);
    toast({
      title: "Schema Validation Error",
      description: `Failed to validate ${documentType} document`,
      variant: "destructive",
    });
    return { isValid: false, errors: [{ message: "Schema validation failed" }] };
  }
};