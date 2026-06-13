"use client";
import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { FileText, Mail, Rss, Code2, Sparkles, Copy, Check } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const types = [
  { id: "blog", icon: FileText, label: "Blog Post", color: "violet" },
  { id: "email", icon: Mail, label: "Email", color: "blue" },
  { id: "social", icon: Rss, label: "Social Media", color: "sky" },
  { id: "code", icon: Code2, label: "Code", color: "emerald" },
] as const;

const tones = ["Professional", "Casual", "Friendly", "Persuasive", "Informative"];

export default function WriterPage() {
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
      <main className="ml-64 flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Content Writer</h1>
            <p className="text-slate-500">Generate high-quality content with AI in seconds.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-5">
              <div className="bg-white rounded-2xl p-6 border border-slate-100">
                <h2 className="text-sm font-semibold text-slate-700 mb-3">Content type</h2>
                <div className="grid grid-cols-2 gap-2">
                  {types.map(t => (
                    <button key={t.id} onClick={() => setType(t.id)}
                      className={cn("flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium transition-all border-2",
                        type === t.id ? "border-violet-500 bg-violet-50 text-violet-700" : "border-slate-100 text-slate-600 hover:border-slate-200")}>
                      <t.icon className="w-4 h-4" /> {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-100">
                <h2 className="text-sm font-semibold text-slate-700 mb-3">Tone</h2>
                <div className="flex flex-wrap gap-2">
                  {tones.map(t => (
                    <button key={t} onClick={() => setTone(t)}
                      className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                        tone === t ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200")}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-100">
                <h2 className="text-sm font-semibold text-slate-700 mb-3">What do you want to write about?</h2>
                <textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={5}
                  placeholder="Describe your topic, key points, target audience..."
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none" />
                <button onClick={generate} disabled={loading || !prompt.trim()}
                  className="mt-3 w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-3 rounded-xl font-semibold text-sm hover:from-violet-700 hover:to-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  {loading ? "Generating..." : "Generate"}
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <h2 className="text-sm font-semibold text-slate-700">Result</h2>
                {result && (
                  <button onClick={copy} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-violet-600 transition-colors">
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                )}
              </div>
              <div className="flex-1 p-4 overflow-y-auto scrollbar-hide">
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
                  <div className="flex items-center justify-center h-full text-slate-400 text-sm text-center">
                    <div>
                      <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      <p>Your generated content will appear here</p>
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
