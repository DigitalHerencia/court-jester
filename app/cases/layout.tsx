import type React from "react"
import { BottomNav } from "@/components/bottom-nav"

export default function CasesLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 pb-16">{children}</main>
      <BottomNav />
    </div>
  )
}

