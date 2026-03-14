"use client";

import { useState } from "react";
import { Counter } from "./components/Counter";
import { ListManager } from "./components/ListManager";
import { TogglePanel } from "./components/TogglePanel";
import { ProfileEditor } from "./components/ProfileEditor";
import { ButtonInteractive } from "./components/ButtonInteractive";
import { ThemeToggle } from "./components/ThemeToggle";
import { DataFetcher } from "./components/DataFetcher";
import { LocalStorageList } from "./components/LocalStorageList";
import { Timer } from "./components/Timer";
import { WindowSize } from "./components/WindowSize";

type Theme = "light" | "dark";

export default function Home() {
  const [theme, setTheme] = useState<Theme>("light");

  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-screen transition-colors ${
        isDark ? "dark bg-slate-800 text-slate-100" : "bg-slate-50 text-slate-800"
      }`}
    >
      <div className="mx-auto max-w-3xl px-4 py-10">
        <header className="mb-8 border-b border-slate-200 pb-6 dark:border-slate-600">
          <h1 className="text-2xl font-bold">useState и useEffect</h1>
        </header>

        <section className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-slate-700 dark:text-slate-300">
            Часть 1. useState
          </h2>
          <div className="flex flex-col gap-6">
            <Counter />
            <ListManager />
            <TogglePanel />
            <ProfileEditor />
            <ButtonInteractive />
            <ThemeToggle theme={theme} onThemeChange={setTheme} />
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold text-slate-700 dark:text-slate-300">
            Часть 2. useEffect
          </h2>
          <div className="flex flex-col gap-6">
            <DataFetcher />
            <LocalStorageList />
            <Timer />
            <WindowSize />
          </div>
        </section>
      </div>
    </div>
  );
}
