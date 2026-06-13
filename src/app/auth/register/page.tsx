"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { useLanguageStore } from "@/store/language";
import { translations } from "@/lib/i18n";

function LangToggle() {
  const { lang, toggle } = useLanguageStore();
  return (
    <button onClick={toggle}
      className="fixed top-4 right-4 z-50 flex items-center gap-1 bg-white/90 backdrop-blur border border-slate-200 shadow-sm rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-500 hover:border-violet-300 hover:text-violet-600 transition-all">
      <span className={lang === "en" ? "text-violet-600" : ""}>EN</span>
      <span className="text-slate-300 select-none">|</span>
      <span className={lang === "ru" ? "text-violet-600" : ""}>RU</span>
    </button>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const { lang } = useLanguageStore();
  const t = translations[lang];
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) { router.push("/dashboard"); router.refresh(); }
    else { const d = await res.json(); setError(d.error || "Registration failed"); }
    setLoading(false);
  };

  const fields = [
    { label: t.auth_name, key: "name", type: "text", placeholder: t.auth_name_placeholder },
    { label: t.auth_email, key: "email", type: "email", placeholder: "you@example.com" },
    { label: t.auth_password, key: "password", type: "password", placeholder: t.auth_pass_hint },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <LangToggle />
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900">Aria</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">{t.auth_register_title}</h1>
          <p className="text-slate-500 text-sm">{t.auth_register_sub}</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
          <form onSubmit={submit} className="space-y-5">
            {fields.map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
                <input type={type} required value={form[key as keyof typeof form]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                  placeholder={placeholder} />
              </div>
            ))}
            {error && <p className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-xl">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-3 rounded-xl font-semibold text-sm hover:from-violet-700 hover:to-indigo-700 transition-all disabled:opacity-50 shadow-sm">
              {loading ? t.auth_creating : t.auth_signup_btn}
            </button>
          </form>
          <p className="text-center text-sm text-slate-500 mt-6">
            {t.auth_has_account}{" "}
            <Link href="/auth/login" className="text-violet-600 font-semibold hover:underline">{t.auth_signin_link}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
