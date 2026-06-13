"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Zap, Shield, BarChart3, MessageSquare, FileText, Code2, ChevronRight, Check, ArrowRight } from "lucide-react";

const features = [
  { icon: MessageSquare, title: "AI Chat", desc: "Stream responses in real-time. Context-aware conversations with memory." },
  { icon: FileText, title: "Content Writer", desc: "Blog posts, emails, social media — generated in seconds." },
  { icon: Code2, title: "Code Assistant", desc: "Write, review, and debug code with AI-powered suggestions." },
  { icon: BarChart3, title: "Usage Analytics", desc: "Track your AI usage, token consumption, and productivity gains." },
  { icon: Zap, title: "Lightning Fast", desc: "Optimized streaming for near-instant responses, no waiting." },
  { icon: Shield, title: "Secure by Default", desc: "End-to-end encryption. Your data stays private, always." },
];

const plans = [
  {
    name: "Free", price: "$0", period: "/month", desc: "Perfect to get started",
    features: ["50 AI messages/month", "3 content generations", "Basic chat history", "Email support"],
    cta: "Get started free", href: "/auth/register", highlighted: false,
  },
  {
    name: "Pro", price: "$19", period: "/month", desc: "For power users",
    features: ["Unlimited AI messages", "Unlimited generations", "Full chat history", "Priority support", "API access", "Custom instructions"],
    cta: "Start Pro trial", href: "/auth/register", highlighted: true,
  },
  {
    name: "Team", price: "$49", period: "/month", desc: "For growing teams",
    features: ["Everything in Pro", "Up to 10 members", "Shared workspaces", "Admin dashboard", "SSO / SAML", "SLA guarantee"],
    cta: "Contact sales", href: "/auth/register", highlighted: false,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">Aria</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a>
            <Link href="/auth/login" className="hover:text-slate-900 transition-colors">Sign in</Link>
          </div>
          <Link href="/auth/register" className="bg-violet-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-violet-700 transition-colors flex items-center gap-2">
            Get started <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 bg-violet-50 text-violet-700 text-sm font-medium px-4 py-2 rounded-full mb-8 border border-violet-100">
            <Sparkles className="w-4 h-4" /> Powered by Claude AI
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-6xl md:text-7xl font-extrabold text-slate-900 leading-tight tracking-tight mb-6">
            Your AI workspace,{" "}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text text-transparent">reimagined</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Chat, write, and code with the power of AI. Aria brings together everything you need to work smarter in one beautifully designed workspace.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register" className="bg-violet-600 text-white font-semibold px-8 py-4 rounded-2xl hover:bg-violet-700 transition-all hover:shadow-lg hover:shadow-violet-200 flex items-center justify-center gap-2 text-base">
              Start for free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/auth/login" className="bg-slate-50 text-slate-700 font-semibold px-8 py-4 rounded-2xl hover:bg-slate-100 transition-colors border border-slate-200 text-base">
              Sign in
            </Link>
          </motion.div>
          <p className="text-sm text-slate-400 mt-6">No credit card required · 50 free messages/month</p>

          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }} className="mt-16 relative">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-1 shadow-2xl shadow-slate-300">
              <div className="bg-slate-900 rounded-[22px] p-6 text-left">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="ml-3 text-slate-500 text-sm">aria — Chat</span>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <div className="bg-violet-600 text-white text-sm px-4 py-3 rounded-2xl rounded-br-sm max-w-xs">
                      Write a landing page copy for a SaaS product
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex-shrink-0 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-slate-800 text-slate-200 text-sm px-4 py-3 rounded-2xl rounded-tl-sm max-w-md">
                      <span className="text-violet-400 font-semibold">Aria</span><br />
                      Here is a compelling landing page copy:<br /><br />
                      <span className="text-white font-semibold">Transform how your team works.</span>
                      <br /><span className="text-slate-300">Stop juggling tools. Start shipping faster with the all-in-one platform...</span>
                      <span className="inline-block w-0.5 h-4 bg-violet-400 ml-1 animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-400 to-indigo-400 rounded-3xl blur-xl opacity-20 -z-10" />
          </motion.div>
        </div>
      </section>

      <section id="features" className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Everything you need to work smarter</h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">Aria brings together powerful AI tools in one clean, fast interface.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={f.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="bg-white rounded-2xl p-6 border border-slate-100 hover:border-violet-200 hover:shadow-md transition-all group">
                <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-violet-100 transition-colors">
                  <f.icon className="w-6 h-6 text-violet-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Simple, transparent pricing</h2>
            <p className="text-lg text-slate-500">Start free. Upgrade when you need more.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <motion.div key={plan.name} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className={`rounded-2xl p-8 border-2 relative ${plan.highlighted ? "border-violet-500 bg-gradient-to-b from-violet-600 to-indigo-700 text-white shadow-xl shadow-violet-200" : "border-slate-100 bg-white"}`}>
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-bold px-4 py-1.5 rounded-full">MOST POPULAR</div>
                )}
                <div className="mb-6">
                  <h3 className={`text-lg font-bold mb-1 ${plan.highlighted ? "text-white" : "text-slate-900"}`}>{plan.name}</h3>
                  <p className={`text-sm mb-4 ${plan.highlighted ? "text-violet-200" : "text-slate-500"}`}>{plan.desc}</p>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-5xl font-extrabold ${plan.highlighted ? "text-white" : "text-slate-900"}`}>{plan.price}</span>
                    <span className={plan.highlighted ? "text-violet-200" : "text-slate-400"}>{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm">
                      <Check className={`w-4 h-4 flex-shrink-0 ${plan.highlighted ? "text-violet-200" : "text-violet-600"}`} />
                      <span className={plan.highlighted ? "text-violet-100" : "text-slate-600"}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href={plan.href} className={`block text-center py-3 rounded-xl font-semibold text-sm transition-all ${plan.highlighted ? "bg-white text-violet-700 hover:bg-violet-50" : "bg-violet-600 text-white hover:bg-violet-700"}`}>
                  {plan.cta} <ChevronRight className="inline w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-gradient-to-br from-violet-600 to-indigo-700">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl font-bold text-white mb-4">Ready to work smarter?</h2>
            <p className="text-violet-200 text-lg mb-8">Join thousands of professionals using Aria to 10x their productivity.</p>
            <Link href="/auth/register" className="inline-flex items-center gap-2 bg-white text-violet-700 font-bold px-8 py-4 rounded-2xl hover:bg-violet-50 transition-colors text-base">
              Get started for free <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-400 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-white font-semibold">Aria</span>
          </div>
          <p className="text-sm">© 2024 Aria. Built with Next.js and Claude AI.</p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
