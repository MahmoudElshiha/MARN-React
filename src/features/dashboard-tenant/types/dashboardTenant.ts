export interface TenantPropertyCard {
    id: string
    image: string
    title: string
    location: string
    price: number
    rating: number
    reviews: number
    type: string
    beds?: number
    baths?: number
    guests?: number
}

export interface TenantCurrentRental {
    id: string
    property: string
    location: string
    moveIn: string
    moveOut: string
    rent: number
    status: 'active' | 'ended'
    image: string
}

export interface TenantNotification {
    id: string
    type: 'payment' | 'message' | 'update'
    message: string
    time: string
    unread: boolean
}

export interface TenantDashboardSummary {
    currentRent: number
    activeBookings: number
    savedProperties: number
    unreadNotifications: number
}

export interface TenantProfileCompletion {
    name: string
    avatar: string
    initials: string
    completionPercent: number
}

export interface TenantDashboardData {
    welcomeName: string
    summary: TenantDashboardSummary
    currentRental: TenantCurrentRental
    savedPropertiesList: TenantPropertyCard[]
    recommendedProperties: TenantPropertyCard[]
    notifications: TenantNotification[]
    profileCompletion: TenantProfileCompletion
}
