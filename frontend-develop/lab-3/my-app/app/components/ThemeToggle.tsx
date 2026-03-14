"use client";

import { Sun, Moon } from "lucide-react";

type Theme = "light" | "dark";

interface ThemeToggleProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export function ThemeToggle({ theme, onThemeChange }: ThemeToggleProps) {
  const isDark = theme === "dark";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-600 dark:bg-slate-700">
      <h3 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-100">
        Смена темы
      </h3>
      <button
        type="button"
        onClick={() => onThemeChange(isDark ? "light" : "dark")}
        className="flex items-center gap-2 rounded-lg bg-slate-600 px-4 py-2 text-white transition hover:bg-slate-700 dark:bg-slate-500 dark:hover:bg-slate-400"
      >
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
        {isDark ? "Светлая тема" : "Тёмная тема"}
      </button>
    </div>
  );
}
