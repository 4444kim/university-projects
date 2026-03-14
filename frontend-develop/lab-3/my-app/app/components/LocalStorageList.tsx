"use client";

import { useState, useEffect } from "react";
import { ListPlus, Trash2 } from "lucide-react";

const STORAGE_KEY = "lab-tasks-list";

export function LocalStorageList() {
  const [items, setItems] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as string[];
        setItems(parsed);
      }
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const handleAdd = () => {
    const text = inputValue.trim();
    if (text === "") return;
    setItems((prev) => [...prev, text]);
    setInputValue("");
  };

  const handleRemove = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-600 dark:bg-slate-700">
      <h3 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-100">
        Список с localStorage
      </h3>
      <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">
        Сохраняется при изменении и восстанавливается после перезагрузки.
      </p>
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="Новая задача..."
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
            className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 py-2 px-3 dark:border-slate-600 dark:bg-slate-600/50"
          >
            <span className="text-slate-800 dark:text-slate-100">{item}</span>
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="rounded p-1 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-600 dark:hover:text-slate-100"
            >
              <Trash2 size={16} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
