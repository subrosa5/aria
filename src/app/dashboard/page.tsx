"use client";
import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { MessageSquare, FileText, Zap, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface UserData { id: string; name: string; email: string; plan: string; }

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [usage, setUsage] = useState(0);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => { setUser(d.user); setUsage(d.usage || 0); });
  }, []);

  const limit = user?.plan === "FREE" ? 50 : Infinity;
  const pct = Math.min((usage / (limit === Infinity ? 100 : limit)) * 100, 100);

  const stats = [
    { icon: MessageSquare, label: "Messages this month", value: usage, color: "violet" },
    { icon: FileText, label: "Generations", value: 0, color: "indigo" },
    { icon: Zap, label: "Plan", value: user?.plan || "FREE", color: "amber" },
    { icon: TrendingUp, label: "Days active", value: 1, color: "emerald" },
  ];

  const tools = [
    { href: "/chat", icon: MessageSquare, title: "AI Chat", desc: "Chat with AI in real-time", color: "from-violet-500 to-indigo-500" },
    { href: "/tools/writer", icon: FileText, title: "Content Writer", desc: "Generate blogs, emails, posts", color: "from-indigo-500 to-blue-500" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="ml-64 flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">
              Good morning, {user?.name?.split(" ")[0] || "there"} 👋
            </h1>
            <p className="text-slate-500 mt-1">Here is what is happening with your workspace today.</p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                <div className={`w-10 h-10 rounded-xl bg-${s.color}-50 flex items-center justify-center mb-3`}>
                  <s.icon className={`w-5 h-5 text-${s.color}-600`} />
                </div>
                <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                <p className="text-xs text-slate-500 mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>

          {user?.plan === "FREE" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="bg-gradient-to-r from-violet-600 to-indigo-700 rounded-2xl p-6 mb-8 text-white">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Free plan usage</h3>
                  <p className="text-violet-200 text-sm mb-4">{usage} of {limit} messages used this month</p>
                  <div className="bg-white/20 rounded-full h-2 overflow-hidden">
                    <div className="bg-white h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
                <Link href="/pricing" className="ml-6 bg-white text-violet-700 text-sm font-semibold px-4 py-2 rounded-xl hover:bg-violet-50 transition-colors flex-shrink-0">
                  Upgrade to Pro
                </Link>
              </div>
            </motion.div>
          )}

          <h2 className="text-xl font-bold text-slate-900 mb-4">Quick actions</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {tools.map((t, i) => (
              <motion.div key={t.href} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}>
                <Link href={t.href} className="bg-white rounded-2xl p-6 border border-slate-100 hover:border-violet-200 hover:shadow-md transition-all flex items-center gap-4 group">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center flex-shrink-0`}>
                    <t.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{t.title}</h3>
                    <p className="text-sm text-slate-500">{t.desc}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-violet-600 transition-colors" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
