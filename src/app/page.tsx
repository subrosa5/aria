"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Zap, Shield, BarChart3, MessageSquare, FileText, Code2, ChevronRight, Check, ArrowRight } from "lucide-react";
import { useLanguageStore } from "@/store/language";
import { translations } from "@/lib/i18n";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

export default function LandingPage() {
  const { lang } = useLanguageStore();
  const t = translations[lang];

  const features = [
    { icon: MessageSquare, title: "AI Chat", desc: lang === "en" ? "Stream responses in real-time. Context-aware conversations with memory." : "Ответы в реальном времени. Контекстные диалоги с памятью." },
    { icon: FileText, title: lang === "en" ? "Content Writer" : "Генератор контента", desc: lang === "en" ? "Blog posts, emails, social media — generated in seconds." : "Посты, письма, соцсети — за секунды." },
    { icon: Code2, title: lang === "en" ? "Code Assistant" : "Помощник по коду", desc: lang === "en" ? "Write, review, and debug code with AI-powered suggestions." : "Пишите, проверяйте и отлаживайте код с помощью ИИ." },
    { icon: BarChart3, title: lang === "en" ? "Usage Analytics" : "Аналитика", desc: lang === "en" ? "Track your AI usage, token consumption, and productivity gains." : "Отслеживайте использование ИИ и рост продуктивности." },
    { icon: Zap, title: lang === "en" ? "Lightning Fast" : "Молниеносно", desc: lang === "en" ? "Optimized streaming for near-instant responses, no waiting." : "Оптимизированный стриминг без задержек." },
    { icon: Shield, title: lang === "en" ? "Secure by Default" : "Безопасность", desc: lang === "en" ? "End-to-end encryption. Your data stays private, always." : "Шифрование данных. Ваша информация всегда приватна." },
  ];

  const plans = [
    {
      name: t.plan_free, price: "$0", period: lang === "en" ? "/month" : "/мес", desc: lang === "en" ? "Perfect to get started" : "Идеально для старта",
      features: lang === "en"
        ? ["50 AI messages/month", "3 content generations", "Basic chat history", "Email support"]
        : ["50 сообщений ИИ/мес", "3 генерации контента", "История чатов", "Поддержка по email"],
      cta: t.plan_free_cta, href: "/auth/register", highlighted: false,
    },
    {
      name: t.plan_pro, price: "$19", period: lang === "en" ? "/month" : "/мес", desc: lang === "en" ? "For power users" : "Для профессионалов",
      features: lang === "en"
        ? ["Unlimited AI messages", "Unlimited generations", "Full chat history", "Priority support", "API access", "Custom instructions"]
        : ["Безлимитные сообщения ИИ", "Безлимитные генерации", "Полная история чатов", "Приоритетная поддержка", "Доступ к API", "Кастомные инструкции"],
      cta: t.plan_pro_cta, href: "/auth/register", highlighted: true,
    },
    {
      name: t.plan_team, price: "$49", period: lang === "en" ? "/month" : "/мес", desc: lang === "en" ? "For growing teams" : "Для команд",
      features: lang === "en"
        ? ["Everything in Pro", "Up to 10 members", "Shared workspaces", "Admin dashboard", "SSO / SAML", "SLA guarantee"]
        : ["Всё из Про", "До 10 участников", "Общие рабочие пространства", "Панель администратора", "SSO / SAML", "Гарантия SLA"],
      cta: t.plan_team_cta, href: "/auth/register", highlighted: false,
    },
  ];

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
            <a href="#features" className="hover:text-slate-900 transition-colors">{t.land_features}</a>
            <a href="#pricing" className="hover:text-slate-900 transition-colors">{t.land_pricing}</a>
            <Link href="/auth/login" className="hover:text-slate-900 transition-colors">{t.land_signin}</Link>
          </div>
          <Link href="/auth/register" className="bg-violet-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-violet-700 transition-colors flex items-center gap-2">
            {t.land_getstarted} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 bg-violet-50 text-violet-700 text-sm font-medium px-4 py-2 rounded-full mb-8 border border-violet-100">
            <Sparkles className="w-4 h-4" /> Powered by Groq AI
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-6xl md:text-7xl font-extrabold text-slate-900 leading-tight tracking-tight mb-6">
            {t.land_hero_title1}{" "}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text text-transparent">{t.land_hero_title2}</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t.land_hero_sub}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register" className="bg-violet-600 text-white font-semibold px-8 py-4 rounded-2xl hover:bg-violet-700 transition-all hover:shadow-lg hover:shadow-violet-200 flex items-center justify-center gap-2 text-base">
              {t.land_hero_cta} <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/auth/login" className="bg-slate-50 text-slate-700 font-semibold px-8 py-4 rounded-2xl hover:bg-slate-100 transition-colors border border-slate-200 text-base">
              {t.land_signin}
            </Link>
          </motion.div>
          <p className="text-sm text-slate-400 mt-6">{lang === "en" ? "No credit card required · 50 free messages/month" : "Без карты · 50 бесплатных сообщений/мес"}</p>

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
                      {lang === "en" ? "Write a landing page copy for a SaaS product" : "Напиши текст для лендинга SaaS-продукта"}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex-shrink-0 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-slate-800 text-slate-200 text-sm px-4 py-3 rounded-2xl rounded-tl-sm max-w-md">
                      <span className="text-violet-400 font-semibold">Aria</span><br />
                      {lang === "en" ? (
                        <>Here is a compelling landing page copy:<br /><br />
                        <span className="text-white font-semibold">Transform how your team works.</span>
                        <br /><span className="text-slate-300">Stop juggling tools. Start shipping faster with the all-in-one platform...</span></>
                      ) : (
                        <>Вот убедительный текст для лендинга:<br /><br />
                        <span className="text-white font-semibold">Измените способ работы вашей команды.</span>
                        <br /><span className="text-slate-300">Перестаньте переключаться между инструментами. Работайте быстрее...</span></>
                      )}
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
            <h2 className="text-4xl font-bold text-slate-900 mb-4">{t.land_features_title}</h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">{t.land_features_sub}</p>
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
            <h2 className="text-4xl font-bold text-slate-900 mb-4">{t.land_pricing_title}</h2>
            <p className="text-lg text-slate-500">{t.land_pricing_sub}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <motion.div key={plan.name} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className={`rounded-2xl p-8 border-2 relative ${plan.highlighted ? "border-violet-500 bg-gradient-to-b from-violet-600 to-indigo-700 text-white shadow-xl shadow-violet-200" : "border-slate-100 bg-white"}`}>
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-bold px-4 py-1.5 rounded-full">
                    {lang === "en" ? "MOST POPULAR" : "ПОПУЛЯРНЫЙ"}
                  </div>
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
            <h2 className="text-4xl font-bold text-white mb-4">{t.land_cta_title}</h2>
            <p className="text-violet-200 text-lg mb-8">{t.land_cta_sub}</p>
            <Link href="/auth/register" className="inline-flex items-center gap-2 bg-white text-violet-700 font-bold px-8 py-4 rounded-2xl hover:bg-violet-50 transition-colors text-base">
              {t.land_cta_btn} <ArrowRight className="w-5 h-5" />
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
          <p className="text-sm">{t.land_footer}</p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">{lang === "en" ? "Privacy" : "Конфиденциальность"}</a>
            <a href="#" className="hover:text-white transition-colors">{lang === "en" ? "Terms" : "Условия"}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
