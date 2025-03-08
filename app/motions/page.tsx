"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { BottomNav } from "@/components/bottom-nav"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type InmateData = {
  inmateNumber: string
  name: string
  location: string
}

export default function MotionsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [inmateData, setInmateData] = useState<InmateData | null>(null)
  const [caseNumber, setCaseNumber] = useState("")
  const [court, setCourt] = useState("")
  const [motionType, setMotionType] = useState("")
  const [reason, setReason] = useState("")
  const [generatedMotion, setGeneratedMotion] = useState("")

  useEffect(() => {
    // Check if user is authenticated
    const storedInmateNumber = sessionStorage.getItem("inmateNumber")
    const storedInmateData = sessionStorage.getItem("inmateData")

    if (!storedInmateNumber || !storedInmateData) {
      router.push("/")
      return
    }

    setInmateData(JSON.parse(storedInmateData))
    setCourt("Justice Court of El Paso County") // Default value
  }, [router])

  const generateMotion = () => {
    if (!inmateData || !caseNumber || !court || !motionType) {
      toast({
        variant: "destructive",
        title: "Falta información carnal",
        description: "Llena todos los campos requeridos para generar tu moción.",
      })
      return
    }

    let motionText = ""

    if (motionType === "continuance") {
      motionText = `
IN THE JUSTICE COURT OF EL PASO COUNTY, TEXAS

PRECINCT 7


THE STATE OF TEXAS                                   §
                                               §
VS.                                                 §          CASE NO. ${caseNumber}
                                                       §
${inmateData.name}                            §



MOTION FOR CONTINUANCE

TO THE HONORABLE JUDGE:
         Comes now the Defendant, ${inmateData.name}, and respectfully submits this
Motion for Continuance for the court hearing, and in support thereof states the
following:

1. ${reason || "The Defendant requires additional time to prepare for the hearing."}

2. The Defendant's inability to attend constitutes good cause for a continuance under the
rules of this Court and to ensure the Defendant's constitutional right to a fair hearing.

3. The Defendant requests that the Court reschedule the hearing to allow for the
Defendant's attendance and ensure due process.

4. The Defendant asserts that this request is made in good faith and not for the purpose of
delay.

             Respectfully submitted,
                                                                             
                                                                           By:_________________________
                                                                           ${inmateData.name}
      `
    } else if (motionType === "suppress") {
      motionText = `
IN THE JUSTICE COURT OF EL PASO COUNTY, TEXAS

PRECINCT 7


THE STATE OF TEXAS                                      §
                                                §
VS.                                                  §          CASE NO. ${caseNumber}
                                                                            §
${inmateData.name}                           §



MOTION TO SUPPRESS EVIDENCE

TO THE HONORABLE JUDGE:
         COMES NOW the Defendant in the above-entitled and numbered cause, and makes this
Motion to Suppress Evidence, and in support thereof would show the Court as follows:

I.
The defendant, ${inmateData.name}, respectfully moves this court to suppress
all evidence obtained for the following reasons:

● ${reason || "Lack of Probable Cause: The search was conducted without probable cause."}

II.
Legal Basis: This motion is based on the Fourth Amendment of the United States Constitution
and Article I, Section 9 of the Texas Constitution, which protect against unreasonable searches
and seizures.

III.
Conclusion: Based on the above arguments, the defendant requests that all evidence obtained
during the search be suppressed.

             Respectfully submitted,
                                                                             
                                                                           By:_________________________
                                                                           ${inmateData.name}
      `
    }

    setGeneratedMotion(motionText)

    toast({
      title: "Moción generada",
      description: "Tu moción legal ha sido generada. Ahora puedes descargarla o copiarla.",
    })
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedMotion)
    toast({
      title: "Copiado al portapapeles",
      description: "La moción ha sido copiada al portapapeles.",
    })
  }

  const downloadMotion = () => {
    const element = document.createElement("a")
    const file = new Blob([generatedMotion], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `${motionType}-motion-${caseNumber}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)

    toast({
      title: "Moción descargada",
      description: "Tu moción ha sido descargada como archivo de texto.",
    })
  }

  if (!inmateData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-xl text-foreground">Cargando...</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background pb-16">
      <div className="container p-4">
        <div className="flex items-center mb-4">
          <span className="text-3xl mr-2">📝</span>
          <h1 className="text-3xl text-primary font-jacquard normal-case">Generador de Mociones</h1>
        </div>

        <div className="space-y-4">
          {!generatedMotion ? (
            <div className="prison-cell">
              <h2 className="text-xl text-card-foreground mb-4 font-jacquard normal-case">Información de la Moción</h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-lg text-card-foreground">Nombre</label>
                  <Input value={inmateData.name} disabled className="bg-card border-border text-card-foreground" />
                </div>

                <div className="space-y-2">
                  <label htmlFor="case-number" className="text-lg text-card-foreground">
                    Número de Caso
                  </label>
                  <Input
                    id="case-number"
                    placeholder="Ej: 724-02653-TR"
                    value={caseNumber}
                    onChange={(e) => setCaseNumber(e.target.value)}
                    className="bg-card border-border text-card-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="court" className="text-lg text-card-foreground">
                    Corte
                  </label>
                  <Input
                    id="court"
                    placeholder="Ej: Justice Court of El Paso County"
                    value={court}
                    onChange={(e) => setCourt(e.target.value)}
                    className="bg-card border-border text-card-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="motion-type" className="text-lg text-card-foreground">
                    Tipo de Moción
                  </label>
                  <Select value={motionType} onValueChange={setMotionType}>
                    <SelectTrigger id="motion-type" className="bg-card border-border text-card-foreground">
                      <SelectValue placeholder="Selecciona tipo de moción" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-card-foreground">
                      <SelectItem value="continuance">Moción para Continuación</SelectItem>
                      <SelectItem value="suppress">Moción para Suprimir Evidencia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="reason" className="text-lg text-card-foreground">
                    Razón de la Moción
                  </label>
                  <Textarea
                    id="reason"
                    placeholder="Explica por qué estás presentando esta moción..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="bg-card border-border text-card-foreground min-h-[100px] placeholder:text-muted-foreground"
                  />
                </div>

                <Button
                  onClick={generateMotion}
                  className="w-full bg-background text-foreground hover:bg-background/90"
                >
                  📝 Generar Moción
                </Button>
              </div>
            </div>
          ) : (
            <div className="prison-cell">
              <h2 className="text-xl text-card-foreground mb-4 font-jacquard normal-case">Moción Generada</h2>

              <div className="bg-background p-4 rounded-md overflow-auto max-h-[500px] whitespace-pre-line font-mono text-sm text-foreground border border-border">
                {generatedMotion}
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  className="flex-1 bg-background text-foreground hover:bg-background/90"
                >
                  📋 Copiar
                </Button>
                <Button
                  onClick={downloadMotion}
                  className="flex-1 bg-background text-foreground hover:bg-background/90"
                >
                  📥 Descargar
                </Button>
              </div>

              <Button
                onClick={() => setGeneratedMotion("")}
                variant="outline"
                className="w-full mt-2 bg-background text-foreground hover:bg-background/90"
              >
                🔄 Crear Nueva Moción
              </Button>

              <p className="text-sm text-muted-foreground mt-4">
                Tip de la yarda: Siempre lee cuidadosamente antes de presentar. Un error puede costarte tiempo valioso.
              </p>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </main>
  )
}

