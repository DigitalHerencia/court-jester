import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, Calendar, CheckSquare, Clock } from "lucide-react"

export default function Home() {
  return (
    <main className="container py-6 space-y-8">
      <section className="space-y-4">
        <h1 className="text-4xl font-bold">Welcome to Court Jester</h1>
        <p className="text-xl">
          Your sarcastic assistant for keeping track of court dates and daily tasks. Because nothing says "I've got my
          life together" like needing an app to remind you of your court appearances.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="flex flex-col">
          <CardHeader>
            <CheckSquare className="h-8 w-8 mb-2 text-primary" />
            <CardTitle className="text-2xl">Tasks</CardTitle>
            <CardDescription className="text-lg">
              Keep track of your daily tasks. You know, the ones you'll probably procrastinate on anyway.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-lg">
              Add, complete, and delete tasks with our easy-to-use interface. We'll pretend to be impressed when you
              actually complete them.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full text-lg">
              <Link href="/tasks" className="flex items-center justify-between">
                View Tasks <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <Calendar className="h-8 w-8 mb-2 text-primary" />
            <CardTitle className="text-2xl">Court Dates</CardTitle>
            <CardDescription className="text-lg">
              Because missing court is frowned upon. Like, really frowned upon.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-lg">
              Track your upcoming court appearances, set reminders, and never miss a date with justice again. The judge
              will be so impressed.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full text-lg">
              <Link href="/court-dates" className="flex items-center justify-between">
                View Court Dates <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <Clock className="h-8 w-8 mb-2 text-primary" />
            <CardTitle className="text-2xl">Reminders</CardTitle>
            <CardDescription className="text-lg">
              For when your memory is as reliable as a public defender's case load.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-lg">
              Set reminders for important events and receive notifications even when offline. We'll nag you so the judge
              doesn't have to.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full text-lg">
              <Link href="/tasks" className="flex items-center justify-between">
                Set Reminders <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </section>

      <section className="bg-muted p-6 rounded-lg">
        <h2 className="text-3xl font-bold mb-4">Works Offline</h2>
        <p className="text-xl">
          Court Jester works even when you're offline. Install it as a Progressive Web App for the full experience.
          Because your legal troubles don't care about your data plan.
        </p>
        <div className="mt-4">
          <Button size="lg" className="text-lg">
            Install App
          </Button>
        </div>
      </section>
    </main>
  )
}

