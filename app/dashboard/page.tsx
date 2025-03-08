"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

type InmateData = {
  inmateNumber: string
  name: string
  age: number
  race: string
  sex: string
  releaseDate: string
  location: string
  status: string
  securityLevel: string
  height?: string
  weight?: string
  hair?: string
  eyes?: string
  skin?: string
  address?: string
  courtDates: {
    date: string
    time: string
    type: string
    location: string
    judge: string
    source?: string
  }[]
  charges?: {
    statute: string
    description: string
    arrestLocation: string
    arrestDate: string
    warrantNo: string
    courtCase: string
    bondAmount: string
  }[]
}

export default function DashboardPage() {
  const router = useRouter()
  const [inmateData, setInmateData] = useState<InmateData | null>(null)
  const [jurisdiction, setJurisdiction] = useState<string>("")
  const [lastUpdated, setLastUpdated] = useState<string>("")

  useEffect(() => {
    // Check if user is authenticated
    const storedInmateNumber = sessionStorage.getItem("inmateNumber")
    const storedInmateData = sessionStorage.getItem("inmateData")
    const storedJurisdiction = sessionStorage.getItem("jurisdiction")

    if (!storedInmateNumber || !storedInmateData) {
      router.push("/")
      return
    }

    const data = JSON.parse(storedInmateData)

    // Add mock charges if not present
    if (!data.charges) {
      data.charges = [
        {
          statute: "21A",
          description: "Liquor or Drugs",
          arrestLocation: "CHARA/ HWY 478",
          arrestDate: new Date().toLocaleDateString(),
          warrantNo: "N/A",
          courtCase: "N/A",
          bondAmount: "0",
        },
        {
          statute: "58UC",
          description: "Tail Lamps",
          arrestLocation: "CHARA/ HWY 478",
          arrestDate: new Date().toLocaleDateString(),
          warrantNo: "N/A",
          courtCase: "N/A",
          bondAmount: "0",
        },
      ]
    }

    setInmateData(data)
    setJurisdiction(storedJurisdiction || "federal")

    // Set last updated date
    const now = new Date()
    setLastUpdated(`Last updated: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`)

    // Schedule notifications for court dates
    if ("Notification" in window && Notification.permission === "granted") {
      scheduleCourtDateNotifications(data.courtDates)
    }
  }, [router])

  const scheduleCourtDateNotifications = (courtDates: InmateData["courtDates"]) => {
    courtDates.forEach((courtDate) => {
      const dateObj = new Date(courtDate.date + "T" + courtDate.time)

      // Schedule notification for 1 day before
      const oneDayBefore = new Date(dateObj)
      oneDayBefore.setDate(oneDayBefore.getDate() - 1)
      oneDayBefore.setHours(9, 0, 0, 0)

      const now = new Date()
      if (oneDayBefore > now) {
        const timeUntilNotification = oneDayBefore.getTime() - now.getTime()
        setTimeout(() => {
          new Notification("Recordatorio de Corte", {
            body: `Tienes corte mañana a las ${courtDate.time} - ${courtDate.type}`,
            icon: "/icon.png",
          })
        }, timeUntilNotification)
      }
    })
  }

  if (!inmateData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-xl">Cargando...</p>
      </div>
    )
  }

  return (
    <main className="container mx-auto p-4 bg-background max-w-3xl">
      <div className="border-b border-primary/20 pb-2">
        <h1 className="text-2xl font-bold normal-case">Inmate Booking Report</h1>
        <div className="flex justify-between text-sm">
          <p>jcms_public - (Guest)</p>
          <p>{lastUpdated}</p>
        </div>
        <div className="mt-2">
          <span className="bg-primary text-background px-1 font-bold normal-case">Current</span> | PDF - Face Sheet
        </div>
      </div>

      <div className="booking-section">
        <h2 className="booking-header normal-case">Booking Details</h2>
        <div className="flex justify-between">
          <div className="w-2/3">
            <p>
              <span className="booking-label">Booking No:</span>
              <span className="booking-value text-primary">{inmateData.inmateNumber}</span>
            </p>
            <p>
              <span className="booking-label">Booking Date/Time:</span>
              <span className="booking-value">
                {new Date().toLocaleDateString()}{" "}
                {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </p>
          </div>
          <div className="w-1/3">
            {/* Placeholder for mugshot */}
            <div className="w-32 h-40 bg-card border border-primary/20 flex items-center justify-center">
              <span className="text-muted-foreground">Mugshot</span>
            </div>
          </div>
        </div>
      </div>

      <div className="booking-section">
        <h2 className="booking-header normal-case">Personal Information</h2>
        <p>
          <span className="booking-label">Name:</span>
          <span className="booking-value">{inmateData.name}</span>
        </p>
        <p>
          <span className="booking-label">Address:</span>
          <span className="booking-value">{inmateData.address || inmateData.location}</span>
        </p>
        <p>
          <span className="booking-label">Sex:</span>
          <span className="booking-value">{inmateData.sex.charAt(0)}</span>
          <span className="booking-label ml-4">Race:</span>
          <span className="booking-value">{inmateData.race.charAt(0)}</span>
        </p>
        <p>
          <span className="booking-label">Hair:</span>
          <span className="booking-value">{inmateData.hair || "BRO"}</span>
          <span className="booking-label ml-4">Eyes:</span>
          <span className="booking-value">{inmateData.eyes || "BRO"}</span>
          <span className="booking-label ml-4">Height:</span>
          <span className="booking-value">{inmateData.height || "5'10"}</span>
          <span className="booking-label ml-4">Weight:</span>
          <span className="booking-value">{inmateData.weight || "185"}</span>
        </p>
        <p>
          <span className="booking-label">Age:</span>
          <span className="booking-value">{inmateData.age}</span>
        </p>
      </div>

      <div className="booking-section">
        <h2 className="booking-header normal-case">Charges</h2>

        {inmateData.charges &&
          inmateData.charges.map((charge, index) => (
            <div key={index} className="mb-4 border border-primary/20">
              <div className="charge-row bg-background/80">
                <div className="charge-cell">
                  <span className="booking-label">Statute:</span> {charge.statute}
                </div>
                <div className="charge-cell">{charge.description}</div>
                <div className="charge-cell">
                  <span className="booking-label">Charge Type:</span> MIS
                </div>
              </div>

              <div className="charge-row bg-background/50">
                <div className="charge-cell">
                  <span className="booking-label">Arrest Location:</span> {charge.arrestLocation}
                </div>
                <div className="charge-cell">
                  <span className="booking-label">Arrest Agency:</span> DASO
                </div>
                <div className="charge-cell">
                  <span className="booking-label">Judge:</span> MAGISTRATE
                </div>
              </div>

              <div className="charge-row bg-background/80">
                <div className="charge-cell">
                  <span className="booking-label">Arrest Date/Time:</span> {charge.arrestDate}
                </div>
                <div className="charge-cell">
                  <span className="booking-label">Warrant:</span>
                </div>
                <div className="charge-cell">
                  <span className="booking-label">Warrant Type:</span>
                </div>
              </div>

              <div className="charge-row bg-background/50">
                <div className="charge-cell">
                  <span className="booking-label">Court Case:</span> {charge.courtCase}
                </div>
                <div className="charge-cell">
                  <span className="booking-label">Court:</span> MAG
                </div>
                <div className="charge-cell">
                  <span className="booking-label">Court Date:</span> N/A
                </div>
              </div>

              <div className="charge-row bg-background/80">
                <div className="charge-cell">
                  <span className="booking-label">Bond Amount:</span> {charge.bondAmount}
                </div>
                <div className="charge-cell">
                  <span className="booking-label">Bond Type:</span> NO BOND
                </div>
                <div className="charge-cell">
                  <span className="booking-label">Bail Amount:</span>
                </div>
              </div>
            </div>
          ))}
      </div>

      <div className="mt-6 flex justify-center">
        <Button onClick={() => router.push("/")} className="px-6 py-2 bg-primary text-background normal-case">
          Salir
        </Button>
      </div>
    </main>
  )
}

