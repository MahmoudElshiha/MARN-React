import type { TenantDashboardData } from '../types/dashboardTenant'

const MOCK_TENANT_DASHBOARD: TenantDashboardData = {
    welcomeName: 'Ahmed',
    summary: {
        currentRent: 50000,
        activeBookings: 1,
        savedProperties: 2,
        unreadNotifications: 2,
    },
    currentRental: {
        id: '1',
        property: 'Modern Zamalek Apartment',
        location: 'Cairo, Egypt',
        moveIn: 'March 1, 2026',
        moveOut: 'March 1, 2027',
        rent: 50000,
        status: 'active',
        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400',
    },
    savedPropertiesList: [
        {
            id: '2',
            image:
                'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
            title: 'Cozy Studio in Maadi',
            location: 'Alexandria, Egypt',
            price: 35000,
            rating: 4.8,
            reviews: 89,
            type: 'Studio',
            beds: 1,
            baths: 1,
        },
        {
            id: '3',
            image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
            title: 'Spacious Family Villa',
            location: 'Giza, Egypt',
            price: 60000,
            rating: 5,
            reviews: 156,
            type: 'House',
            beds: 4,
            baths: 3,
        },
    ],
    recommendedProperties: [
        {
            id: '2',
            image:
                'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
            title: 'Cozy Studio in Zamalek',
            location: 'Cairo, Egypt',
            price: 8500,
            rating: 4.8,
            reviews: 89,
            type: 'Studio',
            beds: 1,
            baths: 1,
            guests: 2,
        },
        {
            id: '3',
            image:
                'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
            title: 'Luxury Villa in New Cairo',
            location: 'Cairo, Egypt',
            price: 35000,
            rating: 5,
            reviews: 156,
            type: 'House',
            beds: 4,
            baths: 3,
            guests: 8,
        },
    ],
    notifications: [
        {
            id: '1',
            type: 'payment',
            message: 'Rent payment due in 5 days',
            time: '2 hours ago',
            unread: true,
        },
        {
            id: '2',
            type: 'message',
            message: 'New message from your landlord',
            time: '5 hours ago',
            unread: true,
        },
        {
            id: '3',
            type: 'update',
            message: 'Maintenance scheduled for next week',
            time: '1 day ago',
            unread: false,
        },
    ],
    profileCompletion: {
        name: 'Ahmed',
        avatar:
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
        initials: 'AN',
        completionPercent: 75,
    },
}

export const mockDashboardTenantService = {
    getDashboard(): Promise<TenantDashboardData> {
        return Promise.resolve(MOCK_TENANT_DASHBOARD)
    },
}
