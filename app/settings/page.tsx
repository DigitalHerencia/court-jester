"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Volume2 } from "lucide-react"

export default function SettingsPage() {
  const { toast } = useToast()
  const [notifications, setNotifications] = useState(true)
  const [fontScale, setFontScale] = useState(100)
  const [highContrast, setHighContrast] = useState(false)
  const [reminderTime, setReminderTime] = useState("1day")
  const [soundEffects, setSoundEffects] = useState(true)

  const saveSettings = () => {
    // In a real app, this would save to localStorage or a database
    toast({
      title: "Settings saved",
      description: "Your preferences have been saved. We'll pretend this matters.",
    })
  }

  return (
    <main className="container py-6 space-y-6">
      <h1 className="text-4xl font-bold">Settings</h1>
      <p className="text-xl">
        Customize your Court Jester experience. Because nothing says "I'm in control of my life" like adjusting app
        settings while ignoring actual responsibilities.
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Accessibility</CardTitle>
          <CardDescription className="text-lg">
            Make Court Jester easier to use. We're all about equal opportunity sarcasm.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="font-scale" className="text-lg">
                Font Size
              </Label>
              <span className="text-lg">{fontScale}%</span>
            </div>
            <Slider
              id="font-scale"
              min={75}
              max={150}
              step={5}
              value={[fontScale]}
              onValueChange={(value) => setFontScale(value[0])}
              className="py-4"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="high-contrast" className="text-lg">
                High Contrast Mode
              </Label>
              <p className="text-muted-foreground text-base">Increase contrast for better visibility</p>
            </div>
            <Switch id="high-contrast" checked={highContrast} onCheckedChange={setHighContrast} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Notifications</CardTitle>
          <CardDescription className="text-lg">
            How often should we nag you about your responsibilities?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="notifications" className="text-lg">
                Enable Notifications
              </Label>
              <p className="text-muted-foreground text-base">Receive reminders for upcoming court dates and tasks</p>
            </div>
            <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reminder-time" className="text-lg">
              Default Reminder Time
            </Label>
            <Select value={reminderTime} onValueChange={setReminderTime}>
              <SelectTrigger id="reminder-time" className="text-lg">
                <SelectValue placeholder="Select reminder time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30min" className="text-lg">
                  30 minutes before
                </SelectItem>
                <SelectItem value="1hour" className="text-lg">
                  1 hour before
                </SelectItem>
                <SelectItem value="1day" className="text-lg">
                  1 day before
                </SelectItem>
                <SelectItem value="2days" className="text-lg">
                  2 days before
                </SelectItem>
                <SelectItem value="1week" className="text-lg">
                  1 week before
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="sound-effects" className="flex items-center gap-2 text-lg">
                <Volume2 className="h-5 w-5" /> Sound Effects
              </Label>
              <p className="text-muted-foreground text-base">Play sounds for notifications and actions</p>
            </div>
            <Switch id="sound-effects" checked={soundEffects} onCheckedChange={setSoundEffects} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">App Installation</CardTitle>
          <CardDescription className="text-lg">
            Install Court Jester as a Progressive Web App for offline access.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-lg mb-4">Installing Court Jester on your device allows you to:</p>
          <ul className="list-disc list-inside space-y-2 text-lg ml-4">
            <li>Access the app even when offline</li>
            <li>Get a home screen icon for quick access</li>
            <li>Receive notifications even when the app is closed</li>
            <li>Have a more app-like experience</li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button size="lg" className="text-lg">
            Install Court Jester
          </Button>
        </CardFooter>
      </Card>

      <div className="flex justify-end">
        <Button onClick={saveSettings} size="lg" className="text-lg">
          Save Settings
        </Button>
      </div>
    </main>
  )
}

