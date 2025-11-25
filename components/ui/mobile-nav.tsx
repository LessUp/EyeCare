"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Gamepad2, BookOpen, User, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/components/providers/language-provider';

export function MobileNav() {
  const pathname = usePathname();
  const { lang } = useLanguage();

  const navItems = [
    { href: '/', icon: Home, label: lang === 'zh' ? '首页' : 'Home' },
    { href: '/games', icon: Gamepad2, label: lang === 'zh' ? '训练' : 'Train' },
    { href: '/knowledge', icon: BookOpen, label: lang === 'zh' ? '知识' : 'Learn' },
    { href: '/progress', icon: TrendingUp, label: lang === 'zh' ? '进度' : 'Progress' },
    { href: '/user', icon: User, label: lang === 'zh' ? '我的' : 'Me' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 safe-area-pb">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/' && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 py-2 transition-colors ${
                isActive 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <item.icon className={`w-5 h-5 mb-1 ${isActive ? 'stroke-[2.5px]' : ''}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
