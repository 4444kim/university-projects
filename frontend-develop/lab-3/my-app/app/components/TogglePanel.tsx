"use client";

import { useState } from "react";
import { ToggleLeft } from "lucide-react";

const TOGGLES = [
  { id: "1", label: "Переключатель 1" },
  { id: "2", label: "Переключатель 2" },
  { id: "3", label: "Переключатель 3" },
  { id: "4", label: "Переключатель 4" },
];

export function TogglePanel() {
  const [states, setStates] = useState<Record<string, boolean>>({
    "1": false,
    "2": false,
    "3": false,
    "4": false,
  });

  const toggle = (id: string) => {
    setStates((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-600 dark:bg-slate-700">
      <h3 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-100">
        Toggle-панель
      </h3>
      <div className="flex flex-col gap-3">
        {TOGGLES.map(({ id, label }) => (
          <div
            key={id}
            className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-600 dark:bg-slate-600/50"
          >
            <span className="text-slate-800 dark:text-slate-100">{label}</span>
            <button
              type="button"
              onClick={() => toggle(id)}
              className="flex items-center gap-2 text-sm"
            >
              <span
                className={
                  states[id]
                    ? "text-slate-800 dark:text-slate-100"
                    : "text-slate-500 dark:text-slate-400"
                }
              >
                {states[id] ? "Включен" : "Выключен"}
              </span>
              <ToggleLeft
                size={28}
                className={
                  states[id]
                    ? "text-slate-700 dark:text-slate-200"
                    : "text-slate-400 dark:text-slate-500"
                }
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
