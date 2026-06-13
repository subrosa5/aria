"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Sparkles, MessageSquare, FileText, LayoutDashboard, Settings, LogOut, ChevronRight, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguageStore } from "@/store/language";
import { translations } from "@/lib/i18n";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { lang, toggle } = useLanguageStore();
  const t = translations[lang];
  const [isOpen, setIsOpen] = useState(false);

  const nav = [
    { href: "/dashboard", icon: LayoutDashboard, label: t.nav_dashboard },
    { href: "/chat", icon: MessageSquare, label: t.nav_chat },
    { href: "/tools", icon: FileText, label: t.nav_tools },
    { href: "/settings", icon: Settings, label: t.nav_settings },
  ];

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  const NavLinks = ({ onClickLink }: { onClickLink?: () => void }) => (
    <>
      {nav.map(({ href, icon: Icon, label }) => {
        const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
        return (
          <Link key={href} href={href} onClick={onClickLink}
            className={cn("flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
              active ? "bg-violet-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white")}>
            <Icon className="w-5 h-5 flex-shrink-0" />
            {label}
            {active && <ChevronRight className="w-4 h-4 ml-auto" />}
          </Link>
        );
      })}
    </>
  );

  const BottomSection = () => (
    <div className="p-4 border-t border-slate-800 space-y-1">
      <button onClick={toggle}
        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
        <span className="text-base select-none">🌐</span>
        <span>{lang === "en" ? "English" : "Русский"}</span>
        <span className="ml-auto text-xs text-slate-500">{lang === "en" ? "→ RU" : "→ EN"}</span>
      </button>
      <button onClick={logout}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-all">
        <LogOut className="w-5 h-5" /> {t.nav_signout}
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-white font-bold">Aria</span>
        </Link>
        <button onClick={() => setIsOpen(true)} className="text-slate-400 hover:text-white p-1.5" aria-label="Open menu">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile backdrop */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 bg-black/60 z-40" onClick={() => setIsOpen(false)} />
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 h-screen bg-slate-900 flex-col fixed left-0 top-0 z-40">
        <div className="p-6 border-b border-slate-800">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold text-lg">Aria</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <NavLinks />
        </nav>
        <BottomSection />
      </aside>

      {/* Mobile drawer */}
      <aside className={cn(
        "md:hidden fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 flex flex-col transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-800">
          <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-white font-bold">Aria</span>
          </Link>
          <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <NavLinks onClickLink={() => setIsOpen(false)} />
        </nav>
        <BottomSection />
      </aside>
    </>
  );
}
