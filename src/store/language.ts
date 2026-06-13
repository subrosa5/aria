"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Lang = "en" | "ru";

interface LanguageStore {
  lang: Lang;
  toggle: () => void;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set, get) => ({
      lang: "en",
      toggle: () => set({ lang: get().lang === "en" ? "ru" : "en" }),
    }),
    { name: "aria-lang" }
  )
);
