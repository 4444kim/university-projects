"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

const START_SECONDS = 10;

export function Timer() {
  const [seconds, setSeconds] = useState(START_SECONDS);

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setInterval(() => setSeconds((prev) => prev - 1), 1000);
    return () => clearInterval(id);
  }, [seconds]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-600 dark:bg-slate-700">
      <h3 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-100">
        Обратный отсчёт
      </h3>
      <div className="flex items-center gap-2">
        <Clock size={24} className="text-slate-600 dark:text-slate-300" />
        <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          {seconds}
        </span>
        <span className="text-slate-500 dark:text-slate-400">сек</span>
      </div>
    </div>
  );
}
