export interface UserSubscription {
  id: number
  email: string
  beag_client_id?: number
  subscription_status?: string
  plan_id?: number
  start_date?: string
  end_date?: string
  my_saas_app_id?: string
  last_synced?: string
  created_at: string
  updated_at?: string
}

export type SubscriptionStatus = 
  | 'PAID' 
  | 'FAILED' 
  | 'CANCELLED' 
  | 'REFUNDED' 
  | 'PAUSED' 
  | 'RESUMED'
  | 'NO_SUBSCRIPTION'