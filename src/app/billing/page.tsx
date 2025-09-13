'use client'

import { useEffect, useState } from 'react'
import { 
  ExternalLink, 
  CreditCard, 
  FileText, 
  AlertCircle, 
  User,
  Calendar,
  Shield,
  DollarSign,
  Download
} from 'lucide-react'
import SubscriptionStatus from '@/components/Subscription/StatusBadge'
import AppLayout from '@/components/Layout/AppLayout'

interface BeagUserData {
  accessToken: string | null
  email: string | null
  planId: string | null
  startDate: string | null
  endDate: string | null
  status: string | null
}

export default function BillingPage() {
  const [userData, setUserData] = useState<BeagUserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUserData = () => {
      try {
        const accessToken = localStorage.getItem("x_access_token")
        const email = localStorage.getItem("x_email")
        const planId = localStorage.getItem("x_plan_id")
        const startDate = localStorage.getItem("x_start_date")
        const endDate = localStorage.getItem("x_end_date")
        const status = localStorage.getItem("x_status")

        if (!email) {
          window.location.href = '/login'
          return
        }

        setUserData({
          accessToken,
          email,
          planId,
          startDate,
          endDate,
          status
        })
      } catch (error) {
        console.error('Error loading user data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [])

  const handleManageSubscription = () => {
    const stripePortalUrl = process.env.NEXT_PUBLIC_STRIPE_PORTAL_URL || '#'
    
    if (stripePortalUrl === '#') {
      alert('Please configure your Stripe Customer Portal URL in the environment variables')
      return
    }
    
    window.open(stripePortalUrl, '_blank')
  }

  const getPlanName = (planId: string | null) => {
    if (!planId) return 'Free'
    
    const planMapping: Record<string, string> = {
      '1': 'Basic Plan',
      '2': 'Pro Plan', 
      '3': 'Premium Plan',
      '4': 'Enterprise Plan',
      '5': 'Starter Plan',
      '10': 'Monthly Basic',
      '11': 'Monthly Pro',
      '12': 'Monthly Premium',
      '20': 'Annual Basic',
      '21': 'Annual Pro',
      '22': 'Annual Premium',
      '100': 'Trial Plan',
      '999': 'Lifetime Plan'
    }

    return planMapping[planId] || `Plan ${planId}`
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleDateString()
    } catch {
      return dateString
    }
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-500">Loading...</div>
        </div>
      </AppLayout>
    )
  }

  const isActive = userData?.status === 'PAID' || userData?.status === 'RESUMED'

  return (
    <AppLayout>
      <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Billing & Subscription</h1>
              <p className="mt-2 text-gray-600">
                Manage your subscription, billing information, and payment methods
              </p>
            </div>

            {/* Current Subscription Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Current Plan</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {userData?.planId || 'Free'}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <CreditCard className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Status</p>
                    <div className="mt-2">
                      <SubscriptionStatus status={userData?.status || 'NO_SUBSCRIPTION'} />
                    </div>
                  </div>
                  <div className={`p-3 rounded-full ${isActive ? 'bg-green-100' : 'bg-gray-100'}`}>
                    <Shield className={`h-6 w-6 ${isActive ? 'text-green-600' : 'text-gray-400'}`} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Next Billing</p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {formatDate(userData?.endDate || null)}
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <Calendar className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Main Billing Management */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-8 text-white mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Manage Your Subscription</h2>
                  <p className="text-indigo-100 mb-6">
                    Access the Stripe Customer Portal to manage your subscription, update payment methods, download invoices, and more.
                  </p>
                  
                  {userData?.email && (
                    <div className="mb-6 p-4 bg-white/10 backdrop-blur rounded-lg">
                      <p className="text-indigo-100">
                        <span className="font-medium text-white">Account:</span> {userData.email}
                      </p>
                    </div>
                  )}

                  <button
                    onClick={handleManageSubscription}
                    className="inline-flex items-center px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                  >
                    <ExternalLink className="h-5 w-5 mr-2" />
                    Open Stripe Customer Portal
                  </button>
                </div>
                <div className="hidden md:block">
                  <CreditCard className="h-20 w-20 text-indigo-200" />
                </div>
              </div>
            </div>

            {/* Available Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">What You Can Do</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Payment Methods</h4>
                    <p className="text-sm text-gray-600 mt-1">Update credit cards, add new payment methods, and set default options</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Download className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Invoices & Receipts</h4>
                    <p className="text-sm text-gray-600 mt-1">Download past invoices, receipts, and billing history</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Billing Information</h4>
                    <p className="text-sm text-gray-600 mt-1">Update billing address, tax information, and contact details</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Cancel or Pause</h4>
                    <p className="text-sm text-gray-600 mt-1">Cancel your subscription or pause billing temporarily</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Billing Cycle</h4>
                    <p className="text-sm text-gray-600 mt-1">View upcoming charges and modify billing frequency</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Setup Instructions for Developers */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <FileText className="h-6 w-6 text-gray-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">
                    Setup Instructions for Developers
                  </h3>
                  <div className="text-sm text-gray-600 space-y-4">
                    <p>
                      To enable the Stripe Customer Portal for your users:
                    </p>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <ol className="list-decimal list-inside space-y-3">
                        <li>
                          Read the{' '}
                          <a 
                            href="https://docs.stripe.com/customer-management" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-500 underline font-medium"
                          >
                            Stripe Customer Portal documentation
                          </a>
                        </li>
                        <li>Enable Customer Portal in your Stripe Dashboard</li>
                        <li>Configure portal settings (plans, features, branding)</li>
                        <li>Generate a portal session URL for your customers</li>
                        <li className="space-y-2">
                          <span>Add the portal URL to your environment variables:</span>
                          <div className="bg-gray-900 text-gray-100 p-3 rounded-md font-mono text-xs">
                            NEXT_PUBLIC_STRIPE_PORTAL_URL=your_portal_url_here
                          </div>
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </div>
      </div>
    </AppLayout>
  )
}