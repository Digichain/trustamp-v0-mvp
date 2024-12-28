import { FC, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DocumentWrapperProps {
  children: ReactNode;
  title: string;
  className?: string;
}

export const DocumentWrapper: FC<DocumentWrapperProps> = ({
  children,
  title,
  className,
}) => {
  return (
    <div className={cn("bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto", className)}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        </div>
        <div className="h-36">
          <img
            src="/lovable-uploads/e256b69c-090e-49d1-a172-c3b3e485c38c.png"
            alt="Logo"
            className="h-full w-auto object-contain"
          />
        </div>
      </div>
      {children}
    </div>
  );
};