// Types
export type Task = {
  id: string
  title: string
  completed: boolean
  dueDate?: Date
  createdAt: Date
}

export type CourtDate = {
  id: string
  title: string
  date: Date
  location: string
  notes?: string
  createdAt: Date
}

export type UserSettings = {
  notifications: boolean
  fontScale: number
  highContrast: boolean
  reminderTime: string
  soundEffects: boolean
}

// Mock localStorage implementation for PWA
const localStorageDB = {
  getTasks: (): Task[] => {
    if (typeof window === "undefined") return []
    const tasks = localStorage.getItem("court-jester-tasks")
    return tasks ? JSON.parse(tasks) : []
  },

  saveTasks: (tasks: Task[]) => {
    if (typeof window === "undefined") return
    localStorage.setItem("court-jester-tasks", JSON.stringify(tasks))
  },

  getCourtDates: (): CourtDate[] => {
    if (typeof window === "undefined") return []
    const dates = localStorage.getItem("court-jester-court-dates")
    return dates ? JSON.parse(dates) : []
  },

  saveCourtDates: (dates: CourtDate[]) => {
    if (typeof window === "undefined") return
    localStorage.setItem("court-jester-court-dates", JSON.stringify(dates))
  },

  getSettings: (): UserSettings => {
    if (typeof window === "undefined")
      return {
        notifications: true,
        fontScale: 100,
        highContrast: false,
        reminderTime: "1day",
        soundEffects: true,
      }

    const settings = localStorage.getItem("court-jester-settings")
    return settings
      ? JSON.parse(settings)
      : {
          notifications: true,
          fontScale: 100,
          highContrast: false,
          reminderTime: "1day",
          soundEffects: true,
        }
  },

  saveSettings: (settings: UserSettings) => {
    if (typeof window === "undefined") return
    localStorage.setItem("court-jester-settings", JSON.stringify(settings))
  },
}

export default localStorageDB

