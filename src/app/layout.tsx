import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from 'next/link';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Capital Voting",
  description: "People vote with their dollars. Choose a side. Wear your vote. Fund the winner.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col antialiased`}>
        <header className="sticky top-0 z-50 glass-panel border-b border-[var(--border)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-8">
                <Link href="/" className="font-extrabold text-2xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                  Capital Voting
                </Link>
                <nav className="hidden md:flex space-x-6">
                  <Link href="/campaigns" className="text-sm font-medium hover:text-blue-600 transition-colors">Campaigns</Link>
                  <Link href="/about" className="text-sm font-medium hover:text-blue-600 transition-colors">How it Works</Link>
                </nav>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/cart" className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  {/* Cart badge would go here */}
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-grow flex flex-col">
          {children}
        </main>

        <footer className="bg-[var(--surface)] border-t border-[var(--border)] py-12 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <h3 className="font-bold text-lg mb-4">Capital Voting</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                  A commerce-based participatory funding platform. 
                  Every vote is connected to a completed financial transaction.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-4 uppercase tracking-wider text-gray-500">Legal</h4>
                <ul className="space-y-2">
                  <li><Link href="/privacy" className="text-sm hover:text-blue-600">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="text-sm hover:text-blue-600">Terms of Use</Link></li>
                  <li><Link href="/refunds" className="text-sm hover:text-blue-600">Refund Policy</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-4 uppercase tracking-wider text-gray-500">Transparency</h4>
                <ul className="space-y-2">
                  <li><Link href="/transparency" className="text-sm hover:text-blue-600">Financial Policy</Link></li>
                  <li><Link href="/rules" className="text-sm hover:text-blue-600">Campaign Rules</Link></li>
                </ul>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-[var(--border)] text-sm text-gray-500 flex justify-between items-center">
              <p>&copy; {new Date().getFullYear()} Capital Voting. All rights reserved.</p>
              <Link href="/admin" className="hover:text-blue-600">Admin Login</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
