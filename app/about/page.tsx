"use client"

import { CheckCircle } from 'lucide-react';
import { useLanguage } from '@/components/providers/language-provider';

export default function About() {
  const { t } = useLanguage();

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">{t.about.title}</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
        {t.about.description}
      </p>

      <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">{t.about.ourTests}</h2>
      <ul className="space-y-6 mb-10">
        {t.about.tests.map((test: { label: string; text: string }, index: number) => (
          <li key={index} className="flex gap-4 items-start">
            <CheckCircle className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1 h-6 w-6" />
            <div>
              <strong className="text-gray-900 dark:text-gray-200 block mb-1">{test.label}</strong>
              <span className="text-gray-600 dark:text-gray-400">{test.text}</span>
            </div>
          </li>
        ))}
      </ul>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-xl border border-yellow-200 dark:border-yellow-900/50">
        <h3 className="font-bold text-yellow-900 dark:text-yellow-500 mb-2">{t.about.disclaimerTitle}</h3>
        <p className="text-yellow-800 dark:text-yellow-400/80 text-sm leading-relaxed">
          {t.about.disclaimerText}
        </p>
      </div>
    </div>
  );
}
