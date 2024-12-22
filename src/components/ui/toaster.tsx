import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { Copy } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Toaster() {
  const { toasts } = useToast()

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        console.log('Text copied successfully');
      })
      .catch(err => {
        console.error('Failed to copy text:', err);
      });
  };

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        const isError = variant === "destructive";
        return (
          <Toast key={id} {...props} variant={variant}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <div className="flex items-start justify-between gap-2">
                  <ToastDescription className="select-text">
                    {description}
                  </ToastDescription>
                  {isError && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0 text-muted-foreground hover:text-foreground"
                      onClick={() => handleCopyText(description?.toString() || '')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}