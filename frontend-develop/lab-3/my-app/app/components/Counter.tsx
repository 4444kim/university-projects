"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

export function Counter() {
  const [count, setCount] = useState(0);

  const handlePlus = () => setCount((prev) => prev + 1);
  const handleMinus = () => setCount((prev) => (prev > 0 ? prev - 1 : 0));

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-600 dark:bg-slate-700">
      <h3 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-100">
        Счетчик
      </h3>
      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={handleMinus}
          disabled={count === 0}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-100 disabled:opacity-40 dark:border-slate-500 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-600"
        >
          <Minus size={20} />
        </button>
        <span className="min-w-[3rem] text-center text-2xl font-bold text-slate-800 dark:text-slate-100">
          {count}
        </span>
        <button
          type="button"
          onClick={handlePlus}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-100 dark:border-slate-500 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-600"
        >
          <Plus size={20} />
        </button>
      </div>
    </div>
  );
}
