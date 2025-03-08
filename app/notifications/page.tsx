"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { BottomNav } from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"
import { es } from "date-fns/locale"

type CourtDate = {
  date: string
  time: string
  type: string
  location: string
  judge: string
  source?: string
}

export default function NotificationsPage() {
  const router = useRouter()
  const [courtDates, setCourtDates] = useState<CourtDate[]>([])
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)

  useEffect(() => {
    // Check if user is authenticated
    const storedInmateNumber = sessionStorage.getItem("inmateNumber")
    const storedInmateData = sessionStorage.getItem("inmateData")

    if (!storedInmateNumber || !storedInmateData) {
      router.push("/")
      return
    }

    // Get court dates from inmate data
    const inmateData = JSON.parse(storedInmateData)
    if (inmateData.courtDates) {
      setCourtDates(inmateData.courtDates)
    }

    // Check if notifications are enabled
    if ("Notification" in window) {
      setNotificationsEnabled(Notification.permission === "granted")
    }
  }, [router])

  const enableNotifications = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission()
      setNotificationsEnabled(permission === "granted")

      if (permission === "granted") {
        // Test notification
        new Notification("Notificaciones Activadas", {
          body: "Recibirás alertas para tus fechas de corte",
          icon: "/icon.png",
        })
      }
    }
  }

  return (
    <main className="min-h-screen bg-background pb-16">
      <div className="container p-4">
        <div className="flex items-center mb-4">
          <span className="text-3xl mr-2">🔔</span>
          <h1 className="text-3xl text-primary font-jacquard normal-case">Notificaciones</h1>
        </div>

        <div className="space-y-4">
          <div className="prison-cell">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <span className="text-2xl mr-2">🔔</span>
                <h2 className="text-xl text-card-foreground font-jacquard normal-case">Alertas</h2>
              </div>
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={() => {
                  if (!notificationsEnabled) {
                    enableNotifications()
                  }
                }}
              />
            </div>

            {!notificationsEnabled && (
              <div className="mb-4">
                <p className="text-card-foreground mb-2">
                  Las notificaciones están desactivadas. Actívalas para recibir alertas sobre tus fechas de corte.
                </p>
                <Button onClick={enableNotifications} className="bg-background text-foreground hover:bg-background/90">
                  Activar Notificaciones
                </Button>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="notify-day-before" className="text-card-foreground">
                  Notificar un día antes
                </Label>
                <Switch id="notify-day-before" checked={true} />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="notify-morning-of" className="text-card-foreground">
                  Notificar la mañana del día
                </Label>
                <Switch id="notify-morning-of" checked={true} />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="notify-hour-before" className="text-card-foreground">
                  Notificar una hora antes
                </Label>
                <Switch id="notify-hour-before" checked={true} />
              </div>
            </div>
          </div>

          <div className="prison-cell">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-2">📅</span>
              <h2 className="text-xl text-card-foreground font-jacquard normal-case">Próximas Alertas</h2>
            </div>

            {courtDates.length > 0 ? (
              <div className="space-y-4">
                {courtDates.map((courtDate, index) => {
                  const dateObj = new Date(courtDate.date + "T" + courtDate.time)
                  const isUpcoming = dateObj > new Date()

                  return isUpcoming ? (
                    <div key={index} className="border-l-2 border-muted pl-3">
                      <div className="flex items-center">
                        <span className="text-xl mr-2">📆</span>
                        <p className="text-card-foreground">
                          {format(new Date(courtDate.date), "d 'de' MMMM, yyyy", { locale: es })}
                        </p>
                      </div>
                      <div className="flex items-center mt-1">
                        <span className="text-xl mr-2">⏰</span>
                        <p className="text-card-foreground">{courtDate.time}</p>
                      </div>
                      <p className="text-card-foreground mt-1">{courtDate.type}</p>
                      <p className="text-card-foreground">{courtDate.location}</p>

                      <div className="mt-2 text-sm text-muted-foreground">
                        <p>Alertas programadas:</p>
                        <ul className="list-disc list-inside">
                          <li>
                            {format(new Date(courtDate.date), "d 'de' MMMM", { locale: es })} (día antes) - 9:00 AM
                          </li>
                          <li>{format(new Date(courtDate.date), "d 'de' MMMM", { locale: es })} - 7:00 AM</li>
                          <li>
                            {format(new Date(courtDate.date), "d 'de' MMMM", { locale: es })} - {courtDate.time} (1 hora
                            antes)
                          </li>
                        </ul>
                      </div>
                    </div>
                  ) : null
                })}
              </div>
            ) : (
              <p className="text-card-foreground">No hay fechas de corte programadas</p>
            )}

            <p className="text-sm text-muted-foreground mt-4">
              Tip de la yarda: Nunca llegues tarde a corte. Los jueces no perdonan.
            </p>
          </div>
        </div>
      </div>

      <BottomNav />
    </main>
  )
}

