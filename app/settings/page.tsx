"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { BottomNav } from "@/components/bottom-nav"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SettingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [language, setLanguage] = useState("spanglish")
  const [secureMode, setSecureMode] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = sessionStorage.getItem("inmateNumber")
    if (!isAuthenticated) {
      router.push("/")
    }
  }, [router])

  const purgeData = () => {
    // Clear all stored data
    sessionStorage.clear()
    localStorage.clear()

    toast({
      title: "Datos borrados",
      description: "Todos tus datos han sido eliminados permanentemente.",
    })

    // Redirect to login
    setTimeout(() => {
      router.push("/")
    }, 1500)
  }

  const logout = () => {
    // Clear session data
    sessionStorage.removeItem("inmateNumber")
    sessionStorage.removeItem("inmateData")
    sessionStorage.removeItem("jurisdiction")

    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión exitosamente.",
    })

    // Redirect to login
    router.push("/")
  }

  return (
    <main className="min-h-screen bg-background pb-16">
      <div className="container p-4">
        <div className="flex items-center mb-4">
          <span className="text-3xl mr-2">⚙️</span>
          <h1 className="text-3xl text-primary font-jacquard normal-case">Configuración</h1>
        </div>

        <div className="space-y-4">
          <div className="prison-cell">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-2">🎨</span>
              <h2 className="text-xl text-card-foreground font-jacquard normal-case">Apariencia</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="text-xl mr-2">🗣️</span>
                  <Label htmlFor="language" className="text-card-foreground">
                    Lenguaje
                  </Label>
                </div>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger id="language" className="bg-card border-border text-card-foreground">
                    <SelectValue placeholder="Selecciona lenguaje" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-card-foreground">
                    <SelectItem value="spanglish">Spanglish (Chicano)</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="prison-cell">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-2">🔒</span>
              <h2 className="text-xl text-card-foreground font-jacquard normal-case">Privacidad</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="secure-mode" className="text-card-foreground">
                  Modo Seguro (borrar datos al cerrar)
                </Label>
                <Switch id="secure-mode" checked={secureMode} onCheckedChange={setSecureMode} />
              </div>

              <Button onClick={purgeData} variant="destructive" className="w-full">
                🗑️ Borrar Todos los Datos
              </Button>
            </div>

            <p className="text-sm text-muted-foreground mt-4">
              Tip de la yarda: Siempre borra tus datos cuando termines. Los ojos están en todos lados.
            </p>
          </div>

          <Button
            onClick={logout}
            variant="outline"
            className="w-full bg-background text-foreground hover:bg-background/90"
          >
            🚪 Cerrar Sesión
          </Button>

          <div className="text-center text-sm text-muted-foreground mt-4">
            <p>Versión 2.5 • "La Pinta Edition" • Sin vigilancia</p>
            <p className="mt-1">Hecho con 💯 respeto para la raza</p>
          </div>
        </div>
      </div>

      <BottomNav />
    </main>
  )
}

