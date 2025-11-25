"use client"

import Link from 'next/link';
import { Eye, Palette, Activity, Zap, ScanLine, Brain, BookOpen, User, Crown, ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from "@/components/providers/language-provider"
import { useAuth } from "@/components/providers/auth-provider"
import { Button } from "@/components/ui/button"

export function TestGrid() {
  const { t, lang } = useLanguage();
  const { isAuthenticated, membershipStatus } = useAuth();

  const icons = {
    acuity: Eye,
    color: Palette,
    sensitivity: Zap,
    field: ScanLine,
    micro: Activity,
    games: Brain
  };

  const colors = {
    acuity: { bg: "bg-blue-500", light: "bg-blue-50 dark:bg-blue-900/30", text: "text-blue-500" },
    color: { bg: "bg-purple-500", light: "bg-purple-50 dark:bg-purple-900/30", text: "text-purple-500" },
    sensitivity: { bg: "bg-amber-500", light: "bg-amber-50 dark:bg-amber-900/30", text: "text-amber-500" },
    field: { bg: "bg-emerald-500", light: "bg-emerald-50 dark:bg-emerald-900/30", text: "text-emerald-500" },
    micro: { bg: "bg-rose-500", light: "bg-rose-50 dark:bg-rose-900/30", text: "text-rose-500" },
    games: { bg: "bg-indigo-500", light: "bg-indigo-50 dark:bg-indigo-900/30", text: "text-indigo-500" }
  };

  const testKeys = ['acuity', 'color', 'sensitivity', 'field', 'micro', 'games'] as const;
  
  const getHref = (key: string) => {
    const routes: Record<string, string> = {
      acuity: '/acuity',
      color: '/color-blindness',
      sensitivity: '/sensitivity',
      field: '/field',
      micro: '/micro-perimetry',
      games: '/games'
    };
    return routes[key] || '/';
  };

  return (
    <section id="tests" className="container py-12 md:py-16 lg:py-24 mx-auto px-4">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {lang === 'zh' ? '视力健康测试' : 'Vision Health Tests'}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {lang === 'zh' 
            ? '专业级视力测试工具，基于国际眼科标准设计' 
            : 'Professional vision testing tools based on international ophthalmology standards'}
        </p>
      </div>

      {/* Test Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {testKeys.map((key) => {
          const Icon = icons[key];
          const color = colors[key];
          const test = t.tests[key];
          
          return (
            <Link 
              key={key} 
              href={getHref(key)} 
              className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-gray-800"
            >
              {/* Gradient Overlay */}
              <div className={`absolute top-0 right-0 w-32 h-32 ${color.bg} opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500`} />
              
              {/* Icon */}
              <div className={`relative mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${color.light} transition-all group-hover:scale-110`}>
                <Icon className={`h-7 w-7 ${color.text}`} />
              </div>
              
              {/* Content */}
              <h3 className="mb-2 font-bold text-xl text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {test.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                {test.description}
              </p>
              
              {/* Arrow */}
              <div className="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                {lang === 'zh' ? '开始测试' : 'Start Test'}
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          )
        })}
      </div>

      {/* Feature Cards */}
      <div className="mt-16 grid md:grid-cols-3 gap-6">
        {/* Knowledge Base Card */}
        <Link href="/knowledge" className="group p-6 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white hover:shadow-xl transition-all hover:-translate-y-1">
          <BookOpen className="w-10 h-10 mb-4 opacity-90" />
          <h3 className="text-xl font-bold mb-2">
            {lang === 'zh' ? '眼健康知识库' : 'Knowledge Base'}
          </h3>
          <p className="text-blue-100 text-sm mb-4">
            {lang === 'zh' 
              ? '基于最新科学研究的眼健康知识，助你科学护眼' 
              : 'Eye health knowledge based on latest scientific research'}
          </p>
          <div className="flex items-center text-sm font-medium">
            {lang === 'zh' ? '探索知识' : 'Explore'}
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* AI Analysis Card */}
        <Link href="/user" className="group p-6 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 text-white hover:shadow-xl transition-all hover:-translate-y-1">
          <Sparkles className="w-10 h-10 mb-4 opacity-90" />
          <h3 className="text-xl font-bold mb-2">
            {lang === 'zh' ? 'AI智能分析' : 'AI Analysis'}
          </h3>
          <p className="text-purple-100 text-sm mb-4">
            {lang === 'zh' 
              ? 'AI分析你的测试结果，提供个性化健康建议' 
              : 'AI analyzes your test results with personalized recommendations'}
          </p>
          <div className="flex items-center text-sm font-medium">
            {lang === 'zh' ? '查看分析' : 'View Analysis'}
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Membership Card */}
        <Link href="/membership" className="group p-6 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white hover:shadow-xl transition-all hover:-translate-y-1">
          <Crown className="w-10 h-10 mb-4 opacity-90" />
          <h3 className="text-xl font-bold mb-2">
            {lang === 'zh' ? '会员专享' : 'Premium'}
          </h3>
          <p className="text-amber-100 text-sm mb-4">
            {lang === 'zh' 
              ? '解锁无限训练、高级分析和专属功能' 
              : 'Unlock unlimited training, advanced analysis and exclusive features'}
          </p>
          <div className="flex items-center text-sm font-medium">
            {lang === 'zh' ? '了解会员' : 'Learn More'}
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      {/* Disclaimer */}
      <div className="mt-20 rounded-3xl bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900/50 dark:to-gray-900/50 p-8 md:p-12 border border-slate-200 dark:border-slate-800">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full text-sm text-gray-600 dark:text-gray-400 mb-4 shadow-sm">
            ⚠️ {lang === 'zh' ? '重要提示' : 'Important Notice'}
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            {t.disclaimer.title}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            {t.disclaimer.text}
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">{t.footer.copyright}</p>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link href="/about" className="hover:text-gray-900 dark:hover:text-white transition-colors">
              {lang === 'zh' ? '关于我们' : 'About'}
            </Link>
            <Link href="/knowledge" className="hover:text-gray-900 dark:hover:text-white transition-colors">
              {lang === 'zh' ? '知识库' : 'Knowledge'}
            </Link>
            <a href="mailto:support@eyecare.app" className="hover:text-gray-900 dark:hover:text-white transition-colors">
              {lang === 'zh' ? '联系我们' : 'Contact'}
            </a>
          </div>
        </div>
      </footer>
    </section>
  )
}
