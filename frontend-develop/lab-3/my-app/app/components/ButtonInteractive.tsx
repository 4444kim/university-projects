"use client";

import { useState } from "react";
import { MousePointer } from "lucide-react";

export function ButtonInteractive() {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const getButtonClass = () => {
    let base =
      "inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 font-medium transition-all duration-150 ";
    if (isActive) {
      base +=
        "scale-95 bg-slate-700 text-white shadow-none dark:bg-slate-400 dark:text-slate-900 ";
    } else if (isHovered) {
      base +=
        "scale-105 bg-slate-600 text-white shadow-lg dark:bg-slate-400 dark:text-slate-900 ";
    } else {
      base +=
        "text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-500 dark:bg-slate-600 dark:text-slate-100 dark:hover:bg-slate-500 ";
    }
    return base;
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-600 dark:bg-slate-700">
      <h3 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-100">
        Hover и active
      </h3>
      <button
        type="button"
        className={getButtonClass()}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsActive(false);
        }}
        onMouseDown={() => setIsActive(true)}
        onMouseUp={() => setIsActive(false)}
      >
        <MousePointer size={18} />
        Наведи и нажми
      </button>
      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
        Hover: {isHovered ? "да" : "нет"} · Active: {isActive ? "да" : "нет"}
      </p>
    </div>
  );
}
