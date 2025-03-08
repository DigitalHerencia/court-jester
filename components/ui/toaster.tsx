"use client"

import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, ...props }) => (
        <Toast key={id} {...props} className="text-lg">
          {title && <ToastTitle className="text-xl">{title}</ToastTitle>}
          {description && <ToastDescription className="text-lg">{description}</ToastDescription>}
          {action}
          <ToastClose className="h-8 w-8" />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  )
}

