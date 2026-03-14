"use client";

import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { UserRound } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-[1800px] px-4 md:px-6 lg:px-8 h-14 flex items-center justify-between">
        <nav aria-label="Главная навигация" className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-semibold tracking-tight hover:opacity-90"
          >
            Задачи
          </Link>
          <Link
            href="/habits"
            className="text-sm font-semibold tracking-tight hover:opacity-90"
          >
            Цели
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/profile"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-muted transition"
            aria-label="Профиль"
          >
            <UserRound className="h-4 w-4" />
          </Link>
          <ThemeToggle />
        </div>
      </div>
      {/* Active task indicator bar (subtle) */}
      <div aria-hidden className="h-0.5 bg-primary/30" />
    </header>
  );
}
