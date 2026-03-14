"use client"

import { Calendar } from "@/components/ui/calendar"
import type { HabitDay } from "@/lib/store"

interface CalendarViewProps {
  schedule: HabitDay[]
  time: string
}

export function CalendarView({ schedule, time }: CalendarViewProps) {
  if (schedule.length === 0) {
    return (
      <div className="border border-dashed border-border rounded-lg p-4 text-sm text-muted-foreground text-center">
        Выберите привычку, частоту и время, чтобы увидеть календарь
      </div>
    )
  }

  const plannedDates = schedule.map((day) => new Date(day.timestamp))
  const completedDates = schedule.filter((day) => day.completed).map((day) => new Date(day.timestamp))

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Время: {time}</span>
        <span>
          Прогресс: {completedDates.length}/{plannedDates.length}
        </span>
      </div>
      <Calendar
        mode="multiple"
        selected={plannedDates}
        modifiers={{ done: completedDates }}
        modifiersClassNames={{
          done: "bg-emerald-500 text-emerald-50 hover:bg-emerald-500 hover:text-emerald-50",
        }}
        className="rounded-lg border border-border"
      />
    </div>
  )
}

