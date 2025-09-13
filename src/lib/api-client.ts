import axios from 'axios'
import { UserSubscription } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const apiClient = {
  // User endpoints
  async createUser(email: string): Promise<UserSubscription> {
    const response = await client.post('/api/users/', { email })
    return response.data
  },

  async getUserByEmail(email: string): Promise<UserSubscription> {
    const response = await client.get(`/api/users/by-email/${encodeURIComponent(email)}`)
    return response.data
  },

  async getUsers(): Promise<UserSubscription[]> {
    const response = await client.get('/api/users/')
    return response.data
  },

  // Subscription endpoints
  async checkSubscription(email: string) {
    const response = await client.get(`/api/subscriptions/check/${encodeURIComponent(email)}`)
    return response.data
  },

  async getCachedSubscription(email: string) {
    const response = await client.get(`/api/subscriptions/cached/${encodeURIComponent(email)}`)
    return response.data
  },

  async syncUserSubscription(userId: number) {
    const response = await client.post(`/api/users/sync/${userId}`)
    return response.data
  },

  async syncAllSubscriptions() {
    const response = await client.post('/api/subscriptions/sync-all')
    return response.data
  },
}