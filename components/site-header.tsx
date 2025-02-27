"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Calendar, CheckSquare, Home, Settings } from "lucide-react"

export function SiteHeader() {
  const pathname = usePathname()

  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: <Home className="h-6 w-6 mr-2" />,
    },
    {
      name: "Tasks",
      href: "/tasks",
      icon: <CheckSquare className="h-6 w-6 mr-2" />,
    },
    {
      name: "Court Dates",
      href: "/court-dates",
      icon: <Calendar className="h-6 w-6 mr-2" />,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: <Settings className="h-6 w-6 mr-2" />,
    },
  ]

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold">Court Jester</span>
          </Link>
        </div>
        <nav className="flex items-center gap-2">
          <ModeToggle />
        </nav>
      </div>
      <div className="container pb-2">
        <nav className="flex overflow-auto pb-2 scrollbar-hide">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant={pathname === item.href ? "default" : "ghost"}
              className={cn(
                "flex-1 justify-start text-lg rounded-lg mr-2 min-w-[140px]",
                pathname === item.href ? "bg-primary text-primary-foreground" : "",
              )}
              asChild
            >
              <Link href={item.href}>
                {item.icon}
                {item.name}
              </Link>
            </Button>
          ))}
        </nav>
      </div>
    </header>
  )
}

