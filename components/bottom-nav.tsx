"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, FileText, Bell, Settings, Scale } from "lucide-react"

export function BottomNav() {
  const pathname = usePathname()

  const links = [
    {
      href: "/dashboard",
      icon: Home,
      label: "Home",
    },
    {
      href: "/cases",
      icon: Scale,
      label: "Casos",
    },
    {
      href: "/motions",
      icon: FileText,
      label: "Mociones",
    },
    {
      href: "/notifications",
      icon: Bell,
      label: "Alertas",
    },
    {
      href: "/settings",
      icon: Settings,
      label: "Config",
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[hsl(42,15%,17%)] border-t border-border z-50">
      <div className="flex justify-around">
        {links.map((link) => {
          const Icon = link.icon
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-col items-center py-3 px-2 min-h-[44px] min-w-[44px]",
                pathname === link.href ? "text-[hsl(30,39%,85%)]" : "text-muted-foreground",
              )}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs mt-1 normal-case">{link.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

