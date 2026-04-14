export interface EarningsPoint {
  month: string
  earnings: number
}

export interface OccupancySlice {
  name: 'Occupied' | 'Vacant'
  value: number
  color: string
}

export interface BookingRequest {
  id: string
  tenant: string
  property: string
  requestedDates: string
  moveIn: string
  monthlyRent: number
  status: 'pending' | 'approved' | 'declined'
  image: string
}

export interface ContractHistoryItem {
  id: string
  propertyName: string
  tenantName: string
  status: 'Active' | 'Expired' | 'Pending'
  expiryDate: string
}

export interface OwnerPropertyItem {
  id: string
  name: string
  location: string
  type: string
  rent: number
  status: 'occupied' | 'vacant'
  tenant: string | null
  views: number
  image: string
}

export interface OwnerNotification {
  id: string
  type: 'payment' | 'request' | 'maintenance' | 'review'
  message: string
  time: string
  read: boolean
}

export interface OwnerDashboardSummary {
  totalProperties: number
  occupiedProperties: number
  vacantProperties: number
  monthlyRevenue: number
  monthlyRevenueChangePercent: number
  moneySaved: number
  pendingRequests: number
}

export interface OwnerQuickStats {
  averageRent: number
  totalTenants: number
  averageRating: number
}

export interface OwnerDashboardData {
  summary: OwnerDashboardSummary
  earningsMonthly: EarningsPoint[]
  earningsYearly: EarningsPoint[]
  occupancy: OccupancySlice[]
  bookingRequests: BookingRequest[]
  contractsHistory: ContractHistoryItem[]
  properties: OwnerPropertyItem[]
  notifications: OwnerNotification[]
  quickStats: OwnerQuickStats
}
