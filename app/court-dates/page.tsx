"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn, formatDate, formatTime } from "@/lib/utils"
import { CalendarIcon, Clock, Gavel, Trash2, Bell } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

type CourtDate = {
  id: string
  title: string
  date: Date
  location: string
  notes?: string
  reminder: boolean
}

export default function CourtDatesPage() {
  const { toast } = useToast()
  const [courtDates, setCourtDates] = useState<CourtDate[]>([
    {
      id: "1",
      title: "Hearing for speeding ticket",
      date: new Date(2023, 5, 15, 9, 30),
      location: "Municipal Court - Room 302",
      notes: "Bring evidence of speedometer calibration",
      reminder: true,
    },
    {
      id: "2",
      title: "Case management conference",
      date: new Date(2023, 6, 22, 10, 0),
      location: "County Courthouse - Room 401",
      reminder: false,
    },
  ])

  const [date, setDate] = useState<Date>()
  const [title, setTitle] = useState("")
  const [location, setLocation] = useState("")
  const [notes, setNotes] = useState("")
  const [reminder, setReminder] = useState(true)

  const addCourtDate = () => {
    if (!title || !date || !location) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields. The judge won't accept excuses, and neither do we.",
        variant: "destructive",
      })
      return
    }

    const courtDate: CourtDate = {
      id: Date.now().toString(),
      title,
      date,
      location,
      notes: notes || undefined,
      reminder,
    }

    setCourtDates([...courtDates, courtDate])

    // Reset form
    setTitle("")
    setDate(undefined)
    setLocation("")
    setNotes("")
    setReminder(true)

    toast({
      title: "Court date added",
      description: `"${title}" has been added to your calendar. Don't worry, we'll remind you... repeatedly.`,
    })
  }

  const deleteCourtDate = (id: string) => {
    const dateToDelete = courtDates.find((date) => date.id === id)
    setCourtDates(courtDates.filter((date) => date.id !== id))

    toast({
      title: "Court date deleted",
      description: `"${dateToDelete?.title}" has been deleted. We hope that's because it was resolved, not because you're skipping it.`,
      variant: "destructive",
    })
  }

  // Sort court dates by date (earliest first)
  const sortedCourtDates = [...courtDates].sort((a, b) => a.date.getTime() - b.date.getTime())

  return (
    <main className="container py-4 sm:py-6 space-y-4 sm:space-y-6 px-4 sm:px-6">
      <h1 className="text-3xl sm:text-4xl">Court Dates</h1>
      <p className="text-lg sm:text-xl">
        Keep track of your court appearances. Because "I forgot" isn't a legal defense.
      </p>

      <Card className="playing-card card-border">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">Add New Court Date</CardTitle>
          <CardDescription className="text-base sm:text-lg">
            Another date with justice? Let's get it on the calendar.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base sm:text-lg">
              Title
            </Label>
            <Input
              id="title"
              placeholder="e.g., Speeding Ticket Hearing"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-base sm:text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="text-base sm:text-lg">
              Date and Time
            </Label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal text-base sm:text-lg",
                      !date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-5 w-5" />
                    {date ? format(date, "PPP") : <span>Select date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>

              <Input
                type="time"
                className="text-base sm:text-lg"
                onChange={(e) => {
                  if (date && e.target.value) {
                    const [hours, minutes] = e.target.value.split(":").map(Number)
                    const newDate = new Date(date)
                    newDate.setHours(hours, minutes)
                    setDate(newDate)
                  }
                }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-base sm:text-lg">
              Location
            </Label>
            <Input
              id="location"
              placeholder="e.g., Municipal Court - Room 302"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="text-base sm:text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-base sm:text-lg">
              Notes (Optional)
            </Label>
            <Textarea
              id="notes"
              placeholder="Any additional details..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="text-base sm:text-lg min-h-[100px]"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="reminder" checked={reminder} onCheckedChange={setReminder} />
            <Label htmlFor="reminder" className="text-base sm:text-lg">
              Set reminder for this court date
            </Label>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={addCourtDate} size="lg" className="text-base sm:text-lg w-full playing-card">
            Add Court Date
          </Button>
        </CardFooter>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl">Upcoming Court Dates</h2>
        {sortedCourtDates.length === 0 ? (
          <Card className="playing-card card-border">
            <CardContent className="p-4 sm:p-6">
              <p className="text-base sm:text-xl text-center text-muted-foreground">
                No court dates scheduled. Congratulations on your law-abiding lifestyle... for now.
              </p>
            </CardContent>
          </Card>
        ) : (
          sortedCourtDates.map((courtDate) => (
            <Card key={courtDate.id} className="playing-card card-border">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <Gavel className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 text-primary" />
                      <h3 className="text-lg sm:text-2xl">{courtDate.title}</h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteCourtDate(courtDate.id)}
                      className="h-9 w-9 sm:h-10 sm:w-10"
                    >
                      <Trash2 className="h-5 w-5 sm:h-6 sm:w-6" />
                      <span className="sr-only">Delete court date</span>
                    </Button>
                  </div>

                  <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-muted-foreground" />
                      <span className="text-base sm:text-lg">{formatDate(courtDate.date)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-muted-foreground" />
                      <span className="text-base sm:text-lg">{formatTime(courtDate.date)}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-base sm:text-lg">
                      <strong>Location:</strong> {courtDate.location}
                    </p>
                    {courtDate.notes && (
                      <div className="mt-2">
                        <p className="text-base sm:text-lg">
                          <strong>Notes:</strong>
                        </p>
                        <p className="text-base sm:text-lg text-muted-foreground">{courtDate.notes}</p>
                      </div>
                    )}
                    <div className="mt-2 flex items-center">
                      <Bell
                        className={`h-4 w-4 sm:h-5 sm:w-5 mr-2 ${courtDate.reminder ? "text-primary" : "text-muted-foreground"}`}
                      />
                      <span className="text-base sm:text-lg">
                        {courtDate.reminder ? "Reminder set" : "No reminder"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </main>
  )
}

