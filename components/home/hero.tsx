"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/providers/language-provider"
import Link from "next/link"

export function Hero() {
  const { t } = useLanguage();

  return (
    <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
      <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center mx-auto px-4">
        <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white tracking-tight">
          {t.hero.title}
        </h1>
        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8 text-gray-600 dark:text-gray-400">
          {t.hero.subtitle}
        </p>
        <div className="space-x-4">
          <Link href="#tests">
            <Button size="lg" className="rounded-full px-8 shadow-lg hover:shadow-xl transition-all">
              {t.hero.start}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
