import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(date)
}

// Soundex algorithm implementation
export function soundex(str: string): string {
  // Convert string to uppercase
  str = str.toUpperCase()

  // Keep first letter
  let result = str[0]

  // Map of phonetic equivalents
  const map: Record<string, string> = {
    B: "1",
    F: "1",
    P: "1",
    V: "1",
    C: "2",
    G: "2",
    J: "2",
    K: "2",
    Q: "2",
    S: "2",
    X: "2",
    Z: "2",
    D: "3",
    T: "3",
    L: "4",
    M: "5",
    N: "5",
    R: "6",
  }

  // Previous encoded digit
  let previous = "0"

  // Process remaining characters
  for (let i = 1; i < str.length; i++) {
    // Current encoded digit
    const current = map[str[i]] || "0"

    // Add digit to result if it's not a vowel (0) and not the same as previous
    if (current !== "0" && current !== previous) {
      result += current
    }

    // Update previous
    if (current !== "0") {
      previous = current
    }

    // Stop once we have a letter and 3 digits
    if (result.length === 4) break
  }

  // Pad with zeros if necessary
  return (result + "000").slice(0, 4)
}

