"use client";
import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { MessageSquare, FileText, Zap, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguageStore } from "@/store/language";
import { translations } from "@/lib/i18n";

interface UserData { id: string; name: string; email: string; plan: string; }

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [usage, setUsage] = useState(0);
  const { lang } = useLanguageStore();
  const t = translations[lang];

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => { setUser(d.user); setUsage(d.usage || 0); });
  }, []);

  const limit = user?.plan === "FREE" ? 50 : Infinity;
  const pct = Math.min((usage / (limit === Infinity ? 100 : limit)) * 100, 100);

  const stats = [
    { icon: MessageSquare, label: t.dash_messages, value: usage, color: "violet" },
    { icon: FileText, label: t.dash_generations, value: 0, color: "indigo" },
    { icon: Zap, label: t.dash_plan, value: user?.plan || "FREE", color: "amber" },
    { icon: TrendingUp, label: t.dash_days, value: 1, color: "emerald" },
  ];

  const tools = [
    { href: "/chat", icon: MessageSquare, title: t.dash_chat_title, desc: t.dash_chat_desc, color: "from-violet-500 to-indigo-500" },
    { href: "/tools/writer", icon: FileText, title: t.dash_writer_title, desc: t.dash_writer_desc, color: "from-indigo-500 to-blue-500" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 md:ml-64 pt-14 md:pt-0 p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              {t.dash_greeting}, {user?.name?.split(" ")[0] || "..."} 👋
            </h1>
            <p className="text-slate-500 mt-1 text-sm md:text-base">{t.dash_subtitle}</p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
            {stats.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl p-4 md:p-5 border border-slate-100 shadow-sm">
                <div className={`w-9 h-9 md:w-10 md:h-10 rounded-xl bg-${s.color}-50 flex items-center justify-center mb-3`}>
                  <s.icon className={`w-4 h-4 md:w-5 md:h-5 text-${s.color}-600`} />
                </div>
                <p className="text-xl md:text-2xl font-bold text-slate-900">{s.value}</p>
                <p className="text-xs text-slate-500 mt-1 leading-snug">{s.label}</p>
              </motion.div>
            ))}
          </div>

          {user?.plan === "FREE" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="bg-gradient-to-r from-violet-600 to-indigo-700 rounded-2xl p-5 md:p-6 mb-6 md:mb-8 text-white">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{t.dash_usage}</h3>
                  <p className="text-violet-200 text-sm mb-4">
                    {t.dash_usage_sub.replace("{usage}", String(usage)).replace("{limit}", String(limit))}
                  </p>
                  <div className="bg-white/20 rounded-full h-2 overflow-hidden">
                    <div className="bg-white h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
                <Link href="/pricing" className="bg-white text-violet-700 text-sm font-semibold px-4 py-2 rounded-xl hover:bg-violet-50 transition-colors flex-shrink-0 text-center sm:ml-6">
                  {t.dash_upgrade}
                </Link>
              </div>
            </motion.div>
          )}

          <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-4">{t.dash_quick}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {tools.map((tool, i) => (
              <motion.div key={tool.href} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}>
                <Link href={tool.href} className="bg-white rounded-2xl p-5 md:p-6 border border-slate-100 hover:border-violet-200 hover:shadow-md transition-all flex items-center gap-4 group">
                  <div className={`w-11 h-11 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center flex-shrink-0`}>
                    <tool.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900">{tool.title}</h3>
                    <p className="text-sm text-slate-500">{tool.desc}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-violet-600 transition-colors flex-shrink-0" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
