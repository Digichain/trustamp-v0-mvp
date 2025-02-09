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
      </div>
      {children}
    </div>
  );
};