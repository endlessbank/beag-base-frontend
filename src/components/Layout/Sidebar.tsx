'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  Users, 
  Settings, 
  CreditCard,
  LogOut 
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Billing', href: '/billing', icon: CreditCard },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col bg-gray-900">
      {/* Logo */}
      <div className="flex h-16 items-center px-6">
        <h2 className="text-xl font-semibold text-white">
          {process.env.NEXT_PUBLIC_APP_NAME}
        </h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
              )}
            >
              <item.icon
                className={cn(
                  isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-300',
                  'mr-3 h-5 w-5 flex-shrink-0'
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-gray-700 p-4">
        <button
          className="flex w-full items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
          onClick={() => {
            // Remove specific Beag items from localStorage
            localStorage.removeItem("x_access_token")
            localStorage.removeItem("x_email")
            localStorage.removeItem("x_plan_id")
            localStorage.removeItem("x_start_date")
            localStorage.removeItem("x_end_date")
            localStorage.removeItem("x_status")
            
            // Perform a hard refresh (bypassing the cache)
            window.location.reload()
          }}
        >
          <LogOut className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400" />
          Logout
        </button>
      </div>
    </div>
  )
}