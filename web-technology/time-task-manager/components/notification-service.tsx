"use client"

import { useEffect, useRef, useState } from "react"

import { useTaskStore } from "@/lib/store"
import { toast } from "@/hooks/use-toast"

function toDateKey(timestamp: number) {
  return new Date(timestamp).toISOString().split("T")[0]
}

function combineDateAndTime(dateTs: number, time: string) {
  const [hours, minutes] = time.split(":").map((part) => Number.parseInt(part, 10))
  const date = new Date(dateTs)
  date.setHours(hours || 0, minutes || 0, 0, 0)
  return date.getTime()
}

export function NotificationService() {
  const { habits, markHabitNotified } = useTaskStore()
  const [permission, setPermission] = useState<NotificationPermission>(() =>
    typeof window !== "undefined" && "Notification" in window ? Notification.permission : "default",
  )
  const requestedRef = useRef(false)

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return
    if (permission === "default" && !requestedRef.current) {
      requestedRef.current = true
      Notification.requestPermission().then((next) => setPermission(next))
    } else {
      setPermission(Notification.permission)
    }
  }, [permission])

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return

    const interval = setInterval(() => {
      if (Notification.permission !== "granted") return

      const now = Date.now()
      const todayKey = toDateKey(now)
      habits.forEach((habit) => {
        const today = habit.schedule.find((day) => day.date === todayKey)
        if (!today || today.completed) return

        const targetTime = combineDateAndTime(today.timestamp, habit.time)
        const isTimeToNotify = now >= targetTime && now - targetTime < 60 * 1000

        if (isTimeToNotify && habit.lastNotificationDate !== todayKey) {
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification("Время для привычки", {
              body: `${habit.title} • ${habit.time}`,
              icon: "/icon-192.png",
            })
          }
          toast({
            title: "Время для привычки",
            description: `${habit.title} • ${habit.time}`,
          })
          markHabitNotified(habit.id, todayKey)
        }
      })
    }, 30_000)

    return () => clearInterval(interval)
  }, [habits, markHabitNotified])

  return null
}

