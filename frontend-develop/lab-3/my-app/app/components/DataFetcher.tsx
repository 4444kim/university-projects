"use client";

import { useState, useEffect } from "react";
import { Loader } from "lucide-react";

const mockFetch = (): Promise<{ id: number; title: string }[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, title: "Первый элемент" },
        { id: 2, title: "Второй элемент" },
        { id: 3, title: "Третий элемент" },
      ]);
    }, 1500);
  });
};

export function DataFetcher() {
  const [data, setData] = useState<{ id: number; title: string }[] | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mockFetch()
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-600 dark:bg-slate-700">
      <h3 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-100">
        Подгрузка данных (mock API)
      </h3>
      {loading ? (
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
          <Loader size={20} className="animate-spin" />
          Загрузка…
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {data?.map((item) => (
            <li
              key={item.id}
              className="rounded-lg border border-slate-200 bg-slate-50 py-2 px-3 text-slate-800 dark:border-slate-600 dark:bg-slate-600/50 dark:text-slate-100"
            >
              {item.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
