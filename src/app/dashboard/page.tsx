'use client'

import { useEffect, useState } from 'react'
import { 
  User, 
  Code, 
  CheckCircle, 
  Clock, 
  CreditCard, 
  Settings, 
  Zap,
  Copy,
  ExternalLink,
  BookOpen,
  Rocket,
  Shield,
  Database
} from 'lucide-react'
import SubscriptionStatus from '@/components/Subscription/StatusBadge'

interface BeagUserData {
  accessToken: string | null
  email: string | null
  planId: string | null
  startDate: string | null
  endDate: string | null
  status: string | null
}

interface SetupStatus {
  backend: {
    configured: boolean
    progress: number
    environment_variables: Record<string, boolean>
  }
  database: {
    connected: boolean
    progress: number
  }
  overall_progress: number
}

export default function DashboardPage() {
  const [userData, setUserData] = useState<BeagUserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'user' | 'developer'>('user')
  const [copiedText, setCopiedText] = useState<string | null>(null)
  const [setupStatus, setSetupStatus] = useState<SetupStatus | null>(null)

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
    fetchSetupStatus()
  }, [])

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(label)
      setTimeout(() => setCopiedText(null), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleDateString()
    } catch {
      return dateString
    }
  }

  const getPlanName = (planId: string | null) => {
    if (!planId) return 'Free'
    
    // Map common numeric plan IDs to friendly names
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

  const fetchSetupStatus = async () => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'
      const response = await fetch(`${backendUrl}/api/health/setup-status`)
      if (response.ok) {
        const status = await response.json()
        setSetupStatus(status)
      }
    } catch (error) {
      console.error('Failed to fetch setup status:', error)
    }
  }

  const getSetupProgress = () => {
    const checks = [
      { 
        name: 'Frontend Authentication', 
        completed: !!userData?.email,
        description: 'User successfully logged in'
      },
      { 
        name: 'Beag Script Integration', 
        completed: window.BEAG_DEV_MODE || !!userData?.accessToken,
        description: 'Beag.js script loaded and functional'
      },
      { 
        name: 'Backend Configuration', 
        completed: setupStatus?.backend?.configured || false,
        description: 'Backend environment variables configured'
      },
      { 
        name: 'Database Connection', 
        completed: setupStatus?.database?.connected || false,
        description: 'Database connected and accessible'
      },
      { 
        name: 'Active Subscription', 
        completed: userData?.status === 'PAID' || userData?.status === 'RESUMED',
        description: 'User has active subscription'
      }
    ]
    const completed = checks.filter(c => c.completed).length
    const progress = setupStatus?.overall_progress || (completed / checks.length) * 100
    return { checks, progress: Math.max(progress, (completed / checks.length) * 100) }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  const { checks, progress } = getSetupProgress()
  const isActive = userData?.status === 'PAID' || userData?.status === 'RESUMED'

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header with Toggle */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome to your SaaS Dashboard
            </h1>
            <p className="mt-2 text-gray-600">
              {userData?.email && `Hello ${userData.email.split('@')[0]}! `}
              Your Beag.io boilerplate is ready to customize.
            </p>
          </div>
          
          {/* View Toggle */}
          <div className="mt-4 sm:mt-0 bg-gray-100 p-1 rounded-lg flex">
            <button
              onClick={() => setViewMode('user')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'user' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <User className="h-4 w-4 inline mr-2" />
              User View
            </button>
            <button
              onClick={() => setViewMode('developer')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'developer' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Code className="h-4 w-4 inline mr-2" />
              Developer View
            </button>
          </div>
        </div>
      </div>

      {/* User View */}
      {viewMode === 'user' && (
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Your SaaS is Ready!</h2>
                <p className="text-indigo-100 mb-4">
                  This boilerplate includes authentication, subscription management, and a complete foundation for your SaaS application.
                </p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    <span className="text-sm">Secure Authentication</span>
                  </div>
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    <span className="text-sm">Stripe Integration</span>
                  </div>
                  <div className="flex items-center">
                    <Zap className="h-5 w-5 mr-2" />
                    <span className="text-sm">Ready to Deploy</span>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <Rocket className="h-20 w-20 text-indigo-200" />
              </div>
            </div>
          </div>

          {/* Setup Progress */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Setup Progress</h3>
              <span className="text-sm font-medium text-indigo-600">{Math.round(progress)}% Complete</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {checks.map((check, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 mt-0.5">
                    {check.completed ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Clock className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${check.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                      {check.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {check.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Account Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  <p className="text-sm font-medium text-gray-600">Plan</p>
                  <p className="text-base font-semibold text-gray-900 mt-1">
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
                  <p className="text-sm font-medium text-gray-600">Account</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1 truncate">
                    {userData?.email || 'Not set'}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <User className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Valid Until</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    {formatDate(userData?.endDate)}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Next Steps</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-indigo-600 font-semibold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Customize Your App</h4>
                    <p className="text-sm text-gray-600 mt-1">Add your branding, features, and content to make it yours.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-indigo-600 font-semibold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Configure Stripe</h4>
                    <p className="text-sm text-gray-600 mt-1">Set up your customer portal and payment processing.</p>
                    <a href="/billing" className="text-indigo-600 hover:text-indigo-500 text-sm font-medium inline-flex items-center mt-1">
                      Go to Billing <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-indigo-600 font-semibold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Deploy Your SaaS</h4>
                    <p className="text-sm text-gray-600 mt-1">Deploy to production with platforms like Vercel, Railway, or Render.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-indigo-600 font-semibold text-sm">4</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Switch to Developer View</h4>
                    <p className="text-sm text-gray-600 mt-1">See technical instructions and code examples.</p>
                    <button 
                      onClick={() => setViewMode('developer')}
                      className="text-indigo-600 hover:text-indigo-500 text-sm font-medium inline-flex items-center mt-1"
                    >
                      View Developer Docs <Code className="h-3 w-3 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Developer View */}
      {viewMode === 'developer' && (
        <div className="space-y-8">
          {/* Technical Overview */}
          <div className="bg-gray-900 rounded-xl p-8 text-white">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Developer Documentation</h2>
                <p className="text-gray-300">
                  Technical guide for implementing features with Beag.io localStorage data
                </p>
              </div>
              <Database className="h-12 w-12 text-gray-400" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-green-400" />
                <span className="text-sm">Authentication Ready</span>
              </div>
              <div className="flex items-center space-x-3">
                <Database className="h-5 w-5 text-blue-400" />
                <span className="text-sm">localStorage Integration</span>
              </div>
              <div className="flex items-center space-x-3">
                <Zap className="h-5 w-5 text-yellow-400" />
                <span className="text-sm">Real-time Data</span>
              </div>
            </div>
          </div>

          {/* localStorage Data Reference */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Available localStorage Variables</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Variables & Types</h4>
                <div className="space-y-3">
                  {[
                    { key: 'x_access_token', desc: 'Authentication token', value: userData?.accessToken ? 'Set' : 'Not set' },
                    { key: 'x_email', desc: 'User email address', value: userData?.email || 'Not set' },
                    { key: 'x_plan_id', desc: 'Subscription plan ID', value: userData?.planId || 'Not set' }
                  ].map((item) => (
                    <div key={item.key} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <code className="text-sm font-mono text-indigo-600">{item.key}</code>
                        <p className="text-xs text-gray-600">{item.desc}</p>
                      </div>
                      <span className="text-xs text-gray-500 font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-4">Date & Status</h4>
                <div className="space-y-3">
                  {[
                    { key: 'x_start_date', desc: 'Subscription start date', value: userData?.startDate || 'Not set' },
                    { key: 'x_end_date', desc: 'Subscription end date', value: userData?.endDate || 'Not set' },
                    { key: 'x_status', desc: 'Current status', value: userData?.status || 'Not set' }
                  ].map((item) => (
                    <div key={item.key} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <code className="text-sm font-mono text-indigo-600">{item.key}</code>
                        <p className="text-xs text-gray-600">{item.desc}</p>
                      </div>
                      <span className="text-xs text-gray-500 font-medium truncate max-w-24">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Code Examples */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Implementation Examples</h3>
            
            <div className="space-y-6">
              {/* Feature Gating Example */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Feature Gating by Subscription Status</h4>
                <div className="bg-gray-900 rounded-lg p-4 relative">
                  <button
                    onClick={() => copyToClipboard(`// Feature gating by subscription status
const isActive = localStorage.getItem('x_status') === 'PAID'

{isActive ? (
  <PremiumFeatureComponent />
) : (
  <SubscriptionRequiredMessage />
)}`, 'feature-gating')}
                    className="absolute top-3 right-3 p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    {copiedText === 'feature-gating' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                  <pre className="text-sm text-gray-300 overflow-x-auto">
                    <code>{`// Feature gating by subscription status
const isActive = localStorage.getItem('x_status') === 'PAID'

{isActive ? (
  <PremiumFeatureComponent />
) : (
  <SubscriptionRequiredMessage />
)}`}</code>
                  </pre>
                </div>
              </div>

              {/* Plan-based Features */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Plan-based Feature Access</h4>
                <div className="bg-gray-900 rounded-lg p-4 relative">
                  <button
                    onClick={() => copyToClipboard(`// Show features based on plan ID
const planId = localStorage.getItem('x_plan_id')

{planId === '3' && <AdvancedAnalytics />}
{planId === '2' && <TeamFeatures />}
{planId === '1' && <BasicFeatures />}`, 'plan-features')}
                    className="absolute top-3 right-3 p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    {copiedText === 'plan-features' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                  <pre className="text-sm text-gray-300 overflow-x-auto">
                    <code>{`// Show features based on plan ID
const planId = localStorage.getItem('x_plan_id')

{planId === '3' && <AdvancedAnalytics />}
{planId === '2' && <TeamFeatures />}
{planId === '1' && <BasicFeatures />}`}</code>
                  </pre>
                </div>
              </div>

              {/* API Authentication */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Authenticated API Calls</h4>
                <div className="bg-gray-900 rounded-lg p-4 relative">
                  <button
                    onClick={() => copyToClipboard(`// Make authenticated API requests
const accessToken = localStorage.getItem('x_access_token')

const response = await fetch('/api/protected-endpoint', {
  headers: {
    'Authorization': \`Bearer \${accessToken}\`,
    'Content-Type': 'application/json'
  }
})`, 'api-auth')}
                    className="absolute top-3 right-3 p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    {copiedText === 'api-auth' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                  <pre className="text-sm text-gray-300 overflow-x-auto">
                    <code>{`// Make authenticated API requests
const accessToken = localStorage.getItem('x_access_token')

const response = await fetch('/api/protected-endpoint', {
  headers: {
    'Authorization': \`Bearer \${accessToken}\`,
    'Content-Type': 'application/json'
  }
})`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => copyToClipboard('localStorage.getItem("x_email")', 'get-email')}
                className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors text-left"
              >
                <div className="flex items-center justify-between mb-2">
                  <User className="h-5 w-5 text-gray-400" />
                  {copiedText === 'get-email' ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-gray-400" />}
                </div>
                <p className="text-sm font-medium text-gray-900">Get Email</p>
                <code className="text-xs text-gray-500">x_email</code>
              </button>

              <button
                onClick={() => copyToClipboard('localStorage.getItem("x_status")', 'get-status')}
                className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors text-left"
              >
                <div className="flex items-center justify-between mb-2">
                  <Shield className="h-5 w-5 text-gray-400" />
                  {copiedText === 'get-status' ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-gray-400" />}
                </div>
                <p className="text-sm font-medium text-gray-900">Get Status</p>
                <code className="text-xs text-gray-500">x_status</code>
              </button>

              <button
                onClick={() => copyToClipboard('localStorage.getItem("x_plan_id")', 'get-plan')}
                className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors text-left"
              >
                <div className="flex items-center justify-between mb-2">
                  <CreditCard className="h-5 w-5 text-gray-400" />
                  {copiedText === 'get-plan' ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-gray-400" />}
                </div>
                <p className="text-sm font-medium text-gray-900">Get Plan ID</p>
                <code className="text-xs text-gray-500">x_plan_id</code>
              </button>

              <button
                onClick={() => copyToClipboard('localStorage.getItem("x_access_token")', 'get-token')}
                className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors text-left"
              >
                <div className="flex items-center justify-between mb-2">
                  <Database className="h-5 w-5 text-gray-400" />
                  {copiedText === 'get-token' ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-gray-400" />}
                </div>
                <p className="text-sm font-medium text-gray-900">Get Token</p>
                <code className="text-xs text-gray-500">x_access_token</code>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}