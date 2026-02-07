import { getAdminSession } from '@/lib/admin-auth'
import Link from 'next/link'
import { LogOut, LayoutDashboard } from 'lucide-react'
import { logout } from './actions'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getAdminSession()

  return (
    <div className="min-h-screen bg-gray-50">
      {session && (
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
            <Link
              href="/admin"
              className="font-serif text-xl font-semibold text-primary flex items-center gap-2 hover:text-primary/90 transition-colors"
            >
              <span className="text-secondary">EBOMI</span>
              <span className="text-gray-400">/</span>
              <span>Admin</span>
            </Link>
            <nav className="flex items-center gap-4">
              <Link
                href="/admin"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Log out
                </button>
              </form>
            </nav>
          </div>
        </header>
      )}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">{children}</main>
    </div>
  )
}
