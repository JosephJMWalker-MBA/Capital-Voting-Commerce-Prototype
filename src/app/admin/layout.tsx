import Link from 'next/link'
import { getCurrentAdmin } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let admin;
  try {
    admin = await getCurrentAdmin()
  } catch (e) {
    // Basic catch to handle no DB setup yet or missing seed
    admin = { name: 'Demo Admin' } 
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center space-x-6">
          <Link href="/admin" className="font-bold text-xl tracking-tight text-blue-600">
            Capital Voting
          </Link>
          <nav className="space-x-4 hidden md:block">
            <Link href="/admin" className="text-gray-600 hover:text-gray-900 font-medium">Dashboard</Link>
            <Link href="/admin/campaigns" className="text-gray-600 hover:text-gray-900 font-medium">Campaigns</Link>
            <Link href="/admin/orders" className="text-gray-600 hover:text-gray-900 font-medium">Orders</Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700 bg-gray-100 py-1 px-3 rounded-full">
            {admin.name} (Admin)
          </span>
        </div>
      </header>
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  )
}
