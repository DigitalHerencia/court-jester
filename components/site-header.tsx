"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Scale, Gavel, FileText, Lock } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"

export function SiteHeader() {
  const pathname = usePathname()

  const navItems = [
    {
      name: "Cases",
      href: "/cases",
      icon: "Scale",
    },
    {
      name: "Court Dates",
      href: "/court-dates",
      icon: "Gavel",
    },
    {
      name: "Motions",
      href: "/motions",
      icon: "FileText",
    },
    {
      name: "Privacy",
      href: "/privacy",
      icon: "Lock",
    },
  ]

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-[#e7dbc3]/95 backdrop-blur supports-[backdrop-filter]:bg-[#e7dbc3]/60 dark:bg-[#2a2417]/95 dark:supports-[backdrop-filter]:bg-[#2a2417]/60">
      <div className="container flex h-14 items-center justify-between py-2">
        <Logo size="sm" />
        <ModeToggle />
      </div>
      <div className="container pb-2">
        <nav className="flex overflow-auto pb-2 scrollbar-hide">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant={pathname === item.href ? "default" : "ghost"}
              className={cn(
                "flex-1 justify-start text-base rounded-lg mr-2 min-w-[120px] playing-card normal-case",
                pathname === item.href ? "bg-primary text-primary-foreground" : "",
              )}
              asChild
            >
              <Link href={item.href}>
                {item.icon === "Scale" && <Scale className="mr-2 h-4 w-4" />}
                {item.icon === "Gavel" && <Gavel className="mr-2 h-4 w-4" />}
                {item.icon === "FileText" && <FileText className="mr-2 h-4 w-4" />}
                {item.icon === "Lock" && <Lock className="mr-2 h-4 w-4" />}
                {item.name}
              </Link>
            </Button>
          ))}
        </nav>
      </div>
    </header>
  )
}

