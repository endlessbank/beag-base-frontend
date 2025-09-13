import { SubscriptionStatus } from '@/types'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: SubscriptionStatus | string
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800'
      case 'FAILED':
        return 'bg-red-100 text-red-800'
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800'
      case 'REFUNDED':
        return 'bg-yellow-100 text-yellow-800'
      case 'PAUSED':
        return 'bg-orange-100 text-orange-800'
      case 'RESUMED':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getDisplayStatus = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'Active'
      case 'FAILED':
        return 'Payment Failed'
      case 'CANCELLED':
        return 'Cancelled'
      case 'REFUNDED':
        return 'Refunded'
      case 'PAUSED':
        return 'Paused'
      case 'RESUMED':
        return 'Active'
      case 'NO_SUBSCRIPTION':
        return 'No Subscription'
      default:
        return status
    }
  }

  const displayStatus = getDisplayStatus(status)

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        getStatusColor(status)
      )}
    >
      {displayStatus}
    </span>
  )
}