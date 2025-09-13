'use client'

import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [showOtpForm, setShowOtpForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [otpError, setOtpError] = useState('')

  // Replace with your actual Beag ID
  const BEAG_ID = process.env.NEXT_PUBLIC_BEAG_ID || 'YOUR_BEAG_ID'

  const sendOTP = async () => {
    if (!email.trim()) {
      setEmailError('Please enter your email')
      return
    }

    setEmailError('')
    setIsLoading(true)

    try {
      const response = await fetch('https://my-saas-basic-api-d5e3hpgdf0gnh2em.eastus-01.azurewebsites.net/auth/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          my_saas_id: BEAG_ID,
          email: email.trim()
        })
      })

      const result = await response.json()

      if (result.status === 'success') {
        // Show OTP form
        setShowOtpForm(true)
        setEmailError('')
      } else {
        // Show error message
        setEmailError(result.message || 'Failed to send verification code')
      }
    } catch (error) {
      console.error('Error:', error)
      setEmailError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const verifyOTP = async () => {
    if (!otp.trim()) {
      setOtpError('Please enter the verification code')
      return
    }

    setOtpError('')
    setIsLoading(true)

    try {
      const response = await fetch('https://my-saas-basic-api-d5e3hpgdf0gnh2em.eastus-01.azurewebsites.net/auth/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          my_saas_id: BEAG_ID,
          email: email.trim(),
          otp: otp.trim()
        })
      })

      const result = await response.json()

      if (result.status === 'success') {
        // Store authentication data in localStorage
        const { token_data } = result
        
        console.log('Login successful! Token data received:', token_data)

        // Save all token data to localStorage
        Object.keys(token_data).forEach(key => {
          localStorage.setItem(key, token_data[key])
          console.log(`Stored ${key}:`, token_data[key])
        })

        console.log('All tokens stored, redirecting to home page...')
        
        // Redirect back to the app
        window.location.href = '/'
      } else {
        // Show error message
        setOtpError(result.message || 'Invalid verification code')
      }
    } catch (error) {
      console.error('Error:', error)
      setOtpError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendOTP()
  }

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    verifyOTP()
  }

  const goBackToEmail = () => {
    setShowOtpForm(false)
    setOtp('')
    setOtpError('')
  }

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          {showOtpForm ? 'Verify Your Email' : 'Sign in to your account'}
        </h2>
        {showOtpForm && (
          <p className="mt-2 text-center text-sm text-gray-600">
            We sent a verification code to <span className="font-medium">{email}</span>
          </p>
        )}
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {!showOtpForm ? (
          // Email form
          <form className="space-y-6" onSubmit={handleEmailSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Enter your email"
                />
              </div>
              {emailError && (
                <p className="mt-2 text-sm text-red-600">{emailError}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending...' : 'Send Verification Code'}
              </button>
            </div>
          </form>
        ) : (
          // OTP form
          <form className="space-y-6" onSubmit={handleOtpSubmit}>
            <div>
              <label htmlFor="otp" className="block text-sm font-medium leading-6 text-gray-900">
                Verification Code
              </label>
              <div className="mt-2">
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  autoComplete="one-time-code"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.toUpperCase())}
                  className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center font-mono text-lg tracking-widest"
                  placeholder="ABC123"
                  maxLength={6}
                />
              </div>
              {otpError && (
                <p className="mt-2 text-sm text-red-600">{otpError}</p>
              )}
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Verifying...' : 'Verify & Sign In'}
              </button>
              
              <button
                type="button"
                onClick={goBackToEmail}
                className="flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-gray-600 hover:text-gray-800"
              >
                ← Back to email
              </button>
              
              <button
                type="button"
                onClick={sendOTP}
                disabled={isLoading}
                className="flex w-full justify-center text-sm text-indigo-600 hover:text-indigo-500 disabled:opacity-50"
              >
                Resend verification code
              </button>
            </div>
          </form>
        )}

        <p className="mt-10 text-center text-sm text-gray-500">
          Secure authentication powered by{' '}
          <a href="https://beag.io" className="font-medium text-indigo-600 hover:text-indigo-500">
            Beag.io
          </a>
        </p>
      </div>
    </div>
  )
}