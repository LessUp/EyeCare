"use client"

import * as React from "react"
import { Languages } from "lucide-react"
import { useLanguage } from "@/components/providers/language-provider"
import { Button } from "@/components/ui/button"

export function LanguageToggle() {
  const { locale, setLocale } = useLanguage()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLocale(locale === "zh" ? "en" : "zh")}
      className="w-[60px]"
      title="Switch language"
    >
      <Languages className="mr-2 h-4 w-4" />
      {locale === "zh" ? "EN" : "中"}
    </Button>
  )
}
