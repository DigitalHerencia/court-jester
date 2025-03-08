"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Scale, Calendar, MapPin } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"

type Case = {
  id: string
  caseNumber: string
  title: string
  court: string
  date: string
  status: string
  type: string
}

export default function CasesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [cases, setCases] = useState<Case[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = sessionStorage.getItem("inmateNumber")
    if (!isAuthenticated) {
      router.push("/")
      return
    }

    // Auto-fetch cases
    fetchCases()
  }, [router])

  const fetchCases = async () => {
    setLoading(true)
    try {
      // Get inmate data from session storage
      const inmateDataStr = sessionStorage.getItem("inmateData")
      if (!inmateDataStr) {
        throw new Error("No inmate data found")
      }

      const inmateData = JSON.parse(inmateDataStr)

      // Generate mock cases based on inmate data
      // In a real app, this would be an API call
      const mockCases = generateMockCases(inmateData)
      setCases(mockCases)

      toast({
        title: "Casos actualizados",
        description: `Se encontraron ${mockCases.length} casos asociados.`,
      })
    } catch (error) {
      console.error("Error fetching cases:", error)
      toast({
        variant: "destructive",
        title: "Error al cargar casos",
        description: "No pudimos cargar tus casos. Intenta más tarde.",
      })
    } finally {
      setLoading(false)
    }
  }

  const generateMockCases = (inmateData: any): Case[] => {
    // Generate cases based on inmate data
    const mockCases: Case[] = []

    // Use court dates from inmate data if available
    if (inmateData.courtDates && inmateData.courtDates.length > 0) {
      inmateData.courtDates.forEach((courtDate: any, index: number) => {
        mockCases.push({
          id: `case-${index + 1}`,
          caseNumber: `CR-${new Date().getFullYear()}-${1000 + index}`,
          title: courtDate.type || "Audiencia",
          court: courtDate.location || "Tribunal Municipal",
          date: courtDate.date || new Date().toISOString().split("T")[0],
          status: ["Activo", "Pendiente", "En proceso"][Math.floor(Math.random() * 3)],
          type: ["Criminal", "Civil", "Administrativo"][Math.floor(Math.random() * 3)],
        })
      })
    }

    // Add charges from inmate data if available
    if (inmateData.charges && inmateData.charges.length > 0) {
      inmateData.charges.forEach((charge: any, index: number) => {
        mockCases.push({
          id: `charge-${index + 1}`,
          caseNumber: charge.courtCase || `CR-${new Date().getFullYear()}-${2000 + index}`,
          title: charge.description || "Cargo sin especificar",
          court: "Tribunal de Primera Instancia",
          date: charge.arrestDate || new Date().toISOString().split("T")[0],
          status: "Activo",
          type: "Criminal",
        })
      })
    }

    // If no cases were generated, add some default ones
    if (mockCases.length === 0) {
      mockCases.push(
        {
          id: "case-1",
          caseNumber: `CR-${new Date().getFullYear()}-1001`,
          title: "Posesión de sustancias controladas",
          court: "Tribunal Municipal",
          date: new Date().toISOString().split("T")[0],
          status: "Activo",
          type: "Criminal",
        },
        {
          id: "case-2",
          caseNumber: `CR-${new Date().getFullYear()}-1002`,
          title: "Conducir bajo influencia",
          court: "Tribunal de Tránsito",
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          status: "Pendiente",
          type: "Criminal",
        },
      )
    }

    return mockCases
  }

  const viewCaseDetails = (caseId: string) => {
    // In a real app, this would navigate to a case detail page
    toast({
      title: "Función en desarrollo",
      description: "Los detalles del caso estarán disponibles próximamente.",
    })
  }

  return (
    <main className="min-h-screen bg-background pb-16">
      <div className="container p-4">
        <div className="flex items-center mb-4">
          <Scale className="h-6 w-6 mr-2 text-foreground" />
          <h1 className="text-3xl text-primary font-jacquard normal-case">Mis Casos</h1>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-lg">Cargando casos...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cases.length === 0 ? (
              <Card className="bg-card">
                <CardContent className="p-6">
                  <p className="text-center text-lg text-muted-foreground">
                    No se encontraron casos asociados a tu perfil.
                  </p>
                </CardContent>
              </Card>
            ) : (
              cases.map((caseItem) => (
                <Card key={caseItem.id} className="bg-card">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          <Scale className="h-5 w-5 mr-2 text-primary" />
                          <h3 className="text-xl font-semibold">{caseItem.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">Caso #: {caseItem.caseNumber}</p>
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                            <p className="text-sm">{caseItem.court}</p>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            <p className="text-sm">{caseItem.date}</p>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center space-x-2">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              caseItem.status === "Activo"
                                ? "bg-green-100 text-green-800"
                                : caseItem.status === "Pendiente"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {caseItem.status}
                          </span>
                          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                            {caseItem.type}
                          </span>
                        </div>
                      </div>
                      <Button
                        onClick={() => viewCaseDetails(caseItem.id)}
                        variant="outline"
                        className="bg-background text-foreground hover:bg-background/90"
                      >
                        Ver Detalles
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        <div className="mt-4">
          <Button
            onClick={fetchCases}
            className="w-full bg-background text-foreground hover:bg-background/90"
            disabled={loading}
          >
            <Scale className="h-5 w-5 mr-2" />
            {loading ? "Actualizando..." : "Actualizar Casos"}
          </Button>
        </div>

        <p className="text-sm text-muted-foreground mt-4">
          Tip de la yarda: Mantén un registro de todos tus casos. Los jueces aprecian cuando estás al tanto de tus
          asuntos legales.
        </p>
      </div>

      <BottomNav />
    </main>
  )
}

