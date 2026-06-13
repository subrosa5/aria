"use client";
import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { User, Mail, Crown, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguageStore } from "@/store/language";
import { translations } from "@/lib/i18n";

interface UserData { id: string; name: string; email: string; plan: string; createdAt: string; }

export default function SettingsPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [name, setName] = useState("");
  const [saved, setSaved] = useState(false);
  const { lang } = useLanguageStore();
  const t = translations[lang];

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => { setUser(d.user); setName(d.user.name); });
  }, []);

  const save = async () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 md:ml-64 pt-14 md:pt-0 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">{t.settings_title}</h1>
            <p className="text-slate-500">{t.settings_sub}</p>
          </div>

          <div className="space-y-4">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="px-5 md:px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                <User className="w-4 h-4 text-slate-500" />
                <h2 className="font-semibold text-slate-900">{t.settings_profile}</h2>
              </div>
              <div className="p-5 md:p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">{t.settings_display_name}</label>
                  <input value={name} onChange={e => setName(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">{t.settings_email}</label>
                  <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-500">{user?.email}</span>
                  </div>
                </div>
                <button onClick={save} className="bg-violet-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-violet-700 transition-colors">
                  {saved ? t.settings_saved : t.settings_save}
                </button>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="px-5 md:px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-500" />
                <h2 className="font-semibold text-slate-900">{t.settings_plan}</h2>
              </div>
              <div className="p-5 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-900">{user?.plan || "FREE"} Plan</p>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {user?.plan === "FREE" ? t.settings_plan_free_desc : t.settings_plan_unlimited}
                    </p>
                  </div>
                  {user?.plan === "FREE" && (
                    <button className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:from-violet-700 hover:to-indigo-700 transition-all flex-shrink-0">
                      {t.settings_upgrade}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="px-5 md:px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                <Shield className="w-4 h-4 text-slate-500" />
                <h2 className="font-semibold text-slate-900">{t.settings_security}</h2>
              </div>
              <div className="p-5 md:p-6">
                <p className="text-sm text-slate-500 mb-4">{t.settings_security_desc}</p>
                <button className="border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
                  {t.settings_change_pass}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
