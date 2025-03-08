"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

type Task = {
  id: string
  title: string
  completed: boolean
  dueDate?: Date
}

export default function TasksPage() {
  const { toast } = useToast()
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "Buy groceries", completed: false },
    { id: "2", title: "Call lawyer", completed: true },
    { id: "3", title: "Pay parking ticket", completed: false },
  ])
  const [newTask, setNewTask] = useState("")

  const addTask = () => {
    if (newTask.trim() === "") return

    const task: Task = {
      id: Date.now().toString(),
      title: newTask,
      completed: false,
    }

    setTasks([...tasks, task])
    setNewTask("")

    toast({
      title: "Task added",
      description: `"${newTask}" has been added to your list. Try actually doing it this time.`,
    })
  }

  const toggleTask = (id: string) => {
    const updatedTasks = tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
    setTasks(updatedTasks)

    const taskStatus = updatedTasks.find((task) => task.id === id)?.completed
    toast({
      title: taskStatus ? "Task completed" : "Task uncompleted",
      description: taskStatus
        ? "Look at you being all productive. Gold star for you!"
        : "Changed your mind? That's fine, we'll pretend it never happened.",
    })
  }

  const deleteTask = (id: string) => {
    const taskToDelete = tasks.find((task) => task.id === id)
    setTasks(tasks.filter((task) => task.id !== id))

    toast({
      title: "Task deleted",
      description: `"${taskToDelete?.title}" has been deleted. Out of sight, out of mind!`,
      variant: "destructive",
    })
  }

  return (
    <main className="container py-4 sm:py-6 space-y-4 sm:space-y-6 px-4 sm:px-6">
      <h1 className="text-3xl sm:text-4xl font-bold">Tasks</h1>
      <p className="text-lg sm:text-xl">
        Keep track of your daily tasks. We won't judge you for how long they've been on this list.
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">Add New Task</CardTitle>
          <CardDescription className="text-base sm:text-lg">
            What are you pretending to care about accomplishing today?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="Enter a new task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="text-base sm:text-lg"
              onKeyDown={(e) => {
                if (e.key === "Enter") addTask()
              }}
            />
            <Button onClick={addTask} size="lg" className="text-base sm:text-lg">
              Add Task
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold">Your Tasks</h2>
        {tasks.length === 0 ? (
          <Card>
            <CardContent className="p-4 sm:p-6">
              <p className="text-lg sm:text-xl text-center text-muted-foreground">
                No tasks yet. Enjoying the blissful ignorance while it lasts?
              </p>
            </CardContent>
          </Card>
        ) : (
          tasks.map((task) => (
            <Card key={task.id} className={task.completed ? "opacity-75" : ""}>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Checkbox
                      id={`task-${task.id}`}
                      checked={task.completed}
                      onCheckedChange={() => toggleTask(task.id)}
                      className="h-5 w-5 sm:h-6 sm:w-6"
                    />
                    <label
                      htmlFor={`task-${task.id}`}
                      className={`text-base sm:text-xl ${task.completed ? "line-through text-muted-foreground" : ""}`}
                    >
                      {task.title}
                    </label>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)} className="h-10 w-10">
                    <Trash2 className="h-5 w-5 sm:h-6 sm:w-6" />
                    <span className="sr-only">Delete task</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </main>
  )
}

