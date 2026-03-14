"use client"

import { useMemo, useState } from "react"

import { CalendarView } from "@/components/calendar-view"
import { HabitWizard } from "@/components/habit-wizard"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { HABIT_CATEGORY_LABELS, type HabitCategory, type HabitFrequency, useTaskStore } from "@/lib/store"
import { Calendar } from "@/components/ui/calendar"

const frequencyLabels: Record<HabitFrequency, string> = {
  daily: "Каждый день",
  two_per_week: "2 раза в неделю",
  three_per_week: "3 раза в неделю",
  four_per_week: "4 раза в неделю",
}

export default function HabitsPage() {
  const { habits, deleteHabit, updateHabit } = useTaskStore()
  const [wizardOpen, setWizardOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<{
    title: string
    category: HabitCategory
    frequency: HabitFrequency
    time: string
    durationDays: number
    customDates: Date[]
  } | null>(null)
  const [useCustomDates, setUseCustomDates] = useState(false)

  const sortedHabits = useMemo(
    () => [...habits].sort((a, b) => b.createdAt - a.createdAt),
    [habits],
  )

  const startEdit = (habitId: string) => {
    const target = habits.find((h) => h.id === habitId)
    if (!target) return
    setEditingId(habitId)
    setForm({
      title: target.title,
      category: target.category,
      frequency: target.frequency,
      time: target.time,
      durationDays: target.durationDays,
      customDates: target.schedule.map((d) => new Date(d.timestamp)),
    })
    setUseCustomDates(target.schedule.length > 0)
  }

  const submitEdit = () => {
    if (!editingId || !form) return
    updateHabit(editingId, {
      title: form.title,
      category: form.category,
      frequency: form.frequency,
      time: form.time,
      durationDays: form.durationDays,
      customDates: useCustomDates ? form.customDates.map((d) => d.getTime()) : undefined,
    })
    setEditingId(null)
    setForm(null)
    setUseCustomDates(false)
  }

  return (
    <div className="min-h-screen bg-background px-4 pb-10 md:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="pt-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Личные цели</h1>
            <p className="text-sm text-muted-foreground mt-1">Создавайте, редактируйте и удаляйте привычки</p>
          </div>
          <Dialog open={wizardOpen} onOpenChange={setWizardOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setWizardOpen(true)}>Новая цель</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Создать привычку</DialogTitle>
              </DialogHeader>
              <HabitWizard open={wizardOpen} onOpenChange={setWizardOpen} />
            </DialogContent>
          </Dialog>
        </header>

        {sortedHabits.length === 0 ? (
          <Card className="p-6 text-sm text-muted-foreground">
            Пока нет целей. Создайте первую через «Новая цель».
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {sortedHabits.map((habit) => (
              <Card key={habit.id} className="p-5 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="text-lg font-semibold">{habit.title}</div>
                    <div className="text-xs text-muted-foreground">
                      Категория: {HABIT_CATEGORY_LABELS[habit.category]} · Частота: {frequencyLabels[habit.frequency]} · Время: {habit.time} · Длительность: {habit.durationDays} дн.
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Dialog open={editingId === habit.id} onOpenChange={(open) => (!open ? setEditingId(null) : startEdit(habit.id))}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => startEdit(habit.id)}>
                          Редактировать
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Редактировать привычку</DialogTitle>
                        </DialogHeader>
                        {form && editingId === habit.id && (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor={`title-${habit.id}`}>Название привычки</Label>
                              <Input
                                id={`title-${habit.id}`}
                                value={form.title}
                                onChange={(e) => setForm((prev) => prev && { ...prev, title: e.target.value })}
                                placeholder="Моя привычка"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Категория</Label>
                              <Select
                                value={form.category}
                                onValueChange={(value) => setForm((prev) => prev && { ...prev, category: value as HabitCategory })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Выберите категорию" />
                                </SelectTrigger>
                                <SelectContent>
                                  {(Object.keys(HABIT_CATEGORY_LABELS) as HabitCategory[]).map((key) => (
                                    <SelectItem key={key} value={key}>
                                      {HABIT_CATEGORY_LABELS[key]}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Частота</Label>
                              <Select
                                value={form.frequency}
                                onValueChange={(value) =>
                                  setForm((prev) => prev && { ...prev, frequency: value as HabitFrequency })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Выберите частоту" />
                                </SelectTrigger>
                                <SelectContent>
                                  {(Object.keys(frequencyLabels) as HabitFrequency[]).map((key) => (
                                    <SelectItem key={key} value={key}>
                                      {frequencyLabels[key]}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`duration-${habit.id}`}>Длительность (дней)</Label>
                              <Input
                                id={`duration-${habit.id}`}
                                type="number"
                                min={1}
                                max={180}
                                value={form.durationDays}
                                onChange={(e) =>
                                  setForm((prev) => prev && { ...prev, durationDays: Number.parseInt(e.target.value) || 1 })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`time-${habit.id}`}>Время</Label>
                              <Input
                                id={`time-${habit.id}`}
                                type="time"
                                value={form.time}
                                onChange={(e) => setForm((prev) => prev && { ...prev, time: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  className="h-4 w-4"
                                  checked={useCustomDates}
                                  onChange={(e) => setUseCustomDates(e.target.checked)}
                                />
                                Выбрать дни вручную
                              </Label>
                              {useCustomDates ? (
                                <Calendar
                                  mode="multiple"
                                  selected={form.customDates}
                                  onSelect={(dates) =>
                                    setForm((prev) => prev && { ...prev, customDates: dates?.filter(Boolean) as Date[] })
                                  }
                                  className="border rounded-md"
                                />
                              ) : (
                                <p className="text-xs text-muted-foreground">
                                  Дни будут распределены автоматически по частоте и длительности.
                                </p>
                              )}
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" onClick={() => setEditingId(null)}>
                                Отмена
                              </Button>
                              <Button onClick={submitEdit}>Сохранить</Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button variant="destructive" size="sm" onClick={() => deleteHabit(habit.id)}>
                      Удалить
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline">Запланировано: {habit.schedule.length}</Badge>
                  <Badge variant="outline">
                    Завершено: {habit.schedule.filter((d) => d.completed).length}/{habit.schedule.length}
                  </Badge>
                </div>

                <CalendarView schedule={habit.schedule} time={habit.time} />
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

