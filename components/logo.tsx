import Image from "next/image"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function Logo({ className, size = "md" }: LogoProps) {
  const sizes = {
    sm: "h-8",
    md: "h-12",
    lg: "h-16",
  }

  return (
    <div className={cn("relative flex items-center gap-2", className)}>
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/joker-playing-card_u-l-q1llfru0.jpg-WAMrQPayHKdcmyrFETx1Qf1RG4MO3P.jpeg"
        alt="Court Jester Logo"
        width={size === "sm" ? 32 : size === "md" ? 48 : 64}
        height={size === "sm" ? 32 : size === "md" ? 48 : 64}
        className="rounded-none border-2 border-primary"
      />
      <h1
        className={cn(
          "font-jacquard font-bold text-3xl normal-case",
          size === "sm" ? "text-xl" : size === "md" ? "text-2xl" : "text-3xl",
        )}
      >
        Court Jester
      </h1>
    </div>
  )
}

