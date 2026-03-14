"use client";

import { useState, useEffect } from "react";
import { Monitor } from "lucide-react";

export function WindowSize() {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const updateSize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-600 dark:bg-slate-700">
      <h3 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-100">
        Размеры окна
      </h3>
      <div className="flex items-center gap-3">
        <Monitor size={24} className="text-slate-600 dark:text-slate-300" />
        <div className="flex gap-4 text-slate-800 dark:text-slate-100">
          <span>Ширина: <strong>{width}</strong> px</span>
          <span>Высота: <strong>{height}</strong> px</span>
        </div>
      </div>
    </div>
  );
}
