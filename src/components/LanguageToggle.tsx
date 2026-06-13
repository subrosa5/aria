"use client";
import { useLanguageStore } from "@/store/language";

export default function LanguageToggle() {
  const { lang, toggle } = useLanguageStore();

  return (
    <button
      onClick={toggle}
      className="fixed top-4 right-4 z-[9999] flex items-center gap-1 bg-white/90 backdrop-blur border border-slate-200 shadow-sm rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-violet-300 hover:text-violet-600 transition-all"
    >
      <span className={lang === "en" ? "text-violet-600" : "text-slate-400"}>EN</span>
      <span className="text-slate-300 select-none">|</span>
      <span className={lang === "ru" ? "text-violet-600" : "text-slate-400"}>RU</span>
    </button>
  );
}
