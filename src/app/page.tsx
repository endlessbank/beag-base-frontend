'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/api-client'

export default function Home() {
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAndCreateUser = async () => {
      // Get user email from localStorage (set by Beag after login)
      const email = localStorage.getItem('x_email')
      
      if (email) {
        // Check if we've already created this user in this session
        const userCreatedKey = `user_created_${email}`
        const userAlreadyCreated = sessionStorage.getItem(userCreatedKey)
        
        if (!userAlreadyCreated) {
          try {
            // Try to get existing user first
            await apiClient.getUserByEmail(email)
            console.log('User exists in backend:', email)
          } catch (error: any) {
            // If user doesn't exist, create them
            if (error.response?.status === 404) {
              // Small delay to let sync service potentially create the user first
              await new Promise(resolve => setTimeout(resolve, 1000))
              
              // Check again if user was created by sync service
              try {
                await apiClient.getUserByEmail(email)
                console.log('User was created by sync service:', email)
              } catch (retryError: any) {
                if (retryError.response?.status === 404) {
                  // Still doesn't exist, create it
                  try {
                    const newUser = await apiClient.createUser(email)
                    console.log('User created/synced in backend:', email, newUser)
                  } catch (createError: any) {
                    console.error('Failed to create user:', createError)
                  }
                }
              }
            }
          }
          
          // Mark user as created/checked for this session
          sessionStorage.setItem(userCreatedKey, 'true')
        }
      }
      
      // Always redirect to dashboard
      setIsChecking(false)
      window.location.href = '/dashboard'
    }

    checkAndCreateUser()
  }, [])

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-gray-500">
        {isChecking ? 'Initializing...' : 'Redirecting to dashboard...'}
      </div>
    </div>
  )
}