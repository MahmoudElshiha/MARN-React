import type {
  AdminDashboardData,
  ManagedUserStatus,
  UserActionType,
} from '../types/dashboardAdmin'

const MOCK_DASHBOARD_ADMIN_DATA: AdminDashboardData = {
  stats: [
    {
      key: 'users',
      label: 'Total Users',
      value: 12543,
      change: '+12%',
      color: 'from-blue-500 to-blue-600',
    },
    {
      key: 'listings',
      label: 'Total Listings',
      value: 3842,
      change: '+8%',
      color: 'from-green-500 to-green-600',
    },
    {
      key: 'verifications',
      label: 'Pending Verifications',
      value: 47,
      change: '-5%',
      color: 'from-yellow-500 to-yellow-600',
    },
    {
      key: 'contracts',
      label: 'Active Contracts',
      value: 1234,
      change: '+15%',
      color: 'from-purple-500 to-purple-600',
    },
  ],
  revenueData: [
    { month: 'Jan', revenue: 125000 },
    { month: 'Feb', revenue: 145000 },
    { month: 'Mar', revenue: 162000 },
    { month: 'Apr', revenue: 178000 },
    { month: 'May', revenue: 195000 },
    { month: 'Jun', revenue: 212000 },
  ],
  summary: {
    totalRevenue: 1017000,
    activeContracts: 1234,
    newUsersThisMonth: 1401,
  },
  pendingVerifications: [
    {
      id: 1,
      userName: 'John Doe',
      propertyName: 'Modern Downtown Apartment',
      date: '2026-02-14',
      status: 'pending',
      type: 'property',
    },
    {
      id: 2,
      userName: 'Sarah Smith',
      propertyName: 'Cozy Studio in Mission',
      date: '2026-02-15',
      status: 'pending',
      type: 'property',
    },
    {
      id: 3,
      userName: 'Mike Johnson',
      propertyName: 'Luxury Penthouse',
      date: '2026-02-15',
      status: 'pending',
      type: 'property',
    },
    {
      id: 4,
      userName: 'Emma Wilson',
      propertyName: 'Family House in Sunset',
      date: '2026-02-16',
      status: 'pending',
      type: 'contract',
    },
  ],
  users: [
    {
      id: 1,
      name: 'Alice Cooper',
      email: 'alice@example.com',
      role: 'Tenant',
      status: 'Active',
      joinDate: '2025-11-20',
    },
    {
      id: 2,
      name: 'Bob Martin',
      email: 'bob@example.com',
      role: 'Owner',
      status: 'Active',
      joinDate: '2025-12-05',
    },
    {
      id: 3,
      name: 'Charlie Brown',
      email: 'charlie@example.com',
      role: 'Tenant',
      status: 'Suspended',
      joinDate: '2026-01-10',
    },
    {
      id: 4,
      name: 'Diana Prince',
      email: 'diana@example.com',
      role: 'Owner',
      status: 'Active',
      joinDate: '2026-01-28',
    },
  ],
  adminUsers: [
    {
      id: 1,
      username: 'admin_john',
      email: 'john.admin@marn.com',
      joinDate: '2024-05-12',
    },
    {
      id: 2,
      username: 'admin_sarah',
      email: 'sarah.admin@marn.com',
      joinDate: '2024-08-20',
    },
    {
      id: 3,
      username: 'admin_mike',
      email: 'mike.admin@marn.com',
      joinDate: '2025-02-14',
    },
    {
      id: 4,
      username: 'admin_emma',
      email: 'emma.admin@marn.com',
      joinDate: '2025-06-08',
    },
  ],
  recentReports: [
    {
      id: 1,
      name: 'January 2026 Monthly Report',
      date: '2026-02-01',
      size: '2.4 MB',
    },
    {
      id: 2,
      name: 'December 2025 Monthly Report',
      date: '2026-01-01',
      size: '2.1 MB',
    },
    {
      id: 3,
      name: 'Q4 2025 Quarterly Report',
      date: '2026-01-15',
      size: '5.8 MB',
    },
  ],
}

function toStatus(action: UserActionType): ManagedUserStatus {
  if (action === 'ban') return 'Banned'
  if (action === 'suspend') return 'Suspended'
  return 'Active'
}

export const mockDashboardAdminService = {
  getDashboard(): Promise<AdminDashboardData> {
    return Promise.resolve(MOCK_DASHBOARD_ADMIN_DATA)
  },

  approveVerification(id: number): Promise<{ id: number }> {
    return Promise.resolve({ id })
  },

  rejectVerification(id: number): Promise<{ id: number }> {
    return Promise.resolve({ id })
  },

  downgradeAdmin(id: number): Promise<{ id: number }> {
    return Promise.resolve({ id })
  },

  updateUserStatus(
    id: number,
    action: UserActionType,
  ): Promise<{ id: number; status: ManagedUserStatus }> {
    return Promise.resolve({ id, status: toStatus(action) })
  },
}
