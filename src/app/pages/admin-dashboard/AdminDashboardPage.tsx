import { motion } from 'motion/react'
import { useSearchParams } from 'react-router-dom'
import {
  Users,
  Building,
  Clock,
  FileText,
  DollarSign,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useAdminStats } from '@/hooks/useAdminStats'
import { formatTrend } from './utils'
import {
  PropertyModerationTab,
  UserManagementTab,
  ReportsTab,
  ModerationReportsTab,
  ContractsModerationTab,
} from './tabs'

export function AdminDashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentTab = searchParams.get('tab') || 'users'

  const handleTabChange = (value: string) => {
    setSearchParams((prev) => {
      prev.set('tab', value)
      // Clear sub-tab params when switching main tabs
      prev.delete('subtab')
      return prev
    }, { replace: true, preventScrollReset: true })
  }

  const { data: statsData, isLoading: statsLoading } = useAdminStats()

  const apiStats = statsData?.data
  const revenueData = apiStats?.monthlyRevenue ?? []

  const stats = [
    {
      icon: Users,
      label: 'Total Users',
      value: statsLoading
        ? '…'
        : (apiStats?.totalUsers?.value ?? 0).toLocaleString(),
      change: statsLoading
        ? ''
        : formatTrend(apiStats?.totalUsers?.trendPercentage),
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Building,
      label: 'Total Listings',
      value: statsLoading
        ? '…'
        : (apiStats?.totalProperties?.value ?? 0).toLocaleString(),
      change: statsLoading
        ? ''
        : formatTrend(apiStats?.totalProperties?.trendPercentage),
      color: 'from-green-500 to-green-600',
    },
    {
      icon: Clock,
      label: 'Pending Verifications',
      value: statsLoading
        ? '…'
        : (apiStats?.pendingVerifications?.value ?? 0).toLocaleString(),
      change: statsLoading
        ? ''
        : formatTrend(apiStats?.pendingVerifications?.trendPercentage),
      color: 'from-yellow-500 to-yellow-600',
    },
    {
      icon: FileText,
      label: 'Active Contracts',
      value: statsLoading
        ? '…'
        : (apiStats?.revenueSummary?.activeContracts ?? 0).toLocaleString(),
      change: statsLoading
        ? ''
        : formatTrend(apiStats?.totalContracts?.trendPercentage),
      color: 'from-purple-500 to-purple-600',
    },
  ]

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
                  {!statsLoading &&
                    apiStats?.revenueSummary?.revenueTrendPercentage !=
                      null && (
                      <p
                        className={`text-sm mt-1 ${
                          apiStats.revenueSummary.revenueTrendPercentage >= 0
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {formatTrend(
                          apiStats.revenueSummary.revenueTrendPercentage,
                        )}{' '}
                        from last period
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
                      : (
                          apiStats?.revenueSummary?.activeContracts ?? 0
                        ).toLocaleString()}
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-4">
                  <p className="text-sm text-[#4a5565] mb-1">
                    New Users (This Month)
                  </p>
                  <p className="text-2xl font-bold text-[#1a1a1a]">
                    {statsLoading
                      ? '…'
                      : (
                          apiStats?.revenueSummary?.newUsersThisMonth ?? 0
                        ).toLocaleString()}
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
          <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-8">
            <TabsList className="w-full h-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 bg-[#F2F4F6] p-2 rounded-[2rem] gap-2 border border-[#3A6EA5]/20 shadow-lg shadow-[#3A6EA5]/15">
              <TabsTrigger
                value="property-moderation"
                className="w-full rounded-2xl py-3 px-2 text-sm font-medium text-[#4a5565] transition-all hover:text-[#3A6EA5] data-[state=active]:bg-white data-[state=active]:text-[#3A6EA5] data-[state=active]:shadow-md border border-transparent data-[state=active]:border-[#3A6EA5]/20 h-auto whitespace-normal text-center"
              >
                Property Moderation
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className="w-full rounded-2xl py-3 px-2 text-sm font-medium text-[#4a5565] transition-all hover:text-[#3A6EA5] data-[state=active]:bg-white data-[state=active]:text-[#3A6EA5] data-[state=active]:shadow-md border border-transparent data-[state=active]:border-[#3A6EA5]/20 h-auto whitespace-normal text-center"
              >
                User Management
              </TabsTrigger>
              <TabsTrigger
                value="reports"
                className="w-full rounded-2xl py-3 px-2 text-sm font-medium text-[#4a5565] transition-all hover:text-[#3A6EA5] data-[state=active]:bg-white data-[state=active]:text-[#3A6EA5] data-[state=active]:shadow-md border border-transparent data-[state=active]:border-[#3A6EA5]/20 h-auto whitespace-normal text-center"
              >
                Analytics
              </TabsTrigger>
              <TabsTrigger
                value="contracts"
                className="w-full rounded-2xl py-3 px-2 text-sm font-medium text-[#4a5565] transition-all hover:text-[#3A6EA5] data-[state=active]:bg-white data-[state=active]:text-[#3A6EA5] data-[state=active]:shadow-md border border-transparent data-[state=active]:border-[#3A6EA5]/20 h-auto whitespace-normal text-center"
              >
                Contracts Moderation
              </TabsTrigger>
              <TabsTrigger
                value="moderation"
                className="w-full rounded-2xl py-3 px-2 text-sm font-medium text-[#4a5565] transition-all hover:text-[#3A6EA5] data-[state=active]:bg-white data-[state=active]:text-[#3A6EA5] data-[state=active]:shadow-md border border-transparent data-[state=active]:border-[#3A6EA5]/20 h-auto whitespace-normal text-center"
              >
                Moderation Reports
              </TabsTrigger>
            </TabsList>

            <TabsContent value="property-moderation">
              <PropertyModerationTab />
            </TabsContent>

            <TabsContent value="users">
              <UserManagementTab />
            </TabsContent>

            <TabsContent value="reports">
              <ReportsTab />
            </TabsContent>

            <TabsContent value="moderation">
              <ModerationReportsTab />
            </TabsContent>

            <TabsContent value="contracts">
              <ContractsModerationTab />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
