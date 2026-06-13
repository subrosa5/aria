"use client";
import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { User, Mail, Crown, Shield } from "lucide-react";
import { motion } from "framer-motion";

interface UserData { id: string; name: string; email: string; plan: string; createdAt: string; }

export default function SettingsPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [name, setName] = useState("");
  const [saved, setSaved] = useState(false);

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
      <main className="ml-64 flex-1 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Settings</h1>
            <p className="text-slate-500">Manage your account and preferences.</p>
          </div>

          <div className="space-y-4">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                <User className="w-4 h-4 text-slate-500" />
                <h2 className="font-semibold text-slate-900">Profile</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Display name</label>
                  <input value={name} onChange={e => setName(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                  <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-500">{user?.email}</span>
                  </div>
                </div>
                <button onClick={save} className="bg-violet-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-violet-700 transition-colors">
                  {saved ? "Saved!" : "Save changes"}
                </button>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-500" />
                <h2 className="font-semibold text-slate-900">Plan</h2>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{user?.plan || "FREE"} Plan</p>
                    <p className="text-sm text-slate-500 mt-0.5">{user?.plan === "FREE" ? "50 messages/month" : "Unlimited"}</p>
                  </div>
                  {user?.plan === "FREE" && (
                    <button className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:from-violet-700 hover:to-indigo-700 transition-all">
                      Upgrade to Pro
                    </button>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                <Shield className="w-4 h-4 text-slate-500" />
                <h2 className="font-semibold text-slate-900">Security</h2>
              </div>
              <div className="p-6">
                <p className="text-sm text-slate-500 mb-4">Your account is secured with password authentication.</p>
                <button className="border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
                  Change password
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
