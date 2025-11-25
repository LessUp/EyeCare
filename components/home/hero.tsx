"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/providers/language-provider"
import { useAuth } from "@/components/providers/auth-provider"
import Link from "next/link"
import { Sparkles, BookOpen, Brain, ArrowRight, Star, Users, Award } from "lucide-react"

export function Hero() {
  const { t, lang } = useLanguage();
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-purple-950/30 dark:to-gray-950" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
      
      <div className="relative container mx-auto px-4 py-16 md:py-24 lg:py-32">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/40 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium mb-6 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            {lang === 'zh' ? '基于2024-2025最新眼科研究' : 'Based on 2024-2025 Latest Research'}
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
              {lang === 'zh' ? '科学护眼' : 'Scientific Eye Care'}
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {lang === 'zh' ? 'AI 助力' : 'AI Powered'}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            {lang === 'zh' 
              ? '专业视力测试、科学视觉训练、AI智能分析 — 全方位守护您的眼健康' 
              : 'Professional vision testing, scientific visual training, AI analysis — Complete eye health protection'}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link href="#tests">
              <Button size="lg" className="rounded-full px-8 h-14 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all">
                {t.hero.start}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/knowledge">
              <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-lg border-2">
                <BookOpen className="w-5 h-5 mr-2" />
                {lang === 'zh' ? '了解更多' : 'Learn More'}
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 md:gap-16">
            {[
              { icon: Users, value: '10K+', label: lang === 'zh' ? '活跃用户' : 'Active Users' },
              { icon: Brain, value: '50+', label: lang === 'zh' ? '训练项目' : 'Training Programs' },
              { icon: Award, value: '98%', label: lang === 'zh' ? '满意度' : 'Satisfaction' },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="flex items-center gap-2 mb-1">
                  <stat.icon className="w-5 h-5 text-blue-600" />
                  <span className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</span>
                </div>
                <span className="text-sm text-gray-500">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
    </section>
  )
}
