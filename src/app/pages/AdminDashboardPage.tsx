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
  useAdminUsers,
  useAdminVerifications,
} from '@/hooks/useAdminStats'
import { adminService } from '@/services/adminService'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function AdminDashboardPage() {
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [actionType, setActionType] = useState<
    'ban' | 'suspend' | 'restore' | null
  >(null)
  const [pendingUserId, setPendingUserId] = useState<string | null>(null)

  const { data: statsData, isLoading: statsLoading } = useAdminStats()
  const { data: verificationsData, isLoading: verificationsLoading } =
    useAdminVerifications()
  const { data: usersData, isLoading: usersLoading } = useAdminUsers()
  const queryClient = useQueryClient()

  const apiStats = statsData?.data
  const pendingVerifications = verificationsData?.data ?? []
  const users = usersData?.data ?? []
  const revenueData = apiStats?.revenueData ?? []

  const stats = [
    {
      icon: Users,
      label: 'Total Users',
      value: statsLoading ? '…' : (apiStats?.totalUsers ?? 0).toLocaleString(),
      change: '',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Building,
      label: 'Total Listings',
      value: statsLoading
        ? '…'
        : (apiStats?.totalListings ?? 0).toLocaleString(),
      change: '',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: Clock,
      label: 'Pending Verifications',
      value: statsLoading
        ? '…'
        : (apiStats?.pendingVerifications ?? 0).toLocaleString(),
      change: '',
      color: 'from-yellow-500 to-yellow-600',
    },
    {
      icon: FileText,
      label: 'Active Contracts',
      value: statsLoading
        ? '…'
        : (apiStats?.activeContracts ?? 0).toLocaleString(),
      change: '',
      color: 'from-purple-500 to-purple-600',
    },
  ]

  const approveVerification = useMutation({
    mutationFn: (id: number) => adminService.approveVerification(id),
    onSuccess: () => {
      toast.success('Verification approved')
      queryClient.invalidateQueries({ queryKey: ['adminVerifications'] })
      queryClient.invalidateQueries({ queryKey: ['adminStats'] })
    },
    onError: () => toast.error('Failed to approve'),
  })

  const rejectVerification = useMutation({
    mutationFn: (id: number) => adminService.rejectVerification(id),
    onSuccess: () => {
      toast.success('Verification rejected')
      queryClient.invalidateQueries({ queryKey: ['adminVerifications'] })
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
      toast.success(`User ${actionType}ned successfully`)
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] })
      setShowConfirmModal(false)
      setPendingUserId(null)
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

  const handleApprove = (id: number) => approveVerification.mutate(id)
  const handleReject = (id: number) => rejectVerification.mutate(id)

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
      Active: 'bg-green-100 text-green-700',
      Suspended: 'bg-red-100 text-red-700',
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
                    EGP 1,017,000
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    +18% from last period
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-4">
                  <p className="text-sm text-[#4a5565] mb-1">
                    Active Contracts
                  </p>
                  <p className="text-2xl font-bold text-[#1a1a1a]">1,234</p>
                </div>
                <div className="bg-white rounded-2xl p-4">
                  <p className="text-sm text-[#4a5565] mb-1">
                    New Users (This Month)
                  </p>
                  <p className="text-2xl font-bold text-[#1a1a1a]">1,401</p>
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
                      <XAxis dataKey="month" stroke="#4a5565" />
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
            <TabsList className="bg-[#F2F4F6] p-2 rounded-2xl">
              <TabsTrigger
                value="verifications"
                className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-[#3A6EA5]"
              >
                Review Submissions
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-[#3A6EA5]"
              >
                User Management
              </TabsTrigger>
              <TabsTrigger
                value="admins"
                className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-[#3A6EA5]"
              >
                Admin Management
              </TabsTrigger>
              <TabsTrigger
                value="reports"
                className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-[#3A6EA5]"
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
                    <div className="flex gap-3">
                      <Select defaultValue="all">
                        <SelectTrigger className="w-40 bg-white rounded-xl border-[#3A6EA5]/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="property">
                            Property Listings
                          </SelectItem>
                          <SelectItem value="contract">Contracts</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#3A6EA5]/20">
                          <th className="text-left py-4 px-4 text-[#1a1a1a] font-semibold">
                            User Name
                          </th>
                          <th className="text-left py-4 px-4 text-[#1a1a1a] font-semibold">
                            Property/Type
                          </th>
                          <th className="text-left py-4 px-4 text-[#1a1a1a] font-semibold">
                            Submission Date
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
                              {Array.from({ length: 5 }).map((_, j) => (
                                <td key={j} className="py-4 px-4">
                                  <Skeleton className="h-5 w-full rounded" />
                                </td>
                              ))}
                            </tr>
                          ))
                        ) : pendingVerifications.length === 0 ? (
                          <tr>
                            <td
                              colSpan={5}
                              className="py-10 text-center text-[#4a5565]"
                            >
                              No pending verifications.
                            </td>
                          </tr>
                        ) : (
                          pendingVerifications.map((item) => (
                            <tr
                              key={item.id}
                              className="border-b border-[#3A6EA5]/10 hover:bg-white/50 transition-colors"
                            >
                              <td className="py-4 px-4 text-[#1a1a1a]">
                                {item.userName}
                              </td>
                              <td className="py-4 px-4 text-[#4a5565]">
                                {item.propertyName}
                              </td>
                              <td className="py-4 px-4 text-[#4a5565]">
                                {item.date}
                              </td>
                              <td className="py-4 px-4">
                                {getStatusBadge(item.status)}
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex gap-2 justify-end">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="rounded-xl border-[#3A6EA5]/20"
                                  >
                                    <Eye className="w-4 h-4 mr-1" />
                                    View
                                  </Button>
                                  <Button
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700 text-white rounded-xl"
                                    disabled={approveVerification.isPending}
                                    onClick={() => handleApprove(item.id)}
                                  >
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-xl"
                                    disabled={rejectVerification.isPending}
                                    onClick={() => handleReject(item.id)}
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
                              key={user.id}
                              className="border-b border-[#3A6EA5]/10 hover:bg-white/50 transition-colors"
                            >
                              <td className="py-4 px-4 text-[#1a1a1a] font-medium">
                                {user.name}
                              </td>
                              <td className="py-4 px-4 text-[#4a5565]">
                                {user.email}
                              </td>
                              <td className="py-4 px-4 text-[#4a5565]">
                                {user.role}
                              </td>
                              <td className="py-4 px-4">
                                {getStatusBadge(user.status)}
                              </td>
                              <td className="py-4 px-4 text-[#4a5565]">
                                {user.joinDate}
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
                                  {user.status === 'Active' ? (
                                    <>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-white rounded-xl"
                                        onClick={() =>
                                          handleUserAction(user.id, 'suspend')
                                        }
                                      >
                                        Suspend
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-xl"
                                        onClick={() =>
                                          handleUserAction(user.id, 'ban')
                                        }
                                      >
                                        <Ban className="w-4 h-4" />
                                      </Button>
                                    </>
                                  ) : (
                                    <Button
                                      size="sm"
                                      className="bg-green-600 hover:bg-green-700 text-white rounded-xl"
                                      onClick={() =>
                                        handleUserAction(user.id, 'restore')
                                      }
                                    >
                                      <UserCheck className="w-4 h-4 mr-1" />
                                      Restore
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
