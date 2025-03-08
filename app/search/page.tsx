"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { BottomNav } from "@/components/bottom-nav"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"

type SearchResult = {
  inmateNumber: string
  name: string
  age: number
  location: string
  status: string
}

export default function SearchPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [searchType, setSearchType] = useState("inmateNumber")
  const [jurisdiction, setJurisdiction] = useState("all")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = sessionStorage.getItem("inmateNumber")
    if (!isAuthenticated) {
      router.push("/")
      return
    }

    // Load recent searches from localStorage
    const savedSearches = localStorage.getItem("recentSearches")
    if (savedSearches) {
      try {
        setRecentSearches(JSON.parse(savedSearches))
      } catch (error) {
        console.error("Error parsing recent searches:", error)
        // Reset recent searches if there's an error
        localStorage.removeItem("recentSearches")
      }
    }
  }, [router])

  const handleSearch = async () => {
    if (!searchTerm) {
      toast({
        variant: "destructive",
        title: "¡Oye! Falta información",
        description: "Tienes que poner algo para buscar, carnal",
      })
      return
    }

    setLoading(true)
    setResults([])

    try {
      // Build the search URL based on search type
      let searchUrl = `/api/inmates?jurisdiction=${jurisdiction}`
      if (searchType === "inmateNumber") {
        searchUrl += `&inmateNumber=${encodeURIComponent(searchTerm)}`
      } else if (searchType === "name") {
        searchUrl += `&name=${encodeURIComponent(searchTerm)}`
      } else {
        searchUrl += `&caseNumber=${encodeURIComponent(searchTerm)}`
      }

      const response = await fetch(searchUrl)

      // Check if the response is ok before trying to parse JSON
      if (!response.ok) {
        if (response.status === 404) {
          toast({
            title: "No se encontraron resultados",
            description: "No pudimos encontrar reclusos con esa información.",
          })
          setLoading(false)
          return
        }

        // Try to parse the error message if possible
        let errorMessage = "Search failed"
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
      let data
      try {
        data = await response.json()
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError)
        throw new Error("Invalid response from server")
      }

      // Handle both single result and array of results
      const resultArray = Array.isArray(data) ? data : [data]
      setResults(resultArray)

      // Save to recent searches
      const newSearch = searchTerm
      const updatedSearches = [newSearch, ...recentSearches.filter((s) => s !== newSearch)].slice(0, 5)
      setRecentSearches(updatedSearches)
      localStorage.setItem("recentSearches", JSON.stringify(updatedSearches))

      toast({
        title: "Búsqueda completada",
        description: `Se encontraron ${resultArray.length} resultados.`,
      })
    } catch (error) {
      console.error("Search error:", error)
      toast({
        variant: "destructive",
        title: "Error en la búsqueda",
        description: (error as Error).message || "No pudimos conectar con la base de datos. Intenta más tarde.",
      })
    } finally {
      setLoading(false)
    }
  }

  const viewInmateDetails = (inmateNumber: string, inmateData: any) => {
    sessionStorage.setItem("inmateData", JSON.stringify(inmateData))
    sessionStorage.setItem("inmateNumber", inmateNumber)
    sessionStorage.setItem("jurisdiction", jurisdiction)
    router.push("/dashboard")
  }

  return (
    <main className="min-h-screen pb-16 bg-background">
      <div className="container p-4">
        <div className="flex items-center mb-4">
          <span className="mr-2 text-3xl">🔍</span>
          <h1 className="text-3xl text-primary font-jacquard">Buscar Casos</h1>
        </div>

        <div className="space-y-4">
          <div className="prison-cell">
            <h2 className="mb-4 text-xl text-card-foreground font-jacquard">Buscar por:</h2>

            <div className="space-y-4">
              <div className="flex gap-2">
                <Button
                  variant={searchType === "inmateNumber" ? "default" : "outline"}
                  onClick={() => setSearchType("inmateNumber")}
                  className={`flex-1 ${searchType === "inmateNumber" ? "bg-background text-foreground" : "bg-card text-card-foreground border-muted"}`}
                >
                  🆔 Número
                </Button>
                <Button
                  variant={searchType === "name" ? "default" : "outline"}
                  onClick={() => setSearchType("name")}
                  className={`flex-1 ${searchType === "name" ? "bg-background text-foreground" : "bg-card text-card-foreground border-muted"}`}
                >
                  👤 Nombre
                </Button>
                <Button
                  variant={searchType === "caseNumber" ? "default" : "outline"}
                  onClick={() => setSearchType("caseNumber")}
                  className={`flex-1 ${searchType === "caseNumber" ? "bg-background text-foreground" : "bg-card text-card-foreground border-muted"}`}
                >
                  📋 Caso #
                </Button>
              </div>

              <div className="space-y-2">
                <label htmlFor="jurisdiction" className="text-lg text-card-foreground">
                  Sistema
                </label>
                <Select value={jurisdiction} onValueChange={setJurisdiction}>
                  <SelectTrigger id="jurisdiction" className="bg-card border-border text-card-foreground">
                    <SelectValue placeholder="Selecciona sistema" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-card-foreground">
                    <SelectItem value="all">Todos los sistemas</SelectItem>
                    <SelectItem value="federal">Federal (BOP)</SelectItem>
                    <SelectItem value="nm">New Mexico</SelectItem>
                    <SelectItem value="tx">Texas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="search-term" className="text-lg text-card-foreground">
                  {searchType === "inmateNumber"
                    ? "Número de Preso"
                    : searchType === "name"
                      ? "Nombre Completo"
                      : "Número de Caso"}
                </label>
                <Input
                  id="search-term"
                  placeholder={
                    searchType === "inmateNumber"
                      ? "Ej: 12345-678"
                      : searchType === "name"
                        ? "Ej: Rodriguez Carlos"
                        : "Ej: CR-2023-1234"
                  }
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-card border-border text-card-foreground placeholder:text-muted-foreground"
                />
              </div>

              <Button
                onClick={handleSearch}
                disabled={loading}
                className="w-full bg-background text-foreground hover:bg-background/90"
              >
                {loading ? "Buscando..." : <>🔍 Buscar</>}
              </Button>
            </div>
          </div>

          {results.length > 0 && (
            <div className="prison-cell">
              <h2 className="mb-4 text-xl text-card-foreground font-jacquard">Resultados</h2>
              <div className="space-y-3">
                {results.map((inmate, index) => (
                  <Card key={index} className="bg-card border-border">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">{inmate.name}</h3>
                          <p className="text-sm text-muted-foreground">ID: {inmate.inmateNumber}</p>
                          <p className="text-sm">
                            Edad: {inmate.age} | Ubicación: {inmate.location}
                          </p>
                        </div>
                        <Button
                          onClick={() => viewInmateDetails(inmate.inmateNumber, inmate)}
                          className="bg-background text-foreground hover:bg-background/90"
                        >
                          Ver Detalles
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <div className="prison-cell">
            <h2 className="mb-2 text-xl text-card-foreground font-jacquard">Búsquedas Recientes</h2>
            {recentSearches.length > 0 ? (
              <div className="space-y-2">
                {recentSearches.map((search, index) => (
                  <div
                    key={index}
                    className="p-2 border cursor-pointer border-border bg-card hover:bg-accent"
                    onClick={() => {
                      setSearchTerm(search)
                      handleSearch()
                    }}
                  >
                    <p className="text-card-foreground">{search}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-card-foreground">No hay búsquedas recientes</p>
            )}

            <div className="mt-4">
              <h3 className="mb-2 text-lg font-semibold text-card-foreground">Fuentes de Datos</h3>
              <ul className="space-y-1 text-sm list-disc list-inside text-muted-foreground">
                <li>Federal: Bureau of Prisons Inmate Locator</li>
                <li>New Mexico: NM Corrections Department Offender Search</li>
                <li>Texas: Texas Department of Criminal Justice Offender Search</li>
              </ul>
              <p className="mt-2 text-sm text-muted-foreground">
                Nota: Toda la información proviene de fuentes públicas oficiales.
              </p>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </main>
  )
}

