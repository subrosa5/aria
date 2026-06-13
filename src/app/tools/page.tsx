"use client";
import Sidebar from "@/components/layout/Sidebar";
import Link from "next/link";
import { FileText, Mail, Rss, Code2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguageStore } from "@/store/language";
import { translations } from "@/lib/i18n";

export default function ToolsPage() {
  const { lang } = useLanguageStore();
  const t = translations[lang];

  const tools = [
    { href: "/tools/writer?type=blog", icon: FileText, title: t.tools_blog, desc: t.tools_blog_desc, color: "from-violet-500 to-purple-600" },
    { href: "/tools/writer?type=email", icon: Mail, title: t.tools_email_tool, desc: t.tools_email_desc, color: "from-blue-500 to-indigo-600" },
    { href: "/tools/writer?type=social", icon: Rss, title: t.tools_social, desc: t.tools_social_desc, color: "from-sky-500 to-blue-600" },
    { href: "/tools/writer?type=code", icon: Code2, title: t.tools_code, desc: t.tools_code_desc, color: "from-emerald-500 to-teal-600" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 md:ml-64 pt-14 md:pt-0 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">{t.tools_title}</h1>
            <p className="text-slate-500">{t.tools_sub}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {tools.map((tool, i) => (
              <motion.div key={tool.href} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <Link href={tool.href} className="bg-white rounded-2xl p-5 md:p-6 border border-slate-100 hover:border-violet-200 hover:shadow-md transition-all flex gap-4 group">
                  <div className={`w-11 h-11 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center flex-shrink-0`}>
                    <tool.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 mb-1">{tool.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{tool.desc}</p>
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
