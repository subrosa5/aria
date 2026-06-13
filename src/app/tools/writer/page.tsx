"use client";
import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { FileText, Mail, Rss, Code2, Sparkles, Copy, Check } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLanguageStore } from "@/store/language";
import { translations } from "@/lib/i18n";

export default function WriterPage() {
  const { lang } = useLanguageStore();
  const t = translations[lang];

  const types = [
    { id: "blog" as const, icon: FileText, label: t.writer_blog, color: "violet" },
    { id: "email" as const, icon: Mail, label: t.writer_email, color: "blue" },
    { id: "social" as const, icon: Rss, label: t.writer_social, color: "sky" },
    { id: "code" as const, icon: Code2, label: t.writer_code, color: "emerald" },
  ];

  const tones = [
    { id: "Professional", label: t.writer_tone_professional },
    { id: "Casual", label: t.writer_tone_casual },
    { id: "Friendly", label: t.writer_tone_friendly },
    { id: "Persuasive", label: t.writer_tone_persuasive },
    { id: "Informative", label: t.writer_tone_informative },
  ];

  const [type, setType] = useState<"blog" | "email" | "social" | "code">("blog");
  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState("Professional");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    if (!prompt.trim()) return;
    setLoading(true); setResult("");
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, prompt, tone }),
    });
    const d = await res.json();
    setResult(d.result || "");
    setLoading(false);
  };

  const copy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 md:ml-64 pt-14 md:pt-0 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">{t.writer_title}</h1>
            <p className="text-slate-500">{t.writer_sub}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Input panel */}
            <div className="space-y-4 md:space-y-5">
              <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-100">
                <h2 className="text-sm font-semibold text-slate-700 mb-3">{t.writer_type}</h2>
                <div className="grid grid-cols-2 gap-2">
                  {types.map(tp => (
                    <button key={tp.id} onClick={() => setType(tp.id)}
                      className={cn("flex items-center gap-2.5 px-3 md:px-4 py-3 rounded-xl text-sm font-medium transition-all border-2",
                        type === tp.id ? "border-violet-500 bg-violet-50 text-violet-700" : "border-slate-100 text-slate-600 hover:border-slate-200")}>
                      <tp.icon className="w-4 h-4 flex-shrink-0" /> {tp.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-100">
                <h2 className="text-sm font-semibold text-slate-700 mb-3">{t.writer_tone}</h2>
                <div className="flex flex-wrap gap-2">
                  {tones.map(tn => (
                    <button key={tn.id} onClick={() => setTone(tn.id)}
                      className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                        tone === tn.id ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200")}>
                      {tn.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-100">
                <h2 className="text-sm font-semibold text-slate-700 mb-3">{t.writer_prompt_label}</h2>
                <textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={4}
                  placeholder={t.writer_prompt_placeholder}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none" />
                <button onClick={generate} disabled={loading || !prompt.trim()}
                  className="mt-3 w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-3 rounded-xl font-semibold text-sm hover:from-violet-700 hover:to-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  {loading ? t.writer_generating : t.writer_generate}
                </button>
              </div>
            </div>

            {/* Result panel */}
            <div className="bg-white rounded-2xl border border-slate-100 flex flex-col min-h-[300px] md:min-h-0">
              <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <h2 className="text-sm font-semibold text-slate-700">{t.writer_result}</h2>
                {result && (
                  <button onClick={copy} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-violet-600 transition-colors">
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? t.writer_copied : t.writer_copy}
                  </button>
                )}
              </div>
              <div className="flex-1 p-4 overflow-y-auto">
                {loading ? (
                  <div className="space-y-3">
                    {[100, 80, 90, 70, 85].map((w, i) => (
                      <div key={i} className="h-4 bg-slate-100 rounded animate-pulse" style={{ width: `${w}%` }} />
                    ))}
                  </div>
                ) : result ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {result}
                  </motion.div>
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400 text-sm text-center py-12 md:py-0">
                    <div>
                      <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      <p>{t.writer_empty}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
