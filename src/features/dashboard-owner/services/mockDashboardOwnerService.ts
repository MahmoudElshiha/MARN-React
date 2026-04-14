import type { OwnerDashboardData } from '../types/dashboardOwner'

const MOCK_OWNER_DASHBOARD: OwnerDashboardData = {
  summary: {
    totalProperties: 10,
    occupiedProperties: 8,
    vacantProperties: 2,
    monthlyRevenue: 16800,
    monthlyRevenueChangePercent: 12,
    moneySaved: 12450,
    pendingRequests: 3,
  },
  earningsMonthly: [
    { month: 'Jan', earnings: 8400 },
    { month: 'Feb', earnings: 11200 },
    { month: 'Mar', earnings: 9800 },
    { month: 'Apr', earnings: 12600 },
    { month: 'May', earnings: 14000 },
    { month: 'Jun', earnings: 16800 },
  ],
  earningsYearly: [
    { month: '2020', earnings: 78000 },
    { month: '2021', earnings: 95000 },
    { month: '2022', earnings: 112000 },
    { month: '2023', earnings: 145000 },
    { month: '2024', earnings: 168000 },
    { month: '2025', earnings: 195000 },
  ],
  occupancy: [
    { name: 'Occupied', value: 8, color: '#3A6EA5' },
    { name: 'Vacant', value: 2, color: '#9CBBDC' },
  ],
  bookingRequests: [
    {
      id: '1',
      tenant: 'Alice Johnson',
      property: 'Modern Downtown Apartment',
      requestedDates: 'March 15 - September 15, 2026',
      moveIn: 'March 15, 2026',
      monthlyRent: 2800,
      status: 'pending',
      image:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    },
    {
      id: '2',
      tenant: 'Robert Chen',
      property: 'Luxury Penthouse Suite',
      requestedDates: 'March 20 - December 20, 2026',
      moveIn: 'March 20, 2026',
      monthlyRent: 4500,
      status: 'pending',
      image:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    },
    {
      id: '3',
      tenant: 'Maria Garcia',
      property: 'Cozy Studio in Arts District',
      requestedDates: 'April 1 - October 1, 2026',
      moveIn: 'April 1, 2026',
      monthlyRent: 1900,
      status: 'pending',
      image:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
    },
  ],
  contractsHistory: [
    {
      id: 'CNT-001',
      propertyName: 'Modern Downtown Apartment',
      tenantName: 'John Smith',
      status: 'Active',
      expiryDate: '2026-12-31',
    },
    {
      id: 'CNT-002',
      propertyName: 'Cozy Studio in Arts District',
      tenantName: 'Emily Davis',
      status: 'Active',
      expiryDate: '2027-03-15',
    },
    {
      id: 'CNT-003',
      propertyName: 'Beachfront Villa',
      tenantName: 'Michael Brown',
      status: 'Expired',
      expiryDate: '2026-01-20',
    },
    {
      id: 'CNT-004',
      propertyName: 'Loft in Financial District',
      tenantName: 'Sarah Wilson',
      status: 'Pending',
      expiryDate: '2026-04-01',
    },
    {
      id: 'CNT-005',
      propertyName: 'Garden House Suburb',
      tenantName: 'David Lee',
      status: 'Active',
      expiryDate: '2027-06-30',
    },
  ],
  properties: [
    {
      id: '1',
      name: 'Modern Downtown Apartment',
      location: 'San Francisco, CA',
      type: 'Apartment',
      rent: 2800,
      status: 'occupied',
      tenant: 'John Smith',
      views: 342,
      image:
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400',
    },
    {
      id: '2',
      name: 'Luxury Penthouse Suite',
      location: 'Miami, FL',
      type: 'Penthouse',
      rent: 4500,
      status: 'vacant',
      tenant: null,
      views: 567,
      image:
        'https://images.unsplash.com/photo-1515263487990-61b07816b324?w=400',
    },
    {
      id: '3',
      name: 'Cozy Studio in Arts District',
      location: 'Los Angeles, CA',
      type: 'Studio',
      rent: 1900,
      status: 'occupied',
      tenant: 'Emily Davis',
      views: 289,
      image:
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
    },
  ],
  notifications: [
    {
      id: '1',
      type: 'payment',
      message: 'Payment received from John Smith',
      time: '2 hours ago',
      read: false,
    },
    {
      id: '2',
      type: 'request',
      message: 'New booking request for Downtown Apartment',
      time: '5 hours ago',
      read: false,
    },
    {
      id: '3',
      type: 'maintenance',
      message: 'Maintenance request from Emily Davis',
      time: '1 day ago',
      read: true,
    },
    {
      id: '4',
      type: 'review',
      message: 'New review received (4.5 stars)',
      time: '2 days ago',
      read: true,
    },
  ],
  quickStats: {
    averageRent: 2350,
    totalTenants: 8,
    averageRating: 4.7,
  },
}

export const mockDashboardOwnerService = {
  getDashboard(): Promise<OwnerDashboardData> {
    return Promise.resolve(MOCK_OWNER_DASHBOARD)
  },
}
