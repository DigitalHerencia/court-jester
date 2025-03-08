"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { AlertTriangle, Lock, Shield, Trash2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function PrivacyPage() {
  const { toast } = useToast()
  const [storeData, setStoreData] = useState(false)
  const [anonymousMode, setAnonymousMode] = useState(true)
  const [secureMode, setSecureMode] = useState(true)

  const purgeData = () => {
    // In a real app, this would clear all stored data
    toast({
      title: "Data purged",
      description: "All your data has been permanently deleted from this device.",
    })
  }

  return (
    <main className="container py-6 space-y-6">
      <h1 className="text-4xl normal-case">Privacy Settings</h1>
      <p className="text-xl">Control how your data is handled. Your privacy is our priority.</p>

      <Alert variant="destructive" className="playing-card">
        <AlertTriangle className="h-5 w-5" />
        <AlertTitle className="text-xl">Privacy Notice</AlertTitle>
        <AlertDescription className="text-lg">
          Court Jester is designed with privacy in mind. By default, we don't store any of your data unless you
          explicitly enable storage. All processing happens on your device.
        </AlertDescription>
      </Alert>

      <Card className="playing-card card-border">
        <CardHeader>
          <CardTitle className="text-2xl">Data Storage</CardTitle>
          <CardDescription className="text-lg">Control how your data is stored and processed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="store-data" className="text-lg flex items-center">
                <Lock className="h-5 w-5 mr-2" /> Store Data Locally
              </Label>
              <p className="text-muted-foreground text-base">
                Store your case information on this device for future use
              </p>
            </div>
            <Switch id="store-data" checked={storeData} onCheckedChange={setStoreData} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="anonymous-mode" className="text-lg flex items-center">
                <Shield className="h-5 w-5 mr-2" /> Anonymous Mode
              </Label>
              <p className="text-muted-foreground text-base">
                Use the app without storing any identifiable information
              </p>
            </div>
            <Switch id="anonymous-mode" checked={anonymousMode} onCheckedChange={setAnonymousMode} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="secure-mode" className="text-lg flex items-center">
                <Lock className="h-5 w-5 mr-2" /> Secure Mode
              </Label>
              <p className="text-muted-foreground text-base">Automatically clear data when app is closed</p>
            </div>
            <Switch id="secure-mode" checked={secureMode} onCheckedChange={setSecureMode} />
          </div>
        </CardContent>
      </Card>

      <Card className="playing-card card-border">
        <CardHeader>
          <CardTitle className="text-2xl">Data Purge</CardTitle>
          <CardDescription className="text-lg">Permanently delete all your data from this device</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-lg mb-4">This will permanently delete all your stored data, including:</p>
          <ul className="list-disc list-inside space-y-2 text-lg ml-4">
            <li>Saved court dates</li>
            <li>Generated motions</li>
            <li>Search history</li>
            <li>Personal information</li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button onClick={purgeData} variant="destructive" size="lg" className="text-lg playing-card">
            <Trash2 className="mr-2 h-5 w-5" />
            Purge All Data
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}

