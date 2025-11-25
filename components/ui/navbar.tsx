"use client"

import Link from "next/link"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { LanguageToggle } from "@/components/ui/lang-toggle"
import { useLanguage } from "@/components/providers/language-provider"
import { useAuth } from "@/components/providers/auth-provider"
import { User, BookOpen, Crown, Brain, Menu, X } from "lucide-react"
import { useState } from "react"

export function Navbar() {
  const { t, lang } = useLanguage();
  const { isAuthenticated, user, membershipStatus } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: t.nav.home },
    { href: '/games', label: lang === 'zh' ? '视觉训练' : 'Training' },
    { href: '/knowledge', label: lang === 'zh' ? '知识库' : 'Knowledge' },
    { href: '/about', label: t.nav.about },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-gray-950/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-gray-800">
      <div className="container flex h-16 items-center max-w-7xl mx-auto px-4">
        {/* Logo */}
        <Link href="/" className="mr-8 flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">👁️</span>
          </div>
          <span className="font-bold text-blue-600 dark:text-blue-400 text-xl hidden sm:inline-block">
            {t.nav.brand}
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm font-medium"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex flex-1 items-center justify-end space-x-2">
          <LanguageToggle />
          <ThemeToggle />
          
          {/* User Menu */}
          {isAuthenticated ? (
            <Link href="/user" className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                {user?.name?.charAt(0) || 'U'}
              </div>
              {membershipStatus.tier !== 'free' && (
                <Crown className="w-4 h-4 text-amber-500" />
              )}
            </Link>
          ) : (
            <Link 
              href="/user" 
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">{lang === 'zh' ? '登录' : 'Sign In'}</span>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 py-4">
          <div className="container mx-auto px-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
              >
                {link.label}
              </Link>
            ))}
            {!isAuthenticated && (
              <Link
                href="/user"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg bg-blue-600 text-white text-center font-medium"
              >
                {lang === 'zh' ? '登录 / 注册' : 'Sign In / Sign Up'}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
