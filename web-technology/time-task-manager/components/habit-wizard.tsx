"use client"

import { useEffect, useMemo, useState } from "react"

import { CalendarView } from "./calendar-view"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { Checkbox } from "./ui/checkbox"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { HABIT_CATEGORY_LABELS, type HabitCategory, type HabitFrequency, buildHabitSchedule, useTaskStore } from "@/lib/store"
import { Progress } from "./ui/progress"
import { Badge } from "./ui/badge"

interface HabitWizardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const frequencyLabels: Record<HabitFrequency, string> = {
  daily: "Каждый день",
  two_per_week: "2 раза в неделю",
  three_per_week: "3 раза в неделю",
  four_per_week: "4 раза в неделю",
}

export function HabitWizard({ open, onOpenChange }: HabitWizardProps) {
  const { createHabit } = useTaskStore()

  const [step, setStep] = useState(0)
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState<HabitCategory>("language")
  const [frequency, setFrequency] = useState<HabitFrequency>("daily")
  const [time, setTime] = useState("09:00")
  const [duration, setDuration] = useState(23)
  const [isSaving, setIsSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      setStep(0)
      setIsSaving(false)
      setSuccessMessage(null)
      setTitle("")
      setCategory("language")
      setFrequency("daily")
      setTime("09:00")
      setDuration(23)
    }
  }, [open])

  const schedulePreview = useMemo(() => {
    if (!title.trim()) return []
    const dates = buildHabitSchedule(frequency, new Date(), Math.max(1, duration || 1))
    return dates.map((timestamp, index) => ({
      date: `preview-${index}`,
      timestamp,
      taskId: `preview-${index}`,
      completed: false,
    }))
  }, [frequency, title, duration])

  const canNext = step === 0 ? Boolean(title.trim()) : step === 1 ? Boolean(frequency) : Boolean(time)

  const handleSubmit = () => {
    if (!title.trim() || !time) return
    setIsSaving(true)
    createHabit({
      title: title.trim(),
      category,
      frequency,
      time,
      durationDays: Math.max(1, duration || 1),
      customDates: undefined,
    })
    setIsSaving(false)
    setSuccessMessage("Цель добавлена в календарь и задачи")
    onOpenChange(false)
  }

  const renderStep = () => {
    if (step === 0) {
      return (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Введите привычку и выберите категорию.</p>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="habit-title">Привычка</Label>
              <Input
                id="habit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Например: Читать 20 страниц"
              />
            </div>
            <div className="space-y-2">
              <Label>Категория</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(Object.keys(HABIT_CATEGORY_LABELS) as HabitCategory[]).map((key) => (
                  <Card
                    key={key}
                    className={`flex items-center gap-3 border cursor-pointer p-3 transition ${
                      category === key ? "border-primary ring-2 ring-primary/20" : "hover:border-primary/60"
                    }`}
                    onClick={() => setCategory(key)}
                  >
                    <Checkbox checked={category === key} className="pointer-events-none" />
                    <div className="text-sm">{HABIT_CATEGORY_LABELS[key]}</div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    }

    if (step === 1) {
      return (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Какая частота действий в неделю у вашей привычки?
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(Object.keys(frequencyLabels) as HabitFrequency[]).map((key) => (
              <Card
                key={key}
                className={`flex items-center justify-between p-4 border cursor-pointer transition ${
                  frequency === key ? "border-primary ring-2 ring-primary/20" : "hover:border-primary/60"
                }`}
                onClick={() => setFrequency(key)}
              >
                <div>
                  <div className="font-medium">{frequencyLabels[key]}</div>
                  <div className="text-xs text-muted-foreground">Автораспределение по календарю</div>
                </div>
                {frequency === key && <Badge variant="secondary">Выбрано</Badge>}
              </Card>
            ))}
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="habit-time" className="text-sm font-medium">
            Выберите время для занятий
          </Label>
          <Input
            id="habit-time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="habit-duration" className="text-sm font-medium">
            Длительность (дней)
          </Label>
          <Input
            id="habit-duration"
            type="number"
            min={1}
            max={180}
            value={duration}
            onChange={(e) => setDuration(Number.parseInt(e.target.value) || 1)}
            className="mt-2"
          />
        </div>
        <CalendarView schedule={schedulePreview} time={time} />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Личные цели</p>
          <h3 className="text-xl font-semibold">Пошаговый мастер</h3>
        </div>
        <div className="text-xs text-muted-foreground">Шаг {step + 1} / 3</div>
      </div>
      <Progress value={((step + 1) / 3) * 100} />

      {renderStep()}

      <div className="flex items-center justify-between gap-2">
        <Button variant="ghost" onClick={() => (step === 0 ? onOpenChange(false) : setStep((s) => Math.max(0, s - 1)))}>
          Назад
        </Button>
        <div className="flex items-center gap-2">
          {successMessage && <span className="text-xs text-emerald-500">{successMessage}</span>}
          {step < 2 ? (
            <Button onClick={() => setStep((s) => Math.min(2, s + 1))} disabled={!canNext}>
              Далее
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={!canNext || isSaving}>
              {isSaving ? "Сохраняем..." : "Создать цель"}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

