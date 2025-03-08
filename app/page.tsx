"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import { Progress } from "@/components/ui/progress"

export default function LoginPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const router = useRouter()
  const { toast } = useToast()

  const handleSearch = async () => {
    if (!searchTerm) {
      toast({
        title: "¡Oye! Falta información",
        description: "Tienes que poner un número o nombre para buscar, carnal",
      })
      return
    }

    setLoading(true)
    setProgress(0)

    // Start progress animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval)
          return prev
        }
        return prev + 5
      })
    }, 300)

    try {
      // Search across all systems
      const searchUrl = `/api/inmates?jurisdiction=all&inmateNumber=${encodeURIComponent(searchTerm)}&name=${encodeURIComponent(searchTerm)}`

      const response = await fetch(searchUrl)

      // Check if the response is ok before trying to parse JSON
      if (!response.ok) {
        // Try to parse the error message if possible
        let errorMessage = "Failed to find inmate"
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch (parseError) {
          // If we can't parse the JSON, use the status text
          errorMessage = response.statusText || errorMessage
        }
        throw new Error(errorMessage)
      }

      // Now we know the response is ok, parse the JSON
      let foundInmate
      try {
        foundInmate = await response.json()
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError)
        throw new Error("Invalid response from server")
      }

      // Complete the progress bar
      setProgress(100)
      clearInterval(progressInterval)

      // Store the inmate data in session storage
      sessionStorage.setItem("inmateData", JSON.stringify(foundInmate))
      sessionStorage.setItem("inmateNumber", foundInmate.inmateNumber)
      sessionStorage.setItem("jurisdiction", "all")

      await requestPermissions()
      router.push("/dashboard")
    } catch (error) {
      console.error("Search error:", error)
      clearInterval(progressInterval)
      setProgress(0)
      toast({
        title: "Búsqueda fallida",
        description:
          (error as Error).message || "No pudimos encontrar ese recluso o hubo un problema con la conexión. Intenta de nuevo.",
      })
    } finally {
      setLoading(false)
    }
  }

  const requestPermissions = async () => {
    try {
      if ("Notification" in window) {
        await Notification.requestPermission()
      }

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(() => {})
      }

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        stream.getTracks().forEach((track) => track.stop())
      }
    } catch (error) {
      console.error("Permission error:", error)
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <div className="w-full max-w-xs text-center sm:max-w-sm">
        <h1 className="mb-2 text-4xl normal-case sm:text-6xl font-jacquard text-foreground">Court Jester</h1>
        <p className="mb-6 text-xl sm:text-2xl text-foreground">Tu camarada en la sombra</p>

        <Image
          src="https://a5fvmmg873kgkibm.public.blob.vercel-storage.com/joker-playing-card_u-l-q1llfru0-2PTb0ITbdBAzW3qdjZAAdvKLvNLRsK.jpeg"
          alt="Court Jester"
          width={150}
          height={200}
          className="mx-auto mb-6"
        />

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 mb-4 text-lg text-center border border-primary bg-card text-foreground"
          placeholder="Número de preso"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch()
          }}
        />

        {loading && (
          <div className="mb-4">
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <button
          onClick={handleSearch}
          disabled={loading}
          className="w-full bg-primary text-primary-foreground p-3 mb-6 text-lg min-h-[50px]"
        >
          {loading ? "BUSCANDO..." : "BUSCAR AHORA"}
        </button>

        <p className="text-sm text-foreground">Versión 3.0 • "La Pinta Edition" • Sin vigilancia</p>
      </div>
    </main>
  )
}

