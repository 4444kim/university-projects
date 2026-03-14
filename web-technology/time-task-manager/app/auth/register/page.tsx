"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import auth from "@/lib/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = auth.register(email, password, fullName);
    setLoading(false);
    if (!res.ok) {
      setError(res.error ?? "Не удалось зарегистрироваться");
      return;
    }
    router.push("/profile");
  };

  return (
    <div className="min-h-screen bg-background px-4 pb-10 md:px-6 lg:px-8">
      <div className="mx-auto max-w-md py-16">
        <Card className="p-6">
          <h1 className="text-2xl font-semibold mb-4">Регистрация</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="fullname">ФИО</Label>
              <Input
                id="fullname"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="text-sm text-destructive">{error}</div>}
            <div className="flex items-center gap-3">
              <Button type="submit" disabled={loading}>
                {loading ? "Регистрируем..." : "Зарегистрироваться"}
              </Button>
              <Link
                href="/auth/login"
                className="text-sm text-muted-foreground"
              >
                Уже есть аккаунт? Войти
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
