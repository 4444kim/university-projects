"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { toast } from "@/hooks/use-toast"

export interface Task {
  id: string
  title: string
  tags: string[]
  expectedTime: number // minutes
  difficulty: number // 1-5
  elapsedMs: number // milliseconds
  points: number
  status: "todo" | "active" | "paused" | "done"
  startedAt: number | null // timestamp
  finishedAt: number | null // timestamp
  createdAt: number
  scheduledAt?: number
  habitId?: string
  readOnly?: boolean
}

export type HabitFrequency = "daily" | "two_per_week" | "three_per_week" | "four_per_week"
export type HabitCategory = "language" | "career" | "study" | "fitness" | "custom"

export interface HabitDay {
  date: string
  timestamp: number
  taskId: string
  completed: boolean
}

export interface Habit {
  id: string
  title: string
  category: HabitCategory
  frequency: HabitFrequency
  durationDays: number
  time: string // HH:mm
  startDate: number
  schedule: HabitDay[]
  createdAt: number
  lastNotificationDate?: string
}

export interface UserProfile {
  fullName: string
  email: string
}

interface Settings {
  audioMuted: boolean
  schemaVersion: number
}

interface TaskStore {
  tasks: Task[]
  habits: Habit[]
  profile: UserProfile
  settings: Settings
  lastActivityAt: number | null
  showInactiveReminder: boolean
  addTask: (
    task: Omit<Task, "id" | "elapsedMs" | "points" | "status" | "startedAt" | "finishedAt" | "createdAt">,
  ) => void
  startTask: (id: string) => void
  pauseTask: (id: string) => void
  resumeTask: (id: string) => void
  finishTask: (id: string) => void
  updateTask: (id: string, updates: Partial<Pick<Task, "title" | "tags" | "difficulty">>) => void
  deleteTask: (id: string) => void
  saveProfile: (profile: Partial<UserProfile>) => void
  createHabit: (data: {
    title: string
    category: HabitCategory
    frequency: HabitFrequency
    time: string
    durationDays: number
    customDates?: number[]
  }) => void
  markHabitNotified: (habitId: string, date: string) => void
  updateHabit: (
    habitId: string,
    data: Partial<{
      title: string
      category: HabitCategory
      frequency: HabitFrequency
      time: string
      durationDays: number
      customDates: number[]
    }>,
  ) => void
  deleteHabit: (habitId: string) => void
  toggleAudioMute: () => void
  dismissInactiveReminder: () => void
  checkInactiveTimer: () => void
  exportToCSV: (startDate: number, endDate: number) => string
  getAnalytics: (period: "day" | "week" | "month") => Analytics
  recoverTimers: () => void
}

interface Analytics {
  totalTime: number // minutes
  completedTasks: number
  totalPoints: number
  avgDuration: number // minutes
  focusCoefficient: number
  topTags: Array<{ tag: string; time: number; count: number }>
}

const CURRENT_SCHEMA_VERSION = 3
const DEFAULT_HABIT_DURATION_DAYS = 23

export const HABIT_CATEGORY_LABELS: Record<HabitCategory, string> = {
  language: "Язык",
  career: "Карьера",
  study: "Учёба",
  fitness: "Фитнес",
  custom: "Другое",
}

function toDateKey(timestamp: number) {
  return new Date(timestamp).toISOString().split("T")[0]
}

export function buildHabitSchedule(frequency: HabitFrequency, startDate: Date, durationDays = DEFAULT_HABIT_DURATION_DAYS): number[] {
  const start = new Date(startDate)
  start.setHours(0, 0, 0, 0)

  const occurrences =
    frequency === "daily"
      ? durationDays
      : Math.max(1, Math.round((durationDays / 7) * { two_per_week: 2, three_per_week: 3, four_per_week: 4 }[frequency]))

  const step = durationDays / occurrences
  const dates: number[] = []

  for (let i = 0; i < occurrences; i++) {
    const offsetDays = Math.round(i * step)
    const day = new Date(start)
    day.setDate(start.getDate() + Math.min(offsetDays, durationDays - 1))
    day.setHours(0, 0, 0, 0)

    if (!dates.includes(day.getTime())) {
      dates.push(day.getTime())
    }
  }

  // Ensure the last day is included for daily habits
  if (frequency === "daily") {
    const last = new Date(start)
    last.setDate(start.getDate() + durationDays - 1)
    dates[dates.length - 1] = last.getTime()
  }

  return dates.sort((a, b) => a - b)
}

let notificationPermissionAsked = false

function buildHabitInstance(params: {
  title: string
  category: HabitCategory
  frequency: HabitFrequency
  time: string
  durationDays: number
  customDates?: number[]
  start?: Date
  habitId?: string
}): { habit: Habit; tasks: Task[] } {
  const start = params.start ?? new Date()
  const baseDuration = Math.max(1, params.durationDays)
  const dates =
    params.customDates && params.customDates.length > 0
      ? [...params.customDates].sort((a, b) => a - b)
      : buildHabitSchedule(params.frequency, start, baseDuration)
  const habitId = params.habitId ?? crypto.randomUUID()

  const schedule: HabitDay[] = dates.map((timestamp) => ({
    date: toDateKey(timestamp),
    timestamp,
    taskId: crypto.randomUUID(),
    completed: false,
  }))

  const tasks: Task[] = schedule.map((entry, index) => ({
    id: entry.taskId,
    title: `${params.title} — день ${index + 1}`,
    tags: ["habit", params.category],
    expectedTime: 30,
    difficulty: 2,
    elapsedMs: 0,
    points: 0,
    status: "todo",
    startedAt: null,
    finishedAt: null,
    createdAt: Date.now(),
    scheduledAt: entry.timestamp,
    habitId,
    readOnly: true,
  }))

  return {
    habit: {
      id: habitId,
      title: params.title,
      category: params.category,
      frequency: params.frequency,
      durationDays: Math.max(1, params.durationDays),
      time: params.time,
      startDate: start.getTime(),
      schedule,
      createdAt: Date.now(),
    },
    tasks,
  }
}

function migrateStore(persistedState: any): any {
  if (!persistedState) return persistedState

  const version = persistedState.settings?.schemaVersion || 0

  if (version < CURRENT_SCHEMA_VERSION) {
    // Migrate from version 0 to 1: convert actualTime to elapsedMs, status names
    if (version === 0) {
      persistedState.tasks = persistedState.tasks?.map((task: any) => ({
        ...task,
        elapsedMs: (task.actualTime || 0) * 60 * 1000,
        status:
          task.status === "idle"
            ? "todo"
            : task.status === "running"
              ? "active"
              : task.status === "paused"
                ? "paused"
                : "done",
        finishedAt: task.completedAt || null,
      }))
      persistedState.settings = {
        ...persistedState.settings,
        schemaVersion: 1,
      }
    }
    if (version < 2) {
      persistedState.habits = []
      persistedState.profile = {
        fullName: "",
        email: "",
      }
      persistedState.settings = {
        ...persistedState.settings,
        schemaVersion: 2,
      }
    }
    if (version < 3) {
      const fallbackTitle: Record<string, string> = {
        english: "Улучшить английский язык",
        job: "Найти работу",
        exam: "Подготовиться к сессии",
        gym: "Ходить в зал",
      }
      const fallbackCategory: Record<string, HabitCategory> = {
        english: "language",
        job: "career",
        exam: "study",
        gym: "fitness",
      }

      persistedState.habits =
        persistedState.habits?.map((habit: any) => ({
          ...habit,
          title: fallbackTitle[habit.title] || habit.title || "Моя цель",
          category: fallbackCategory[habit.title] || "custom",
          durationDays: habit.durationDays || DEFAULT_HABIT_DURATION_DAYS,
        })) ?? []

      persistedState.tasks =
        persistedState.tasks?.map((task: any) => ({
          ...task,
          tags: task.tags?.includes("habit") ? task.tags : [...(task.tags || []), "habit"],
        })) ?? []

      persistedState.settings = {
        ...persistedState.settings,
        schemaVersion: 3,
      }
    }
  }

  return persistedState
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      habits: [],
      profile: {
        fullName: "",
        email: "",
      },
      settings: {
        audioMuted: false,
        schemaVersion: CURRENT_SCHEMA_VERSION,
      },
      lastActivityAt: null,
      showInactiveReminder: false,

      addTask: (taskData) => {
        const task: Task = {
          ...taskData,
          id: crypto.randomUUID(),
          elapsedMs: 0,
          points: 0,
          status: taskData.status ?? "todo",
          startedAt: null,
          finishedAt: null,
          createdAt: taskData.createdAt ?? Date.now(),
          scheduledAt: taskData.scheduledAt,
          habitId: taskData.habitId,
          readOnly: taskData.readOnly ?? false,
        }
        set((state) => ({ tasks: [...state.tasks, task] }))
      },

      startTask: (id) => {
        set((state) => {
          const targetTask = state.tasks.find((t) => t.id === id)
          if (!targetTask) return state
          if (targetTask.status === "done") return state // Can't start done tasks
          if (!targetTask.title.trim()) return state // Can't start empty title

          const now = Date.now()
          const tasks = state.tasks.map((task) => {
            if (task.id === id) {
              return {
                ...task,
                status: "active" as const,
                startedAt: now,
              }
            }
            if (task.status === "active" && task.startedAt) {
              const elapsed = now - task.startedAt
              return {
                ...task,
                status: "paused" as const,
                elapsedMs: task.elapsedMs + elapsed,
                startedAt: null,
              }
            }
            return task
          })
          return { tasks, lastActivityAt: now, showInactiveReminder: false }
        })
      },

      pauseTask: (id) => {
        set((state) => {
          const now = Date.now()
          const tasks = state.tasks.map((task) => {
            if (task.id === id && task.status === "active" && task.startedAt) {
              const elapsed = now - task.startedAt
              return {
                ...task,
                status: "paused" as const,
                elapsedMs: task.elapsedMs + elapsed,
                startedAt: null,
              }
            }
            return task
          })
          return { tasks, lastActivityAt: now }
        })
      },

      resumeTask: (id) => {
        set((state) => {
          const targetTask = state.tasks.find((t) => t.id === id)
          if (!targetTask || targetTask.status !== "paused") return state

          const now = Date.now()
          const tasks = state.tasks.map((task) => {
            if (task.id === id) {
              return {
                ...task,
                status: "active" as const,
                startedAt: now,
              }
            }
            if (task.status === "active" && task.startedAt) {
              const elapsed = now - task.startedAt
              return {
                ...task,
                status: "paused" as const,
                elapsedMs: task.elapsedMs + elapsed,
                startedAt: null,
              }
            }
            return task
          })
          return { tasks, lastActivityAt: now, showInactiveReminder: false }
        })
      },

      finishTask: (id) => {
        set((state) => {
          const now = Date.now()
          let updatedHabits = state.habits

          const tasks = state.tasks.map((task) => {
            if (task.id === id && (task.status === "active" || task.status === "paused")) {
              let finalElapsedMs = task.elapsedMs
              if (task.status === "active" && task.startedAt) {
                finalElapsedMs += now - task.startedAt
              }

              // Can't finish if no time elapsed
              if (finalElapsedMs === 0) return task

              const finalMinutes = Math.ceil(finalElapsedMs / 1000 / 60)
              const points = finalMinutes * task.difficulty

              if (!state.settings.audioMuted) {
                playFinishSound()
              }

              triggerNotification("Задача завершена", task.title)

              if (task.habitId) {
                updatedHabits = state.habits.map((habit) => {
                  if (habit.id !== task.habitId) return habit
                  return {
                    ...habit,
                    schedule: habit.schedule.map((day) =>
                      day.taskId === task.id
                        ? { ...day, completed: true }
                        : day,
                    ),
                  }
                })
              }

              return {
                ...task,
                status: "done" as const,
                elapsedMs: finalElapsedMs,
                points,
                finishedAt: now,
                startedAt: null,
              }
            }
            return task
          })

          return { tasks, lastActivityAt: now, habits: updatedHabits }
        })
      },

      updateTask: (id, updates) => {
        set((state) => {
          const tasks = state.tasks.map((task) => {
            if (task.id === id && task.readOnly) {
              return task
            }
            if (task.id === id && task.status === "done") {
              const newDifficulty = updates.difficulty ?? task.difficulty
              const finalMinutes = Math.ceil(task.elapsedMs / 1000 / 60)
              const newPoints = finalMinutes * newDifficulty
              return {
                ...task,
                ...updates,
                points: newPoints,
              }
            }
            return task
          })
          return { tasks }
        })
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        }))
      },

      saveProfile: (profile) => {
        set((state) => ({
          profile: {
            ...state.profile,
            ...profile,
          },
        }))
      },

      createHabit: ({ title, category, frequency, time, durationDays, customDates }) => {
        const { habit, tasks } = buildHabitInstance({ title, category, frequency, time, durationDays, customDates })
        set((state) => ({
          tasks: [...state.tasks, ...tasks],
          habits: [...state.habits, habit],
        }))
      },

      markHabitNotified: (habitId, date) => {
        set((state) => ({
          habits: state.habits.map((habit) =>
            habit.id === habitId
              ? {
                  ...habit,
                  lastNotificationDate: date,
                }
              : habit,
          ),
        }))
      },

      updateHabit: (habitId, data) => {
        set((state) => {
          const target = state.habits.find((h) => h.id === habitId)
          if (!target) return state

          const title = data.title ?? target.title
          const category = data.category ?? target.category
          const frequency = data.frequency ?? target.frequency
          const time = data.time ?? target.time
          const durationDays = data.durationDays ?? target.durationDays
          const customDates = data.customDates ?? target.schedule.map((d) => d.timestamp)

          const { habit, tasks } = buildHabitInstance({
            title,
            category,
            frequency,
            time,
            durationDays,
            customDates,
            habitId,
            start: new Date(),
          })

          return {
            habits: state.habits.map((h) => (h.id === habitId ? habit : h)),
            tasks: [...state.tasks.filter((t) => t.habitId !== habitId), ...tasks],
          }
        })
      },

      deleteHabit: (habitId) => {
        set((state) => ({
          habits: state.habits.filter((h) => h.id !== habitId),
          tasks: state.tasks.filter((t) => t.habitId !== habitId),
        }))
      },

      toggleAudioMute: () => {
        set((state) => ({
          settings: {
            ...state.settings,
            audioMuted: !state.settings.audioMuted,
          },
        }))
      },

      dismissInactiveReminder: () => {
        set({ showInactiveReminder: false, lastActivityAt: Date.now() })
      },

      checkInactiveTimer: () => {
        const state = get()
        const hasActiveTask = state.tasks.some((t) => t.status === "active")

        if (!hasActiveTask && state.lastActivityAt) {
          const inactiveMinutes = Math.floor((Date.now() - state.lastActivityAt) / 1000 / 60)

          if (inactiveMinutes >= 10 && !state.showInactiveReminder) {
            set({ showInactiveReminder: true })

            // Request notification permission and send notification
            triggerNotification("Вернитесь к задаче!", "Вы не работали над задачами уже 10 минут")
          }
        }
      },

      recoverTimers: () => {
        set((state) => {
          const now = Date.now()
          const tasks = state.tasks.map((task) => {
            if (task.status === "active" && task.startedAt) {
              // Recover elapsed time from timestamp
              const elapsed = now - task.startedAt
              return {
                ...task,
                elapsedMs: task.elapsedMs + elapsed,
                startedAt: now, // Reset startedAt to current time
              }
            }
            return task
          })
          return { tasks }
        })
      },

      exportToCSV: (startDate, endDate) => {
        const state = get()
        const filteredTasks = state.tasks.filter(
          (t) => t.status === "done" && t.finishedAt && t.finishedAt >= startDate && t.finishedAt <= endDate,
        )

        const headers = ["Название", "Теги", "Время (мин)", "Очки", "Дата завершения"]
        const rows = filteredTasks.map((task) => [
          task.title,
          task.tags.join(", "),
          Math.ceil(task.elapsedMs / 1000 / 60).toString(),
          task.points.toString(),
          new Date(task.finishedAt!).toLocaleDateString("ru-RU"),
        ])

        const csvContent = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")

        return csvContent
      },

      getAnalytics: (period) => {
        const state = get()
        const now = Date.now()
        const periodMs = {
          day: 24 * 60 * 60 * 1000,
          week: 7 * 24 * 60 * 60 * 1000,
          month: 30 * 24 * 60 * 60 * 1000,
        }[period]

        const relevantTasks = state.tasks.filter(
          (t) => t.status === "done" && t.finishedAt && now - t.finishedAt < periodMs,
        )

        const totalTimeMinutes = relevantTasks.reduce((sum, t) => sum + Math.ceil(t.elapsedMs / 1000 / 60), 0)
        const totalPoints = relevantTasks.reduce((sum, t) => sum + t.points, 0)
        const completedTasks = relevantTasks.length

        const avgDuration = completedTasks > 0 ? Math.round(totalTimeMinutes / completedTasks) : 0

        // Calculate focus coefficient: ratio of actual time to expected time
        const totalExpected = relevantTasks.reduce((sum, t) => sum + t.expectedTime, 0)
        const focusCoefficient =
          totalExpected > 0 ? Math.min(100, Math.round((totalTimeMinutes / totalExpected) * 100)) : 0

        // Top tags
        const tagMap = new Map<string, { time: number; count: number }>()
        relevantTasks.forEach((task) => {
          const taskMinutes = Math.ceil(task.elapsedMs / 1000 / 60)
          task.tags.forEach((tag) => {
            const current = tagMap.get(tag) || { time: 0, count: 0 }
            tagMap.set(tag, {
              time: current.time + taskMinutes,
              count: current.count + 1,
            })
          })
        })

        const topTags = Array.from(tagMap.entries())
          .map(([tag, data]) => ({ tag, ...data }))
          .sort((a, b) => b.time - a.time)

        return {
          totalTime: totalTimeMinutes,
          completedTasks,
          totalPoints,
          avgDuration,
          focusCoefficient,
          topTags,
        }
      },
    }),
    {
      name: "task-manager-storage",
      version: CURRENT_SCHEMA_VERSION,
      migrate: migrateStore,
    },
  ),
)

function playFinishSound() {
  if (typeof window === "undefined") return

  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)

  oscillator.frequency.value = 800
  oscillator.type = "sine"

  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

  oscillator.start(audioContext.currentTime)
  oscillator.stop(audioContext.currentTime + 0.5)
}

function triggerNotification(title: string, body: string) {
  if (typeof window === "undefined") return
  if (!("Notification" in window)) {
    toast({
      title,
      description: body,
    })
    return
  }

  const send = () => {
    new Notification(title, {
      body,
      icon: "/icon-192.png",
    })
    toast({
      title,
      description: body,
    })
  }

  if (Notification.permission === "granted") {
    send()
    return
  }

  if (!notificationPermissionAsked && Notification.permission === "default") {
    notificationPermissionAsked = true
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        send()
      } else {
        toast({
          title,
          description: body,
        })
      }
    })
    return
  }

  toast({
    title,
    description: body,
  })
}
