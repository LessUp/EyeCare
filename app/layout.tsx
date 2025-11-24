import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Advanced Eye Care Testing",
  description: "Comprehensive online vision testing suite",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-gray-50">
        <nav className="bg-white border-b p-4 flex justify-between items-center shadow-sm">
          <div className="font-bold text-xl text-blue-600">EyeCare Pro</div>
          <div className="space-x-4 text-sm text-gray-600">
            <a href="/" className="hover:text-blue-600">Home</a>
            <a href="/about" className="hover:text-blue-600">About</a>
          </div>
        </nav>
        <main className="container mx-auto p-4">
            {children}
        </main>
      </body>
    </html>
  );
}
