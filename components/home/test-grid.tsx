"use client"

import Link from 'next/link';
import { Eye, Palette, Activity, Zap, ScanLine, Brain } from 'lucide-react';
import { useLanguage } from "@/components/providers/language-provider"

export function TestGrid() {
  const { t } = useLanguage();

  const icons = {
    acuity: Eye,
    color: Palette,
    sensitivity: Zap,
    field: ScanLine,
    micro: Activity,
    games: Brain
  };

  const colors = {
    acuity: "text-blue-500 bg-blue-50 dark:bg-blue-900/20",
    color: "text-purple-500 bg-purple-50 dark:bg-purple-900/20",
    sensitivity: "text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20",
    field: "text-green-500 bg-green-50 dark:bg-green-900/20",
    micro: "text-red-500 bg-red-50 dark:bg-red-900/20",
    games: "text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
  };

  const testKeys = ['acuity', 'color', 'sensitivity', 'field', 'micro', 'games'] as const;

  return (
    <section id="tests" className="container py-8 md:py-12 lg:py-24 mx-auto px-4">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {testKeys.map((key) => {
          const Icon = icons[key];
          const colorClass = colors[key];
          const test = t.tests[key];
          
          return (
            <Link key={key} href={`/${key === 'acuity' ? 'acuity' : key === 'color' ? 'color-blindness' : key === 'games' ? 'games' : key === 'sensitivity' ? 'sensitivity' : key === 'field' ? 'field' : 'micro-perimetry'}`} className="group relative overflow-hidden rounded-2xl border bg-background p-6 hover:shadow-md transition-all hover:-translate-y-1 border-gray-200 dark:border-gray-800 dark:bg-gray-900/50">
              <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${colorClass} transition-colors`}>
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-bold text-xl text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {test.title}
              </h3>
              <p className="text-muted-foreground text-gray-600 dark:text-gray-400">
                {test.description}
              </p>
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-transparent via-transparent to-blue-50/50 opacity-0 transition-opacity group-hover:opacity-100 dark:to-blue-900/10" />
            </Link>
          )
        })}
      </div>
      
      <div className="mt-24 rounded-3xl bg-slate-50 p-8 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 text-center">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          {t.disclaimer.title}
        </h3>
        <p className="text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
          {t.disclaimer.text}
        </p>
      </div>

      <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-500">
        {t.footer.copyright}
      </footer>
    </section>
  )
}
