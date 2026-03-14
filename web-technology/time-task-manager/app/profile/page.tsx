"use client";

import { useEffect, useState } from "react";

import { CalendarView } from "@/components/calendar-view";
import { HabitWizard } from "@/components/habit-wizard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import auth, { type User } from "@/lib/auth";
import { useTaskStore, type HabitFrequency } from "@/lib/store";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { profile, saveProfile, habits } = useTaskStore();
  const [user, setUser] = useState<User | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [wizardOpen, setWizardOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const u = auth.getCurrentUser();
    setUser(u);
    if (u) {
      setFullName(u.fullName ?? "");
      setEmail(u.email ?? "");
    } else {
      // если не авторизован — перенаправляем на регистрацию
      router.replace("/auth/register");
    }
  }, [profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("saving");
    if (user) {
      const res = auth.updateProfile({ fullName, email });
      if (res.ok) {
        // keep app store profile in sync
        saveProfile({ fullName, email });
        setStatus("saved");
        setTimeout(() => setStatus("idle"), 2500);
        setUser(res.user ?? null);
      } else {
        setStatus("idle");
      }
    } else {
      // not logged in — still save to local store
      saveProfile({ fullName, email });
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2500);
    }
  };

  const handleLogout = () => {
    auth.logout();
    setUser(null);
    router.push("/auth/login");
  };

  const hasHabits = habits.length > 0;
  const frequencyLabels: Record<HabitFrequency, string> = {
    daily: "Каждый день",
    two_per_week: "2 раза в неделю",
    three_per_week: "3 раза в неделю",
    four_per_week: "4 раза в неделю",
  };

  return (
    <div className="min-h-screen bg-background px-4 pb-10 md:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="pt-6 flex items-center justify-between">
          <h1 className="text-3xl font-semibold tracking-tight">Профиль</h1>
          {user ? (
            <div className="text-sm">
              <span className="mr-3 text-muted-foreground">{user.email}</span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Выйти
              </Button>
            </div>
          ) : null}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 p-6 space-y-4">
            <h2 className="text-lg font-medium">Основные данные</h2>
            {!user && (
              <div className="mb-4 text-sm text-muted-foreground">
                Вы не вошли в систему.{" "}
                <Link href="/auth/login" className="underline">
                  Войти
                </Link>{" "}
                или{" "}
                <Link href="/auth/register" className="underline">
                  Зарегистрироваться
                </Link>{" "}
                чтобы сохранить профиль в аккаунте.
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full-name">ФИО</Label>
                <Input
                  id="full-name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Иванов Иван Иванович"
                  autoComplete="name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
              <div className="flex items-center gap-3">
                <Button type="submit" disabled={status === "saving"}>
                  {status === "saving" ? "Сохраняем..." : "Сохранить"}
                </Button>
                {status === "saved" && (
                  <span className="text-xs text-emerald-500">Сохранено</span>
                )}
              </div>
            </form>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">Личные цели</h2>
              <Dialog open={wizardOpen} onOpenChange={setWizardOpen}>
                <Button size="sm" onClick={() => setWizardOpen(true)}>
                  Личные цели
                </Button>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Создать привычку</DialogTitle>
                  </DialogHeader>
                  <HabitWizard open={wizardOpen} onOpenChange={setWizardOpen} />
                </DialogContent>
              </Dialog>
            </div>
            {!hasHabits && (
              <p className="text-sm text-muted-foreground">
                Пока нет привычек. Нажмите «Личные цели», чтобы добавить первую.
              </p>
            )}
            {hasHabits && (
              <div className="space-y-4">
                {habits.map((habit) => (
                  <Card key={habit.id} className="p-4 border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="font-medium">{habit.title}</div>
                        <div className="text-xs text-muted-foreground">
                          Частота: {frequencyLabels[habit.frequency]} · Время:{" "}
                          {habit.time} · Длительность: {habit.durationDays} дн.
                        </div>
                      </div>
                    </div>
                    <CalendarView schedule={habit.schedule} time={habit.time} />
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
