import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { LanguageProvider } from "@/components/providers/language-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { Navbar } from "@/components/ui/navbar";

export const metadata: Metadata = {
  title: "EyeCare Pro - 专业视力健康管理平台",
  description: "基于最新眼科研究的视力测试、视觉训练和AI健康分析平台 | Professional vision testing, training and AI health analysis platform",
  keywords: ["视力测试", "眼健康", "视觉训练", "Gabor", "MOT", "AI分析", "eye care", "vision training"],
  authors: [{ name: "EyeCare Pro Team" }],
  openGraph: {
    title: "EyeCare Pro - 专业视力健康管理",
    description: "科学护眼，AI助力 - 基于最新研究的视力训练平台",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-background text-foreground selection:bg-blue-100 dark:selection:bg-blue-900">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <AuthProvider>
              <div className="relative flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1">
                  {children}
                </main>
              </div>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
