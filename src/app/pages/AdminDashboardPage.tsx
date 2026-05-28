import { motion } from 'motion/react'
import {
  Users,
  Building,
  Clock,
  FileText,
  TrendingUp,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Ban,
  UserCheck,
  Calendar,
  DollarSign,
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Input } from '../components/ui/input'
import { Skeleton } from '../components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'
import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { toast } from 'sonner'
import {
  useAdminStats,
  useAdminUserStats,
  useAdminVerifications,
  useAdminUserVerification,
} from '@/hooks/useAdminStats'
import { adminService, type AdminUserStatsItem } from '@/services/adminService'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? ''

function buildImageUrl(path: string | null) {
  if (!path) return null
  if (path.startsWith('http')) return path
  return `${BASE_URL}${path}`
}

export function AdminDashboardPage() {
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [actionType, setActionType] = useState<
    'ban' | 'suspend' | 'restore' | null
  >(null)
  const [pendingUserId, setPendingUserId] = useState<string | null>(null)
  const [selectedVerificationId, setSelectedVerificationId] = useState<string | null>(null)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [pendingRejectUserId, setPendingRejectUserId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [selectedUser, setSelectedUser] = useState<AdminUserStatsItem | null>(null)

  const { data: statsData, isLoading: statsLoading } = useAdminStats()
  const { data: verificationsData, isLoading: verificationsLoading } =
    useAdminVerifications()
  const { data: usersData, isLoading: usersLoading } = useAdminUserStats()
  const { data: verificationDetailData, isLoading: verificationDetailLoading } =
    useAdminUserVerification(selectedVerificationId)

  const verificationDetail = verificationDetailData?.data
  const queryClient = useQueryClient()

  const apiStats = statsData?.data
  const pendingVerifications = verificationsData?.data?.items ?? []
  const users = usersData?.data?.users?.items ?? []
  const revenueData = apiStats?.monthlyRevenue ?? []

  const formatTrend = (pct?: number) => {
    if (pct == null) return ''
    return pct >= 0 ? `+${pct}%` : `${pct}%`
  }

  const stats = [
    {
      icon: Users,
      label: 'Total Users',
      value: statsLoading
        ? '…'
        : (apiStats?.totalUsers?.value ?? 0).toLocaleString(),
      change: statsLoading ? '' : formatTrend(apiStats?.totalUsers?.trendPercentage),
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Building,
      label: 'Total Listings',
      value: statsLoading
        ? '…'
        : (apiStats?.totalProperties?.value ?? 0).toLocaleString(),
      change: statsLoading ? '' : formatTrend(apiStats?.totalProperties?.trendPercentage),
      color: 'from-green-500 to-green-600',
    },
    {
      icon: Clock,
      label: 'Pending Verifications',
      value: statsLoading
        ? '…'
        : (apiStats?.pendingVerifications?.value ?? 0).toLocaleString(),
      change: statsLoading ? '' : formatTrend(apiStats?.pendingVerifications?.trendPercentage),
      color: 'from-yellow-500 to-yellow-600',
    },
    {
      icon: FileText,
      label: 'Active Contracts',
      value: statsLoading
        ? '…'
        : (apiStats?.revenueSummary?.activeContracts ?? 0).toLocaleString(),
      change: statsLoading ? '' : formatTrend(apiStats?.totalContracts?.trendPercentage),
      color: 'from-purple-500 to-purple-600',
    },
  ]

  const approveVerification = useMutation({
    mutationFn: (userId: string) => adminService.approveVerification(userId),
    onSuccess: () => {
      toast.success('Verification approved')
      queryClient.invalidateQueries({ queryKey: ['adminVerifications'] })
      queryClient.invalidateQueries({ queryKey: ['adminStats'] })
    },
    onError: () => toast.error('Failed to approve'),
  })

  const rejectVerification = useMutation({
    mutationFn: ({ userId, reason }: { userId: string; reason: string }) =>
      adminService.rejectVerification(userId, reason),
    onSuccess: () => {
      toast.success('Verification rejected')
      queryClient.invalidateQueries({ queryKey: ['adminVerifications'] })
      queryClient.invalidateQueries({ queryKey: ['adminStats'] })
      setShowRejectModal(false)
      setPendingRejectUserId(null)
      setRejectReason('')
    },
    onError: () => toast.error('Failed to reject'),
  })

  const userAction = useMutation({
    mutationFn: ({
      userId,
      action,
    }: {
      userId: string
      action: 'ban' | 'suspend' | 'restore'
    }) => {
      if (action === 'ban') return adminService.banUser(userId)
      if (action === 'suspend') return adminService.suspendUser(userId)
      return adminService.restoreUser(userId)
    },
    onSuccess: () => {
      const labels: Record<string, string> = { ban: 'banned', suspend: 'suspended', restore: 'restored' }
      toast.success(`User ${labels[actionType!] ?? actionType} successfully`)
      queryClient.invalidateQueries({ queryKey: ['adminUserStats'] })
      setShowConfirmModal(false)
      setPendingUserId(null)
      setSelectedUser(null)
    },
    onError: () => toast.error('Action failed'),
  })

  const adminUsers = [
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
  ]

  const handleDowngradeAdmin = () => {
    toast.success('Admin downgraded successfully')
  }

  const handleApprove = (userId: string) => approveVerification.mutate(userId)
  const handleReject = (userId: string) => {
    setPendingRejectUserId(userId)
    setRejectReason('')
    setSelectedVerificationId(null)
    setShowRejectModal(true)
  }
  const confirmReject = () => {
    if (pendingRejectUserId && rejectReason.trim()) {
      rejectVerification.mutate({ userId: pendingRejectUserId, reason: rejectReason.trim() })
    }
  }

  const handleUserAction = (
    userId: string,
    action: 'ban' | 'suspend' | 'restore',
  ) => {
    setActionType(action)
    setPendingUserId(userId)
    setShowConfirmModal(true)
  }

  const confirmUserAction = () => {
    if (pendingUserId && actionType) {
      userAction.mutate({ userId: pendingUserId, action: actionType })
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700',
      Pending: 'bg-yellow-100 text-yellow-700',
      active: 'bg-green-100 text-green-700',
      Active: 'bg-green-100 text-green-700',
      Verified: 'bg-green-100 text-green-700',
      verified: 'bg-green-100 text-green-700',
      Unverified: 'bg-yellow-100 text-yellow-700',
      unverified: 'bg-yellow-100 text-yellow-700',
      suspended: 'bg-red-100 text-red-700',
      Suspended: 'bg-red-100 text-red-700',
      banned: 'bg-gray-100 text-gray-700',
      Banned: 'bg-gray-100 text-gray-700',
    }
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-700'}`}
      >
        {status}
      </span>
    )
  }

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-[1440px] mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[#1a1a1a] mb-2">
              Admin Dashboard
            </h1>
            <p className="text-lg text-[#4a5565]">
              Manage users, verify documents, and monitor platform activity
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-[#F2F4F6] border-none rounded-3xl shadow-lg shadow-[#3A6EA5]/10">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <span
                          className={`text-sm font-semibold ${
                            stat.change.startsWith('+')
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {stat.change}
                        </span>
                      </div>
                      <h3 className="text-3xl font-bold text-[#1a1a1a] mb-1">
                        {stat.value}
                      </h3>
                      <p className="text-sm text-[#4a5565]">{stat.label}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          {/* Revenue & Sales Data Section */}
          <div className="grid lg:grid-cols-3 gap-6 mb-12">
            <Card className="bg-[#F2F4F6] border-none rounded-3xl shadow-lg shadow-[#3A6EA5]/10">
              <CardHeader>
                <CardTitle className="text-xl text-[#1a1a1a] flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-[#3A6EA5]" />
                  Revenue & Sales Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-white rounded-2xl p-4">
                  <p className="text-sm text-[#4a5565] mb-1">Total Revenue</p>
                  <p className="text-3xl font-bold text-[#3A6EA5]">
                    {statsLoading
                      ? '…'
                      : `EGP ${(apiStats?.revenueSummary?.totalRevenue ?? 0).toLocaleString()}`}
                  </p>
                  {!statsLoading && apiStats?.revenueSummary?.revenueTrendPercentage != null && (
                    <p
                      className={`text-sm mt-1 ${
                        apiStats.revenueSummary.revenueTrendPercentage >= 0
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {formatTrend(apiStats.revenueSummary.revenueTrendPercentage)} from last period
                    </p>
                  )}
                </div>
                <div className="bg-white rounded-2xl p-4">
                  <p className="text-sm text-[#4a5565] mb-1">
                    Active Contracts
                  </p>
                  <p className="text-2xl font-bold text-[#1a1a1a]">
                    {statsLoading
                      ? '…'
                      : (apiStats?.revenueSummary?.activeContracts ?? 0).toLocaleString()}
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-4">
                  <p className="text-sm text-[#4a5565] mb-1">
                    New Users (This Month)
                  </p>
                  <p className="text-2xl font-bold text-[#1a1a1a]">
                    {statsLoading
                      ? '…'
                      : (apiStats?.revenueSummary?.newUsersThisMonth ?? 0).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 bg-[#F2F4F6] border-none rounded-3xl shadow-lg shadow-[#3A6EA5]/10">
              <CardHeader>
                <CardTitle className="text-xl text-[#1a1a1a]">
                  Monthly Revenue Graph
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#3A6EA5"
                        opacity={0.2}
                      />
                      <XAxis dataKey="label" stroke="#4a5565" />
                      <YAxis stroke="#4a5565" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #3A6EA5',
                          borderRadius: '12px',
                        }}
                        formatter={(value: number) =>
                          `EGP ${value.toLocaleString()}`
                        }
                      />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#3A6EA5"
                        strokeWidth={3}
                        dot={{ fill: '#3A6EA5', r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="verifications" className="space-y-8">
            <TabsList className="w-full h-auto bg-[#F2F4F6] p-1.5 rounded-2xl gap-1">
              <TabsTrigger
                value="verifications"
                className="flex-1 rounded-xl py-2.5 text-sm font-medium text-[#4a5565] transition-all hover:text-[#3A6EA5] data-[state=active]:bg-white data-[state=active]:text-[#3A6EA5] data-[state=active]:shadow-sm"
              >
                Review Submissions
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className="flex-1 rounded-xl py-2.5 text-sm font-medium text-[#4a5565] transition-all hover:text-[#3A6EA5] data-[state=active]:bg-white data-[state=active]:text-[#3A6EA5] data-[state=active]:shadow-sm"
              >
                User Management
              </TabsTrigger>
              <TabsTrigger
                value="admins"
                className="flex-1 rounded-xl py-2.5 text-sm font-medium text-[#4a5565] transition-all hover:text-[#3A6EA5] data-[state=active]:bg-white data-[state=active]:text-[#3A6EA5] data-[state=active]:shadow-sm"
              >
                Admin Management
              </TabsTrigger>
              <TabsTrigger
                value="reports"
                className="flex-1 rounded-xl py-2.5 text-sm font-medium text-[#4a5565] transition-all hover:text-[#3A6EA5] data-[state=active]:bg-white data-[state=active]:text-[#3A6EA5] data-[state=active]:shadow-sm"
              >
                Reports
              </TabsTrigger>
            </TabsList>

            {/* Verifications Tab */}
            <TabsContent value="verifications">
              <Card className="bg-[#F2F4F6] border-none rounded-3xl shadow-lg shadow-[#3A6EA5]/10">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl text-[#1a1a1a]">
                      Pending Verifications
                    </CardTitle>
                    <span className="text-sm text-[#4a5565]">
                      {pendingVerifications.length} pending
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#3A6EA5]/20">
                          <th className="text-left py-4 px-4 text-[#1a1a1a] font-semibold">
                            Full Name
                          </th>
                          <th className="text-left py-4 px-4 text-[#1a1a1a] font-semibold">
                            Email
                          </th>
                          <th className="text-left py-4 px-4 text-[#1a1a1a] font-semibold">
                            National ID
                          </th>
                          <th className="text-left py-4 px-4 text-[#1a1a1a] font-semibold">
                            Submitted
                          </th>
                          <th className="text-left py-4 px-4 text-[#1a1a1a] font-semibold">
                            Status
                          </th>
                          <th className="text-right py-4 px-4 text-[#1a1a1a] font-semibold">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {verificationsLoading ? (
                          Array.from({ length: 4 }).map((_, i) => (
                            <tr
                              key={i}
                              className="border-b border-[#3A6EA5]/10"
                            >
                              {Array.from({ length: 6 }).map((_, j) => (
                                <td key={j} className="py-4 px-4">
                                  <Skeleton className="h-5 w-full rounded" />
                                </td>
                              ))}
                            </tr>
                          ))
                        ) : pendingVerifications.length === 0 ? (
                          <tr>
                            <td
                              colSpan={6}
                              className="py-10 text-center text-[#4a5565]"
                            >
                              No pending verifications.
                            </td>
                          </tr>
                        ) : (
                          pendingVerifications.map((item) => (
                            <tr
                              key={item.userId}
                              className="border-b border-[#3A6EA5]/10 hover:bg-white/50 transition-colors"
                            >
                              <td className="py-4 px-4 text-[#1a1a1a] font-medium">
                                <div>{item.fullName}</div>
                                {item.arabicFullName && (
                                  <div className="text-xs text-[#4a5565] mt-0.5" dir="rtl">
                                    {item.arabicFullName}
                                  </div>
                                )}
                              </td>
                              <td className="py-4 px-4 text-[#4a5565]">
                                {item.email}
                              </td>
                              <td className="py-4 px-4 text-[#4a5565] font-mono text-sm">
                                {item.nationalIDNumber ?? '—'}
                              </td>
                              <td className="py-4 px-4 text-[#4a5565]">
                                {new Date(item.createdAt).toLocaleDateString('en-GB')}
                              </td>
                              <td className="py-4 px-4">
                                {getStatusBadge(item.accountStatusDisplayName)}
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex gap-2 justify-end">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="rounded-xl border-[#3A6EA5]/20"
                                    onClick={() => setSelectedVerificationId(item.userId)}
                                  >
                                    <Eye className="w-4 h-4 mr-1" />
                                    View
                                  </Button>
                                  <Button
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700 text-white rounded-xl"
                                    disabled={approveVerification.isPending}
                                    onClick={() => handleApprove(item.userId)}
                                  >
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-xl"
                                    disabled={rejectVerification.isPending}
                                    onClick={() => handleReject(item.userId)}
                                  >
                                    <XCircle className="w-4 h-4 mr-1" />
                                    Reject
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users">
              <Card className="bg-[#F2F4F6] border-none rounded-3xl shadow-lg shadow-[#3A6EA5]/10">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl text-[#1a1a1a]">
                      Manage Users
                    </CardTitle>
                    <Input
                      placeholder="Search users..."
                      className="w-64 bg-white rounded-xl border-[#3A6EA5]/20"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#3A6EA5]/20">
                          <th className="text-left py-4 px-4 text-[#1a1a1a] font-semibold">
                            Name
                          </th>
                          <th className="text-left py-4 px-4 text-[#1a1a1a] font-semibold">
                            Email
                          </th>
                          <th className="text-left py-4 px-4 text-[#1a1a1a] font-semibold">
                            Role
                          </th>
                          <th className="text-left py-4 px-4 text-[#1a1a1a] font-semibold">
                            Status
                          </th>
                          <th className="text-left py-4 px-4 text-[#1a1a1a] font-semibold">
                            Join Date
                          </th>
                          <th className="text-right py-4 px-4 text-[#1a1a1a] font-semibold">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {usersLoading ? (
                          Array.from({ length: 5 }).map((_, i) => (
                            <tr
                              key={i}
                              className="border-b border-[#3A6EA5]/10"
                            >
                              {Array.from({ length: 6 }).map((_, j) => (
                                <td key={j} className="py-4 px-4">
                                  <Skeleton className="h-5 w-full rounded" />
                                </td>
                              ))}
                            </tr>
                          ))
                        ) : users.length === 0 ? (
                          <tr>
                            <td
                              colSpan={6}
                              className="py-10 text-center text-[#4a5565]"
                            >
                              No users found.
                            </td>
                          </tr>
                        ) : (
                          users.map((user) => (
                            <tr
                              key={user.userId}
                              className="border-b border-[#3A6EA5]/10 hover:bg-white/50 transition-colors"
                            >
                              <td className="py-4 px-4 text-[#1a1a1a] font-medium">
                                {user.fullName}
                              </td>
                              <td className="py-4 px-4 text-[#4a5565]">
                                {user.email}
                              </td>
                              <td className="py-4 px-4 text-[#4a5565]">
                                {user.rolesDisplayNames.join(', ') || '—'}
                              </td>
                              <td className="py-4 px-4">
                                {getStatusBadge(user.accountStatusDisplayName)}
                              </td>
                              <td className="py-4 px-4 text-[#4a5565]">
                                {new Date(user.createdAt).toLocaleDateString('en-GB')}
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex gap-2 justify-end">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="rounded-xl border-[#3A6EA5]/20"
                                    onClick={() => setSelectedUser(user)}
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  {user.accountStatus === 'Verified' ? (
                                    <>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-white rounded-xl"
                                        onClick={() => handleUserAction(user.userId, 'suspend')}
                                      >
                                        Suspend
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-xl"
                                        onClick={() => handleUserAction(user.userId, 'ban')}
                                      >
                                        <Ban className="w-4 h-4" />
                                      </Button>
                                    </>
                                  ) : user.accountStatus === 'Banned' || user.accountStatus === 'Suspended' ? (
                                    <Button
                                      size="sm"
                                      className="bg-green-600 hover:bg-green-700 text-white rounded-xl"
                                      onClick={() => handleUserAction(user.userId, 'restore')}
                                    >
                                      <UserCheck className="w-4 h-4 mr-1" />
                                      Restore
                                    </Button>
                                  ) : (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-xl"
                                      onClick={() => handleUserAction(user.userId, 'ban')}
                                    >
                                      <Ban className="w-4 h-4" />
                                    </Button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Admins Tab */}
            <TabsContent value="admins">
              <Card className="bg-[#F2F4F6] border-none rounded-3xl shadow-lg shadow-[#3A6EA5]/10">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl text-[#1a1a1a]">
                      Manage Admins
                    </CardTitle>
                    <Input
                      placeholder="Search admins..."
                      className="w-64 bg-white rounded-xl border-[#3A6EA5]/20"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#3A6EA5]/20">
                          <th className="text-left py-4 px-4 text-[#1a1a1a] font-semibold">
                            Username
                          </th>
                          <th className="text-left py-4 px-4 text-[#1a1a1a] font-semibold">
                            Email
                          </th>
                          <th className="text-left py-4 px-4 text-[#1a1a1a] font-semibold">
                            Join Date
                          </th>
                          <th className="text-right py-4 px-4 text-[#1a1a1a] font-semibold">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {adminUsers.map((admin) => (
                          <tr
                            key={admin.id}
                            className="border-b border-[#3A6EA5]/10 hover:bg-white/50 transition-colors"
                          >
                            <td className="py-4 px-4 text-[#1a1a1a] font-medium">
                              {admin.username}
                            </td>
                            <td className="py-4 px-4 text-[#4a5565]">
                              {admin.email}
                            </td>
                            <td className="py-4 px-4 text-[#4a5565]">
                              {admin.joinDate}
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex gap-2 justify-end">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="rounded-xl border-[#3A6EA5]/20"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-xl"
                                  onClick={() => handleDowngradeAdmin()}
                                >
                                  <Ban className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reports Tab */}
            <TabsContent value="reports">
              <Card className="bg-[#F2F4F6] border-none rounded-3xl shadow-lg shadow-[#3A6EA5]/10">
                <CardHeader>
                  <CardTitle className="text-2xl text-[#1a1a1a]">
                    System Reports
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Filters */}
                  <div className="grid md:grid-cols-3 gap-4 p-6 bg-white rounded-2xl">
                    <div>
                      <label className="text-sm text-[#4a5565] mb-2 block">
                        Date Range
                      </label>
                      <Select defaultValue="month">
                        <SelectTrigger className="bg-[#F2F4F6] rounded-xl border-[#3A6EA5]/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="week">Last Week</SelectItem>
                          <SelectItem value="month">Last Month</SelectItem>
                          <SelectItem value="quarter">Last Quarter</SelectItem>
                          <SelectItem value="year">Last Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm text-[#4a5565] mb-2 block">
                        User Role
                      </label>
                      <Select defaultValue="all">
                        <SelectTrigger className="bg-[#F2F4F6] rounded-xl border-[#3A6EA5]/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Roles</SelectItem>
                          <SelectItem value="tenant">Tenants</SelectItem>
                          <SelectItem value="owner">Owners</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm text-[#4a5565] mb-2 block">
                        Property Type
                      </label>
                      <Select defaultValue="all">
                        <SelectTrigger className="bg-[#F2F4F6] rounded-xl border-[#3A6EA5]/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="bed">Bed</SelectItem>
                          <SelectItem value="room">Room</SelectItem>
                          <SelectItem value="apartment">Apartment</SelectItem>
                          <SelectItem value="house">House</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Report Actions */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] hover:from-[#2a5a8a] hover:to-[#3A6EA5] text-white rounded-2xl shadow-lg shadow-[#3A6EA5]/30"
                    >
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Generate Monthly Report
                    </Button>
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        variant="outline"
                        className="rounded-xl border-[#3A6EA5] text-[#3A6EA5] hover:bg-[#3A6EA5] hover:text-white"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download CSV
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-xl border-[#3A6EA5] text-[#3A6EA5] hover:bg-[#3A6EA5] hover:text-white"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>
                  </div>

                  {/* Recent Reports */}
                  <div className="bg-white rounded-2xl p-6">
                    <h3 className="font-semibold text-[#1a1a1a] mb-4">
                      Recent Reports
                    </h3>
                    <div className="space-y-3">
                      {[
                        {
                          name: 'January 2026 Monthly Report',
                          date: '2026-02-01',
                          size: '2.4 MB',
                        },
                        {
                          name: 'December 2025 Monthly Report',
                          date: '2026-01-01',
                          size: '2.1 MB',
                        },
                        {
                          name: 'Q4 2025 Quarterly Report',
                          date: '2026-01-15',
                          size: '5.8 MB',
                        },
                      ].map((report, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-[#F2F4F6] rounded-xl"
                        >
                          <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-[#3A6EA5]" />
                            <div>
                              <p className="font-medium text-[#1a1a1a]">
                                {report.name}
                              </p>
                              <p className="text-sm text-[#4a5565]">
                                {report.date} • {report.size}
                              </p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-xl border-[#3A6EA5]/20"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* ID-Card View Modal */}
      {selectedVerificationId && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedVerificationId(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                {verificationDetailLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-7 w-48 rounded" />
                    <Skeleton className="h-4 w-36 rounded" />
                    <Skeleton className="h-4 w-40 rounded" />
                  </div>
                ) : (
                  <>
                    <h3 className="text-2xl font-bold text-[#1a1a1a]">
                      {verificationDetail?.fullName}
                    </h3>
                    {verificationDetail?.arabicFullName && (
                      <p className="text-[#4a5565] mt-0.5" dir="rtl">
                        {verificationDetail.arabicFullName}
                      </p>
                    )}
                    <p className="text-sm text-[#4a5565] mt-1">
                      {verificationDetail?.email}
                    </p>
                  </>
                )}
              </div>
              <Button
                size="sm"
                variant="outline"
                className="rounded-xl border-[#3A6EA5]/20"
                onClick={() => setSelectedVerificationId(null)}
              >
                <XCircle className="w-4 h-4" />
              </Button>
            </div>

            {/* Detail fields */}
            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              {verificationDetailLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-[#F2F4F6] rounded-2xl p-4 space-y-2">
                    <Skeleton className="h-3 w-20 rounded" />
                    <Skeleton className="h-5 w-32 rounded" />
                  </div>
                ))
              ) : (
                <>
                  <div className="bg-[#F2F4F6] rounded-2xl p-4">
                    <p className="text-[#4a5565] mb-1">National ID</p>
                    <p className="font-mono font-semibold text-[#1a1a1a]">
                      {verificationDetail?.nationalIDNumber ?? '—'}
                    </p>
                  </div>
                  <div className="bg-[#F2F4F6] rounded-2xl p-4">
                    <p className="text-[#4a5565] mb-1">Arabic Address</p>
                    <p className="font-semibold text-[#1a1a1a]" dir="rtl">
                      {verificationDetail?.arabicAddress ?? '—'}
                    </p>
                  </div>
                  <div className="bg-[#F2F4F6] rounded-2xl p-4">
                    <p className="text-[#4a5565] mb-1">Phone</p>
                    <p className="font-semibold text-[#1a1a1a]">
                      {verificationDetail?.phoneNumber ?? '—'}
                    </p>
                  </div>
                  <div className="bg-[#F2F4F6] rounded-2xl p-4">
                    <p className="text-[#4a5565] mb-1">Submitted</p>
                    <p className="font-semibold text-[#1a1a1a]">
                      {verificationDetail?.createdAt
                        ? new Date(verificationDetail.createdAt).toLocaleDateString('en-GB')
                        : '—'}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* ID card photos */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {verificationDetailLoading ? (
                Array.from({ length: 2 }).map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-16 rounded mb-2" />
                    <Skeleton className="h-32 w-full rounded-2xl" />
                  </div>
                ))
              ) : (
                [
                  { label: 'Front ID', src: buildImageUrl(verificationDetail?.frontIdPhoto ?? null) },
                  { label: 'Back ID',  src: buildImageUrl(verificationDetail?.backIdPhoto  ?? null) },
                ].map(({ label, src }) => (
                  <div key={label}>
                    <p className="text-sm text-[#4a5565] mb-2 font-medium">{label}</p>
                    {src ? (
                      <img
                        src={src}
                        alt={label}
                        className="w-full rounded-2xl border border-[#3A6EA5]/20 object-cover max-h-48"
                      />
                    ) : (
                      <div className="w-full rounded-2xl border border-dashed border-[#3A6EA5]/30 bg-[#F2F4F6] flex items-center justify-center h-32 text-[#4a5565] text-sm">
                        No image
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl"
                disabled={approveVerification.isPending || verificationDetailLoading}
                onClick={() => {
                  handleApprove(selectedVerificationId)
                  setSelectedVerificationId(null)
                }}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-xl"
                disabled={rejectVerification.isPending || verificationDetailLoading}
                onClick={() => {
                  handleReject(selectedVerificationId)
                  setSelectedVerificationId(null)
                }}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* User Detail Modal */}
      {selectedUser && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedUser(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#3A6EA5] to-[#9CBBDC] flex items-center justify-center text-white text-xl font-bold shrink-0">
                  {selectedUser.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#1a1a1a]">{selectedUser.fullName}</h3>
                  <p className="text-sm text-[#4a5565] mt-0.5">{selectedUser.email}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    {getStatusBadge(selectedUser.accountStatusDisplayName)}
                    {selectedUser.rolesDisplayNames.length > 0 && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                        {selectedUser.rolesDisplayNames.join(', ')}
                      </span>
                    )}
                    {selectedUser.isDeleted && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-600">
                        Deleted
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="rounded-xl border-[#3A6EA5]/20 shrink-0"
                onClick={() => setSelectedUser(null)}
              >
                <XCircle className="w-4 h-4" />
              </Button>
            </div>

            {/* Info row */}
            <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
              <div className="bg-[#F2F4F6] rounded-2xl p-4">
                <p className="text-[#4a5565] mb-1">Joined</p>
                <p className="font-semibold text-[#1a1a1a]">
                  {new Date(selectedUser.createdAt).toLocaleDateString('en-GB')}
                </p>
              </div>
              <div className="bg-[#F2F4F6] rounded-2xl p-4">
                <p className="text-[#4a5565] mb-1">User ID</p>
                <p className="font-mono text-xs font-semibold text-[#1a1a1a] break-all">
                  {selectedUser.userId}
                </p>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {/* Properties */}
              <div className="bg-[#F2F4F6] rounded-2xl p-4">
                <p className="text-xs font-semibold text-[#4a5565] uppercase tracking-wide mb-3">Properties</p>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#4a5565]">Owned</span>
                    <span className="font-semibold text-[#1a1a1a]">{selectedUser.ownedPropertiesCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#4a5565]">Active</span>
                    <span className="font-semibold text-[#1a1a1a]">{selectedUser.activePropertiesCount}</span>
                  </div>
                </div>
              </div>

              {/* Contracts */}
              <div className="bg-[#F2F4F6] rounded-2xl p-4">
                <p className="text-xs font-semibold text-[#4a5565] uppercase tracking-wide mb-3">Contracts</p>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#4a5565]">As Renter</span>
                    <span className="font-semibold text-[#1a1a1a]">{selectedUser.renterContractsCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#4a5565]">As Owner</span>
                    <span className="font-semibold text-[#1a1a1a]">{selectedUser.ownerContractsCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#4a5565]">Active</span>
                    <span className="font-semibold text-green-600">{selectedUser.activeContractsCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#4a5565]">Cancelled</span>
                    <span className="font-semibold text-red-500">{selectedUser.cancelledContractsCount}</span>
                  </div>
                </div>
              </div>

              {/* Payments */}
              <div className="bg-[#F2F4F6] rounded-2xl p-4">
                <p className="text-xs font-semibold text-[#4a5565] uppercase tracking-wide mb-3">Payments</p>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#4a5565]">Made</span>
                    <span className="font-semibold text-[#1a1a1a]">{selectedUser.paymentsMadeCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#4a5565]">Received</span>
                    <span className="font-semibold text-[#1a1a1a]">{selectedUser.paymentsReceivedCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#4a5565]">Total Paid</span>
                    <span className="font-semibold text-red-500">
                      EGP {selectedUser.totalPaidAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#4a5565]">Total Received</span>
                    <span className="font-semibold text-green-600">
                      EGP {selectedUser.totalReceivedAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Reports */}
              <div className="bg-[#F2F4F6] rounded-2xl p-4">
                <p className="text-xs font-semibold text-[#4a5565] uppercase tracking-wide mb-3">Reports</p>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#4a5565]">Submitted</span>
                    <span className="font-semibold text-[#1a1a1a]">{selectedUser.reportsSubmittedCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#4a5565]">Against User</span>
                    <span className={`font-semibold ${selectedUser.reportsAgainstUserCount > 0 ? 'text-red-500' : 'text-[#1a1a1a]'}`}>
                      {selectedUser.reportsAgainstUserCount}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              {selectedUser.accountStatus === 'Verified' ? (
                <>
                  <Button
                    variant="outline"
                    className="flex-1 border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-white rounded-xl"
                    disabled={userAction.isPending}
                    onClick={() => handleUserAction(selectedUser.userId, 'suspend')}
                  >
                    Suspend
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-xl"
                    disabled={userAction.isPending}
                    onClick={() => handleUserAction(selectedUser.userId, 'ban')}
                  >
                    <Ban className="w-4 h-4 mr-2" />
                    Ban
                  </Button>
                </>
              ) : selectedUser.accountStatus === 'Banned' || selectedUser.accountStatus === 'Suspended' ? (
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl"
                  disabled={userAction.isPending}
                  onClick={() => handleUserAction(selectedUser.userId, 'restore')}
                >
                  <UserCheck className="w-4 h-4 mr-2" />
                  Restore
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="flex-1 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-xl"
                  disabled={userAction.isPending}
                  onClick={() => handleUserAction(selectedUser.userId, 'ban')}
                >
                  <Ban className="w-4 h-4 mr-2" />
                  Ban
                </Button>
              )}
              <Button
                variant="outline"
                className="rounded-xl border-[#3A6EA5]/20"
                onClick={() => setSelectedUser(null)}
              >
                Close
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
          >
            <h3 className="text-2xl font-bold text-[#1a1a1a] mb-2">
              Reject Verification
            </h3>
            <p className="text-[#4a5565] mb-5">
              Please provide a reason for rejecting this verification request.
            </p>
            <textarea
              className="w-full rounded-xl border border-[#3A6EA5]/30 bg-[#F2F4F6] p-3 text-sm text-[#1a1a1a] resize-none focus:outline-none focus:ring-2 focus:ring-[#3A6EA5]/40"
              rows={4}
              placeholder="Enter rejection reason…"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="flex gap-4 mt-5">
              <Button
                variant="outline"
                className="flex-1 rounded-xl border-[#3A6EA5]/20"
                onClick={() => {
                  setShowRejectModal(false)
                  setPendingRejectUserId(null)
                  setRejectReason('')
                }}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl"
                disabled={rejectVerification.isPending || !rejectReason.trim()}
                onClick={confirmReject}
              >
                {rejectVerification.isPending ? 'Rejecting…' : 'Confirm Reject'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
          >
            <h3 className="text-2xl font-bold text-[#1a1a1a] mb-4">
              Confirm Action
            </h3>
            <p className="text-[#4a5565] mb-6">
              Are you sure you want to {actionType} this user? This action can
              be reversed later.
            </p>
            <div className="flex gap-4">
              <Button
                variant="outline"
                className="flex-1 rounded-xl border-[#3A6EA5]/20"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl"
                disabled={userAction.isPending}
                onClick={confirmUserAction}
              >
                {userAction.isPending ? 'Processing…' : 'Confirm'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
