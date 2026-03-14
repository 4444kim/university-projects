"use client";

import { useState } from "react";
import { User } from "lucide-react";

export function ProfileEditor() {
  const [name, setName] = useState("");
  const [profession, setProfession] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-600 dark:bg-slate-700">
      <h3 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-100">
        Редактор карточки профиля
      </h3>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Имя
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ваше имя"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-800 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none dark:border-slate-500 dark:bg-slate-600 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus:border-slate-400"
          />
          <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Профессия
          </label>
          <input
            type="text"
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
            placeholder="Профессия"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-800 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none dark:border-slate-500 dark:bg-slate-600 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus:border-slate-400"
          />
          <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Описание
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Кратко о себе..."
            rows={3}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-800 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none dark:border-slate-500 dark:bg-slate-600 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus:border-slate-400"
          />
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-600/50">
          <p className="mb-3 text-sm font-medium text-slate-500 dark:text-slate-400">
            Превью
          </p>
          <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-600 dark:bg-slate-600">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-slate-200 dark:border-slate-500">
              <User size={24} className="text-slate-600 dark:text-slate-300" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-slate-800 dark:text-slate-100">
                {name || "—"}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {profession || "—"}
              </p>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {description || "—"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
