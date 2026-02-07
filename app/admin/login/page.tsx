import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/admin-auth'
import AdminLoginForm from './AdminLoginForm'
import Link from 'next/link'

export default async function AdminLoginPage() {
  const session = await getAdminSession()
  if (session) redirect('/admin')

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="font-serif text-2xl font-semibold text-primary inline-block mb-1">
            EBOMI Suites
          </Link>
          <p className="text-sm text-gray-500">Admin portal</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg shadow-gray-200/50 p-8">
          <h1 className="font-serif text-xl text-gray-900 mb-1">Sign in</h1>
          <p className="text-sm text-gray-600 mb-6">Enter the admin password to manage bookings.</p>
          <AdminLoginForm />
        </div>
        <p className="text-center text-xs text-gray-400 mt-6">
          Authorized personnel only.
        </p>
      </div>
    </div>
  )
}
