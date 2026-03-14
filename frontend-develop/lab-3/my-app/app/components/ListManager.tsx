"use client";

import { useState } from "react";
import { ListPlus } from "lucide-react";

export function ListManager() {
  const [inputValue, setInputValue] = useState("");
  const [items, setItems] = useState<string[]>([]);

  const handleAdd = () => {
    const text = inputValue.trim();
    if (text === "") return;
    setItems((prev) => [...prev, text]);
    setInputValue("");
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-600 dark:bg-slate-700">
      <h3 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-100">
        Динамический список
      </h3>
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="Введите элемент..."
          className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-800 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none dark:border-slate-500 dark:bg-slate-600 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus:border-slate-400"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-2 rounded-lg bg-slate-600 px-4 py-2 text-white transition hover:bg-slate-700 dark:bg-slate-500 dark:hover:bg-slate-400"
        >
          <ListPlus size={18} />
          Добавить
        </button>
      </div>
      <ul className="mt-4 flex flex-col gap-2">
        {items.map((item, index) => (
          <li
            key={`${item}-${index}`}
            className="rounded-lg border border-slate-200 bg-slate-50 py-2 px-3 text-slate-800 dark:border-slate-600 dark:bg-slate-600/50 dark:text-slate-100"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
