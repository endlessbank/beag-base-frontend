'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/api-client'

export default function Home() {
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAndCreateUser = async () => {
      console.log('🔍 [DEBUG] Home page checkAndCreateUser function started')
      
      // Debug: Show all localStorage values
      console.log('🔍 [DEBUG] All localStorage values:', {
        x_access_token: localStorage.getItem('x_access_token'),
        x_email: localStorage.getItem('x_email'),
        x_plan_id: localStorage.getItem('x_plan_id'),
        x_status: localStorage.getItem('x_status'),
        x_start_date: localStorage.getItem('x_start_date'),
        x_end_date: localStorage.getItem('x_end_date')
      })
      
      // Get user email from localStorage (set by Beag after login)
      const email = localStorage.getItem('x_email')
      
      console.log('🔍 [DEBUG] Email from localStorage:', email)
      
      if (email) {
        // Check if we've already created this user in this session
        const userCreatedKey = `user_created_${email}`
        const userAlreadyCreated = sessionStorage.getItem(userCreatedKey)
        
        console.log('🔍 [DEBUG] SessionStorage check:', {
          userCreatedKey,
          userAlreadyCreated,
          willSkip: !!userAlreadyCreated
        })
        
        if (!userAlreadyCreated) {
          console.log('🔍 [DEBUG] User not marked as created, proceeding with creation flow...')
          
          try {
            console.log('🔍 [DEBUG] Attempting to get existing user by email:', email)
            // Try to get existing user first
            const existingUser = await apiClient.getUserByEmail(email)
            console.log('✅ [DEBUG] User exists in backend:', email, existingUser)
          } catch (error: any) {
            console.log('🔍 [DEBUG] getUserByEmail failed:', {
              status: error.response?.status,
              statusText: error.response?.statusText,
              data: error.response?.data,
              message: error.message
            })
            
            // If user doesn't exist, create them
            if (error.response?.status === 404) {
              console.log('🔍 [DEBUG] User not found (404), proceeding with creation...')
              
              // Small delay to let sync service potentially create the user first
              console.log('🔍 [DEBUG] Waiting 1 second for potential sync service creation...')
              await new Promise(resolve => setTimeout(resolve, 1000))
              
              // Check again if user was created by sync service
              try {
                console.log('🔍 [DEBUG] Retry: Attempting to get user by email after delay')
                const syncCreatedUser = await apiClient.getUserByEmail(email)
                console.log('✅ [DEBUG] User was created by sync service:', email, syncCreatedUser)
              } catch (retryError: any) {
                console.log('🔍 [DEBUG] Retry getUserByEmail also failed:', {
                  status: retryError.response?.status,
                  statusText: retryError.response?.statusText,
                  data: retryError.response?.data,
                  message: retryError.message
                })
                
                if (retryError.response?.status === 404) {
                  console.log('🔍 [DEBUG] Still no user found, creating new user...')
                  // Still doesn't exist, create it
                  try {
                    console.log('🔍 [DEBUG] Calling createUser API...')
                    const newUser = await apiClient.createUser(email)
                    console.log('✅ [DEBUG] User created successfully in backend:', email, newUser)
                  } catch (createError: any) {
                    console.error('❌ [DEBUG] Failed to create user:', {
                      status: createError.response?.status,
                      statusText: createError.response?.statusText,
                      data: createError.response?.data,
                      message: createError.message,
                      fullError: createError
                    })
                  }
                } else {
                  console.error('❌ [DEBUG] Unexpected error on retry:', retryError)
                }
              }
            } else {
              console.error('❌ [DEBUG] Unexpected error getting user (not 404):', error)
            }
          }
          
          // Mark user as created/checked for this session
          console.log('🔍 [DEBUG] Marking user as created in sessionStorage:', userCreatedKey)
          sessionStorage.setItem(userCreatedKey, 'true')
        } else {
          console.log('🔍 [DEBUG] User already marked as created in this session, skipping creation flow')
        }
      } else {
        console.log('❌ [DEBUG] No email found in localStorage, user not logged in')
      }
      
      // Always redirect to dashboard
      console.log('🔍 [DEBUG] Setting isChecking to false and redirecting to dashboard')
      setIsChecking(false)
      window.location.href = '/dashboard'
    }

    console.log('🔍 [DEBUG] Home page useEffect triggered, calling checkAndCreateUser')
    checkAndCreateUser().catch(error => {
      console.error('❌ [DEBUG] checkAndCreateUser threw unhandled error:', error)
    })
  }, [])

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-gray-500">
        {isChecking ? 'Initializing...' : 'Redirecting to dashboard...'}
      </div>
    </div>
  )
}