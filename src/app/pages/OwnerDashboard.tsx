import {
  Plus,
  Home,
  DollarSign,
  Users,
  Eye,
  Calendar,
  MoreVertical,
  MessageSquare,
  Download,
  CheckCircle,
  XCircle,
  Star,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { Badge } from '../components/ui/badge'
import { Skeleton } from '../components/ui/skeleton'
import { Link } from 'react-router'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { toast } from 'sonner'
import { useState } from 'react'
import { useBookingRequests, useContracts } from '@/hooks/useBookingRequests'
import { useProperties } from '@/hooks/useProperties'

// Static chart data — will be replaced once the owner stats endpoint exists
const EARNINGS_DATA_MONTHLY = [
  { month: 'Jan', earnings: 8400 },
  { month: 'Feb', earnings: 11200 },
  { month: 'Mar', earnings: 9800 },
  { month: 'Apr', earnings: 12600 },
  { month: 'May', earnings: 14000 },
  { month: 'Jun', earnings: 16800 },
]

const EARNINGS_DATA_YEARLY = [
  { month: '2020', earnings: 78000 },
  { month: '2021', earnings: 95000 },
  { month: '2022', earnings: 112000 },
  { month: '2023', earnings: 145000 },
  { month: '2024', earnings: 168000 },
  { month: '2025', earnings: 195000 },
]

const NOTIFICATIONS = [
  {
    id: '1',
    message: 'Payment received from John Smith',
    time: '2 hours ago',
    read: false,
  },
  {
    id: '2',
    message: 'New booking request for Downtown Apartment',
    time: '5 hours ago',
    read: false,
  },
  {
    id: '3',
    message: 'Maintenance request from Emily Davis',
    time: '1 day ago',
    read: true,
  },
  {
    id: '4',
    message: 'New review received (4.5 stars)',
    time: '2 days ago',
    read: true,
  },
]

const getContractStatusBadge = (status: string) => {
  const styles: Record<string, string> = {
    Active: 'bg-green-100 text-green-700 hover:bg-green-100',
    Expired: 'bg-red-100 text-red-700 hover:bg-red-100',
    Pending: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100',
  }
  return styles[status] ?? 'bg-gray-100 text-gray-700 hover:bg-gray-100'
}

export function OwnerDashboard() {
  const [view, setView] = useState('monthly')

  const {
    data: requestsData,
    isLoading: requestsLoading,
    accept,
    reject,
  } = useBookingRequests()

  const { data: contractsData, isLoading: contractsLoading } = useContracts()
  const { data: propertiesData, isLoading: propertiesLoading } = useProperties()

  const bookingRequests = requestsData?.data ?? []
  const contracts = contractsData?.data ?? []
  // propertyService returns ApiResponse<SearchPaginatedResponse<…>>
  // so the array lives at .data.items, not .data
  const myProperties = propertiesData?.data?.items ?? []

  const totalProperties = propertiesData?.data?.totalCount ?? 0
  const occupiedCount = myProperties.filter((p) => p.status === 'rented').length
  const vacantCount = totalProperties - occupiedCount

  const occupancyData = [
    { name: 'Occupied', value: occupiedCount, color: '#3A6EA5' },
    { name: 'Vacant', value: vacantCount, color: '#9CBBDC' },
  ]

  const handleAcceptRequest = (id: string) => {
    accept.mutate(id, {
      onSuccess: () => toast.success('Booking request accepted'),
      onError: () => toast.error('Failed to accept request'),
    })
  }

  const handleDeclineRequest = (id: string) => {
    reject.mutate(id, {
      onSuccess: () => toast.error('Booking request declined'),
      onError: () => toast.error('Failed to decline request'),
    })
  }

  const handleDownloadContract = (contractId: string) => {
    toast.success(`Downloading contract ${contractId}`)
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-[1440px] mx-auto px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#1a1a1a] mb-2">
              Owner Dashboard
            </h1>
            <p className="text-[#4a5565]">
              Manage your properties and track performance
            </p>
          </div>
          <Button
            size="lg"
            className="bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] hover:from-[#2a5a8a] hover:to-[#3A6EA5] text-white rounded-xl shadow-lg shadow-[#3A6EA5]/30"
            asChild
          >
            <Link to="/add-property">
              <Plus className="w-5 h-5 mr-2" />
              Add New Property
            </Link>
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-[#3A6EA5] to-[#9CBBDC] border-none text-white rounded-3xl shadow-lg shadow-[#3A6EA5]/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-white/90">
                <Home className="w-5 h-5" />
                Total Properties
              </CardTitle>
            </CardHeader>
            <CardContent>
              {propertiesLoading ? (
                <Skeleton className="h-10 w-16 bg-white/30" />
              ) : (
                <>
                  <div className="text-4xl font-bold mb-1">
                    {totalProperties}
                  </div>
                  <p className="text-white/80 text-sm">
                    {occupiedCount} occupied • {vacantCount} vacant
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="bg-[#f5f7fa] border-none rounded-3xl shadow-lg shadow-black/5">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[#1a1a1a]">
                <DollarSign className="w-5 h-5 text-[#3A6EA5]" />
                Monthly Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-[#3A6EA5] mb-1">
                16,800 EGP
              </div>
              <p className="text-green-600 text-sm">+12% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-[#f5f7fa] border-none rounded-3xl shadow-lg shadow-black/5">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[#1a1a1a]">
                <DollarSign className="w-5 h-5 text-[#3A6EA5]" />
                Money Saved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-[#3A6EA5] mb-1">
                12,450 EGP
              </div>
              <p className="text-[#4a5565] text-sm mb-3">
                Available for transfer
              </p>
              <Button
                size="sm"
                className="w-full bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] hover:from-[#2a5a8a] hover:to-[#3A6EA5] text-white rounded-xl"
                onClick={() => toast.success('Transfer initiated')}
              >
                Transfer Money
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-[#f5f7fa] border-none rounded-3xl shadow-lg shadow-black/5">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[#1a1a1a]">
                <Users className="w-5 h-5 text-[#3A6EA5]" />
                Pending Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              {requestsLoading ? (
                <Skeleton className="h-10 w-12" />
              ) : (
                <>
                  <div className="text-4xl font-bold text-[#3A6EA5] mb-1">
                    {
                      bookingRequests.filter((r) => r.status === 'pending')
                        .length
                    }
                  </div>
                  <p className="text-[#4a5565] text-sm">
                    Awaiting your response
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Earnings Chart */}
            <Card className="bg-white border-none rounded-3xl shadow-lg shadow-black/5">
              <CardHeader>
                <CardTitle className="text-2xl text-[#1a1a1a]">
                  Earnings Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={
                      view === 'monthly'
                        ? EARNINGS_DATA_MONTHLY
                        : EARNINGS_DATA_YEARLY
                    }
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#3A6EA5"
                      opacity={0.1}
                    />
                    <XAxis dataKey="month" stroke="#4a5565" />
                    <YAxis stroke="#4a5565" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #3A6EA5',
                        borderRadius: '12px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="earnings"
                      stroke="#3A6EA5"
                      strokeWidth={3}
                      dot={{ fill: '#3A6EA5', r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-3 mt-4">
                  {(['monthly', 'yearly'] as const).map((v) => (
                    <Button
                      key={v}
                      size="sm"
                      variant={view === v ? 'default' : 'outline'}
                      className={`rounded-xl ${
                        view === v
                          ? 'bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] hover:from-[#2a5a8a] hover:to-[#3A6EA5] text-white'
                          : 'bg-[#f5f7fa] hover:bg-[#3A6EA5]/10 text-[#1a1a1a] border border-[#3A6EA5]/20'
                      }`}
                      onClick={() => setView(v)}
                    >
                      {v.charAt(0).toUpperCase() + v.slice(1)}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Booking Requests */}
            <Card className="bg-white border-none rounded-3xl shadow-lg shadow-black/5">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl text-[#1a1a1a]">
                    Booking Requests
                  </CardTitle>
                  <Badge className="bg-[#3A6EA5] text-white hover:bg-[#3A6EA5]">
                    {
                      bookingRequests.filter((r) => r.status === 'pending')
                        .length
                    }{' '}
                    New
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {requestsLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-32 w-full rounded-2xl" />
                  ))
                ) : bookingRequests.length === 0 ? (
                  <p className="text-[#4a5565] text-center py-8">
                    No pending booking requests.
                  </p>
                ) : (
                  bookingRequests.map((request) => (
                    <div
                      key={request.id}
                      className="bg-[#f5f7fa] rounded-2xl p-6 hover:shadow-lg transition-shadow border border-[#3A6EA5]/10"
                    >
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-14 h-14">
                            {request.tenantAvatarUrl && (
                              <AvatarImage src={request.tenantAvatarUrl} />
                            )}
                            <AvatarFallback>
                              {request.tenant.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-[#1a1a1a] mb-1">
                              {request.tenant}
                            </h3>
                            <p className="text-sm text-[#4a5565] mb-2">
                              {request.property}
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1 text-[#6a7282]">
                                <Calendar className="w-4 h-4" />
                                {request.requestedDates}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            disabled={
                              accept.isPending || request.status !== 'pending'
                            }
                            onClick={() => handleAcceptRequest(request.id)}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Accept
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={
                              reject.isPending || request.status !== 'pending'
                            }
                            onClick={() => handleDeclineRequest(request.id)}
                            className="flex-1 rounded-xl border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Decline
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="rounded-xl border-[#3A6EA5]/20"
                          >
                            <Link to="/messages">
                              <MessageSquare className="w-4 h-4 mr-1" />
                              Message
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Contracts History */}
            <Card className="bg-white border-none rounded-3xl shadow-lg shadow-black/5">
              <CardHeader>
                <CardTitle className="text-2xl text-[#1a1a1a]">
                  Contracts History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {contractsLoading ? (
                  <Skeleton className="h-48 w-full rounded-2xl" />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#3A6EA5]/20">
                          <th className="text-left py-4 px-4 text-[#1a1a1a] font-semibold">
                            Contract ID
                          </th>
                          <th className="text-left py-4 px-4 text-[#1a1a1a] font-semibold">
                            Property
                          </th>
                          <th className="text-left py-4 px-4 text-[#1a1a1a] font-semibold">
                            Tenant
                          </th>
                          <th className="text-left py-4 px-4 text-[#1a1a1a] font-semibold">
                            Status
                          </th>
                          <th className="text-left py-4 px-4 text-[#1a1a1a] font-semibold">
                            Expiry
                          </th>
                          <th className="text-right py-4 px-4 text-[#1a1a1a] font-semibold">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {contracts.length === 0 ? (
                          <tr>
                            <td
                              colSpan={6}
                              className="text-center py-8 text-[#4a5565]"
                            >
                              No contracts found.
                            </td>
                          </tr>
                        ) : (
                          contracts.map((contract) => (
                            <tr
                              key={contract.id}
                              className="border-b border-[#3A6EA5]/10 hover:bg-[#f5f7fa] transition-colors"
                            >
                              <td className="py-4 px-4 text-[#1a1a1a] font-medium">
                                {contract.id}
                              </td>
                              <td className="py-4 px-4 text-[#4a5565]">
                                {contract.propertyName}
                              </td>
                              <td className="py-4 px-4 text-[#4a5565]">
                                {contract.tenantName}
                              </td>
                              <td className="py-4 px-4">
                                <Badge
                                  className={getContractStatusBadge(
                                    contract.status,
                                  )}
                                >
                                  {contract.status}
                                </Badge>
                              </td>
                              <td className="py-4 px-4 text-[#4a5565]">
                                {contract.expiryDate}
                              </td>
                              <td className="py-4 px-4 text-right">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    handleDownloadContract(contract.id)
                                  }
                                  className="rounded-xl border-[#3A6EA5]/20"
                                >
                                  <Download className="w-4 h-4 mr-1" />
                                  Download
                                </Button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Property Listings */}
            <Card className="bg-white border-none rounded-3xl shadow-lg shadow-black/5">
              <CardHeader>
                <CardTitle className="text-2xl text-[#1a1a1a]">
                  My Properties
                </CardTitle>
              </CardHeader>
              <CardContent>
                {propertiesLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-36 w-full rounded-2xl" />
                    ))}
                  </div>
                ) : myProperties.length === 0 ? (
                  <p className="text-[#4a5565] text-center py-8">
                    No properties yet.{' '}
                    <Link
                      to="/add-property"
                      className="text-[#3A6EA5] hover:underline"
                    >
                      Add your first one.
                    </Link>
                  </p>
                ) : (
                  <div className="space-y-4">
                    {myProperties.map((property) => (
                      <div
                        key={property.id}
                        className="bg-[#f5f7fa] rounded-2xl p-6 hover:shadow-lg transition-shadow"
                      >
                        <div className="flex gap-4">
                          <img
                            src={property.image ?? property.images?.[0] ?? ''}
                            alt={property.title}
                            className="w-32 h-32 rounded-xl object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-semibold text-lg text-[#1a1a1a] mb-1">
                                  {property.title}
                                </h3>
                                <p className="text-sm text-[#4a5565] mb-2">
                                  {property.location} • {property.type}
                                </p>
                              </div>
                              <Badge
                                className={
                                  property.status === 'rented'
                                    ? 'bg-green-100 text-green-700 hover:bg-green-100'
                                    : 'bg-orange-100 text-orange-700 hover:bg-orange-100'
                                }
                              >
                                {property.status === 'rented'
                                  ? 'Occupied'
                                  : 'Vacant'}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div>
                                <p className="text-xs text-[#6a7282] mb-1">
                                  Monthly Rent
                                </p>
                                <p className="font-semibold text-[#3A6EA5]">
                                  {property.price.toLocaleString()} EGP
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-[#6a7282] mb-1">
                                  Rating
                                </p>
                                <p className="text-sm text-[#1a1a1a] flex items-center gap-1">
                                  <Star className="w-4 h-4 fill-[#3A6EA5] text-[#3A6EA5]" />
                                  {property.rating ?? 'N/A'}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-xl border-[#3A6EA5]/20"
                                asChild
                              >
                                <Link to={`/edit-property/${property.id}`}>
                                  Edit
                                </Link>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-xl border-[#3A6EA5]/20"
                                asChild
                              >
                                <Link to={`/property/${property.id}`}>
                                  View Details
                                </Link>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-xl"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-white border-none rounded-3xl shadow-lg shadow-black/5">
              <CardHeader>
                <CardTitle className="text-xl text-[#1a1a1a]">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full justify-start bg-[#f5f7fa] hover:bg-[#3A6EA5]/10 text-[#1a1a1a] rounded-xl border border-[#3A6EA5]/20"
                  variant="outline"
                  asChild
                >
                  <Link to="/messages">
                    <MessageSquare className="w-5 h-5 mr-2 text-[#3A6EA5]" />
                    Messages
                  </Link>
                </Button>
                <Button
                  className="w-full justify-start bg-[#f5f7fa] hover:bg-[#3A6EA5]/10 text-[#1a1a1a] rounded-xl border border-[#3A6EA5]/20"
                  variant="outline"
                  asChild
                >
                  <Link to="/add-property">
                    <Plus className="w-5 h-5 mr-2 text-[#3A6EA5]" />
                    Add Property
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="bg-white border-none rounded-3xl shadow-lg shadow-black/5">
              <CardHeader>
                <CardTitle className="text-xl text-[#1a1a1a]">
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {NOTIFICATIONS.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-xl transition-colors ${
                      notification.read
                        ? 'bg-[#f5f7fa]'
                        : 'bg-[#3A6EA5]/5 border border-[#3A6EA5]/20'
                    }`}
                  >
                    <p className="text-sm text-[#1a1a1a] mb-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-[#6a7282]">
                      {notification.time}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Occupancy Rate */}
            <Card className="bg-white border-none rounded-3xl shadow-lg shadow-black/5">
              <CardHeader>
                <CardTitle className="text-xl text-[#1a1a1a]">
                  Occupancy Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                {propertiesLoading ? (
                  <Skeleton className="h-48 w-full rounded-2xl" />
                ) : (
                  <>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={occupancyData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {occupancyData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-2 mt-4">
                      {occupancyData.map((item) => (
                        <div
                          key={item.name}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="text-sm text-[#1a1a1a]">
                              {item.name}
                            </span>
                          </div>
                          <span className="text-sm font-semibold text-[#1a1a1a]">
                            {item.value}
                            {totalProperties > 0 &&
                              ` (${((item.value / totalProperties) * 100).toFixed(0)}%)`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-white border-none rounded-3xl shadow-lg shadow-black/5">
              <CardHeader>
                <CardTitle className="text-xl text-[#1a1a1a]">
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-[#f5f7fa] rounded-2xl p-4">
                  <p className="text-sm text-[#6a7282] mb-1">
                    Total Properties
                  </p>
                  <p className="text-2xl font-bold text-[#3A6EA5]">
                    {totalProperties}
                  </p>
                </div>
                <div className="bg-[#f5f7fa] rounded-2xl p-4">
                  <p className="text-sm text-[#6a7282] mb-1">
                    Pending Requests
                  </p>
                  <p className="text-2xl font-bold text-[#3A6EA5]">
                    {
                      bookingRequests.filter((r) => r.status === 'pending')
                        .length
                    }
                  </p>
                </div>
                <div className="bg-[#f5f7fa] rounded-2xl p-4">
                  <p className="text-sm text-[#6a7282] mb-1">
                    Active Contracts
                  </p>
                  <p className="text-2xl font-bold text-[#3A6EA5] flex items-center gap-2">
                    {contracts.filter((c) => c.status === 'Active').length}
                    <Eye className="w-5 h-5" />
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
