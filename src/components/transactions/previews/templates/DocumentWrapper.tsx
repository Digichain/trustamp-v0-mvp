import { Card } from "@/components/ui/card";
import { ReactNode } from "react";

interface DocumentWrapperProps {
  title: string;
  children: ReactNode;
}

export const DocumentWrapper = ({ title, children }: DocumentWrapperProps) => {
  return (
    <Card className="p-6 space-y-6 bg-[#F1F0FB] shadow-lg print:shadow-none">
      <div className="border-b pb-4">
        <img 
          src="/lovable-uploads/332db982-2d48-46a4-8185-5f16eafbf9b5.png" 
          alt="TruStamp Logo" 
          className="h-12 mb-4"
        />
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      {children}
    </Card>
  );
};