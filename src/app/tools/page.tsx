"use client";
import Sidebar from "@/components/layout/Sidebar";
import Link from "next/link";
import { FileText, Mail, Rss, Code2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const tools = [
  { href: "/tools/writer?type=blog", icon: FileText, title: "Blog Writer", desc: "Write engaging blog posts and articles optimized for SEO.", color: "from-violet-500 to-purple-600" },
  { href: "/tools/writer?type=email", icon: Mail, title: "Email Writer", desc: "Craft professional emails for any situation instantly.", color: "from-blue-500 to-indigo-600" },
  { href: "/tools/writer?type=social", icon: Rss, title: "Social Media", desc: "Create viral posts for Rss, LinkedIn, and more.", color: "from-sky-500 to-blue-600" },
  { href: "/tools/writer?type=code", icon: Code2, title: "Code Generator", desc: "Generate clean, commented code in any language.", color: "from-emerald-500 to-teal-600" },
];

export default function ToolsPage() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="ml-64 flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">AI Tools</h1>
            <p className="text-slate-500">Powerful tools to supercharge your workflow.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {tools.map((t, i) => (
              <motion.div key={t.href} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <Link href={t.href} className="bg-white rounded-2xl p-6 border border-slate-100 hover:border-violet-200 hover:shadow-md transition-all flex gap-4 group">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center flex-shrink-0`}>
                    <t.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 mb-1">{t.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{t.desc}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-violet-600 transition-colors self-center flex-shrink-0" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
