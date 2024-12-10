export interface SubTypeOption {
  value: string;
  label: string;
}

export const getSubTypeOptions = (type: string): SubTypeOption[] => {
  switch (type) {
    case "trade":
      return [
        { value: "verifiable", label: "Verifiable Document" },
        { value: "transferable", label: "Transferable Document" },
      ];
    case "authentication":
      return [
        { value: "achievement", label: "Certificate of Achievement" },
        { value: "halal", label: "Halal Certificate" },
        { value: "medical", label: "Medical Certificate" },
        { value: "membership", label: "Membership Certificate" },
      ];
    case "government":
      return [
        { value: "driver", label: "Driver's License" },
        { value: "birth", label: "Birth Certificate" },
        { value: "citizenship", label: "Citizenship Certificate" },
      ];
    case "environmental":
      return [
        { value: "type1", label: "Type 1" },
        { value: "type2", label: "Type 2" },
        { value: "type3", label: "Type 3" },
      ];
    default:
      return [];
  }
};

export const DOCUMENT_TYPES = [
  { value: "trade", label: "Trade Document" },
  { value: "authentication", label: "Certificate of Authentication" },
  { value: "government", label: "Government Issued Document" },
  { value: "environmental", label: "Environmental Product Declaration" },
];