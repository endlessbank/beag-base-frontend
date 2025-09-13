'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { LogOut, User } from 'lucide-react'

export default function Header() {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    // Hide header on login page, dashboard pages, and billing page (they have their own sidebar with logout)
    if (pathname === '/login' || pathname?.startsWith('/dashboard') || pathname === '/billing') {
      setIsVisible(false)
      return
    }
    
    setIsVisible(true)
    
    // Get user email from localStorage
    const email = localStorage.getItem('x_email')
    setUserEmail(email)
  }, [pathname])

  const handleLogout = () => {
    // Remove specific Beag items from localStorage
    localStorage.removeItem("x_access_token")
    localStorage.removeItem("x_email")
    localStorage.removeItem("x_plan_id")
    localStorage.removeItem("x_start_date")
    localStorage.removeItem("x_end_date")
    localStorage.removeItem("x_status")
    
    // Perform a hard refresh (bypassing the cache)
    window.location.reload()
  }

  // Don't render header on login page
  if (!isVisible) {
    return null
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* App Name */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-semibold text-gray-900">
              {process.env.NEXT_PUBLIC_APP_NAME || 'My SaaS App'}
            </h1>
          </div>

          {/* User Info and Logout */}
          <div className="flex items-center space-x-4">
            {userEmail && (
              <div className="flex items-center space-x-2 text-sm text-gray-700">
                <User className="h-4 w-4" />
                <span>{userEmail}</span>
              </div>
            )}
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}